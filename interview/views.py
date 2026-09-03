from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login as auth_login, logout as auth_logout, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.utils import timezone
from django.db.models import Avg
from django.core.mail import send_mail

from .models import (
    UserProfile,
    InterviewSession,
    InterviewQuestionAnswer,
    SavedQuestion,
    ContactMessage,
    UserInterviewSetting
)
from .services import (
    generate_interview_questions,
    evaluate_interview_answer
)
from django.conf import settings
try:
    from twilio.rest import Client
except ImportError:
    Client = None

def home(request):
    """Landing Page"""
    try:
        user_count = User.objects.count()
        interview_count = InterviewSession.objects.count()
        
        # Calculate success rate based on interviews with score >= 70
        if interview_count > 0:
            successful_interviews = InterviewSession.objects.filter(total_score__gte=70).count()
            success_rate = int((successful_interviews / interview_count) * 100)
        else:
            success_rate = 0
    except Exception:
        user_count = 0
        interview_count = 0
        success_rate = 0
        
    context = {
        'user_count': user_count,
        'interview_count': interview_count,
        'success_rate': success_rate,
        'user_rating': "4.8/5" # Hardcoded until reviews are added
    }
    return render(request, "home.html", context)


def Signup(request):
    """User Registration Handler"""
    if request.user.is_authenticated:
        return redirect("dashboard")

    if request.method == "POST":
        fullname = request.POST.get("fullname", "").strip()
        email = request.POST.get("email", "").strip()
        password = request.POST.get("password", "")
        confirm_password = request.POST.get("confirm_password", "")

        if not email or not password:
            messages.error(request, "Please enter email and password.")
            return render(request, "Signup.html")

        if not email.lower().endswith("@gmail.com"):
            messages.error(request, "Please enter a valid Google email address (@gmail.com).")
            return render(request, "Signup.html")

        if password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return render(request, "Signup.html")

        # Use email as username if username not provided
        username = email.split('@')[0]
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        if User.objects.filter(email=email).exists():
            messages.error(request, "An account with this email already exists.")
            return render(request, "Signup.html")

        user = User.objects.create_user(username=username, email=email, password=password)
        if fullname:
            user.first_name = fullname
            user.save()

        # Create Profile safely
        UserProfile.objects.get_or_create(user=user, defaults={'full_name': fullname or username})

        # Explicitly set authentication backend to persist login session across protected views
        auth_login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        request.session['is_new_user'] = True
        messages.success(request, f"Welcome to AI Interview Assistant, {user.first_name or user.username}!")
        return redirect("dashboard")

    return render(request, "Signup.html")


def login(request):
    """User Login Handler"""
    if request.user.is_authenticated:
        return redirect("dashboard")

    if request.method == "POST":
        email_or_username = request.POST.get("email", "").strip()
        password = request.POST.get("password", "")

        # Support login via email or username
        user_obj = User.objects.filter(email=email_or_username).first()
        username = user_obj.username if user_obj else email_or_username

        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            messages.success(request, f"Welcome back, {user.first_name or user.username}!")
            next_url = request.GET.get('next', 'dashboard')
            return redirect(next_url)
        else:
            messages.error(request, "Invalid email/username or password.")

    return render(request, "login.html")


def logout_view(request):
    """User Logout Handler"""
    auth_logout(request)
    messages.info(request, "You have been logged out.")
    return redirect("login")


@login_required
def dashboard(request):
    """User Dashboard View"""
    user_sessions = InterviewSession.objects.filter(user=request.user).order_by('-created_at')
    total_interviews = user_sessions.count()
    avg_score = user_sessions.aggregate(Avg('total_score'))['total_score__avg'] or 0

    recent_sessions = user_sessions[:5]
    saved_questions_count = SavedQuestion.objects.filter(user=request.user).count()

    is_new_user = request.session.pop('is_new_user', False)

    context = {
        'total_interviews': total_interviews,
        'avg_score': round(avg_score, 1),
        'recent_sessions': recent_sessions,
        'saved_questions_count': saved_questions_count,
        'is_new_user': is_new_user,
    }
    return render(request, "dashboard.html", context)


@login_required
def profile(request):
    """User Profile View and Update"""
    profile_obj, _ = UserProfile.objects.get_or_create(user=request.user)

    if request.method == "POST":
        full_name = request.POST.get("full_name", "").strip()
        target_role = request.POST.get("target_role", "").strip()
        experience_level = request.POST.get("experience_level", "").strip()
        bio = request.POST.get("bio", "").strip()

        profile_obj.full_name = full_name
        profile_obj.target_role = target_role
        profile_obj.experience_level = experience_level
        profile_obj.bio = bio

        if 'avatar' in request.FILES:
            profile_obj.avatar = request.FILES['avatar']

        profile_obj.save()
        messages.success(request, "Profile updated successfully!")
        return redirect("profile")

    return render(request, "profile.html", {'profile': profile_obj})


@login_required
def mock_interview(request):
    """Mock Interview Setup Page"""
    return render(request, "mock_Interview.html")


@login_required
def start_interview(request):
    """Starts a new mock interview session and generates questions"""
    if request.method == "POST":
        topic = request.POST.get("topic", "Software Engineer")
        difficulty = request.POST.get("difficulty", "Medium")

        session = InterviewSession.objects.create(
            user=request.user,
            topic=topic,
            difficulty=difficulty,
            status='ongoing'
        )

        questions = generate_interview_questions(topic=topic, difficulty=difficulty, count=20)
        for q_text in questions:
            InterviewQuestionAnswer.objects.create(
                session=session,
                question_text=q_text
            )

        return redirect("session_detail", session_id=session.id)

    return redirect("mock_interview")


@login_required
def session_detail(request, session_id):
    """Renders the interactive question answering view for a specific session"""
    session = get_object_or_404(InterviewSession, id=session_id, user=request.user)
    qa_list = session.questions.all()

    if request.method == "POST":
        # Answer submission for a single question
        qa_id = request.POST.get("qa_id")
        user_answer = request.POST.get("user_answer", "").strip()

        qa_item = get_object_or_404(InterviewQuestionAnswer, id=qa_id, session=session)
        evaluation = evaluate_interview_answer(qa_item.question_text, user_answer, topic=session.topic)

        qa_item.user_answer = user_answer
        qa_item.ai_feedback = evaluation['ai_feedback']
        qa_item.score = evaluation['score']
        qa_item.suggested_answer = evaluation['suggested_answer']
        qa_item.save()

        # Update overall session score
        answered_qas = session.questions.exclude(user_answer='')
        if answered_qas.exists():
            avg_score = answered_qas.aggregate(Avg('score'))['score__avg'] or 0
            session.total_score = int(avg_score)
            if answered_qas.count() == session.questions.count():
                session.status = 'completed'
                session.completed_at = timezone.now()
            session.save()

        messages.success(request, "Answer submitted and evaluated by AI!")
        return redirect("session_detail", session_id=session.id)

    return render(request, "Mock Interview.html", {
        'session': session,
        'qa_list': qa_list,
    })





@login_required
def practice(request):
    """Practice main overview page"""
    from django.urls import reverse
    user = request.user
    
    # Questions available (fixed for now)
    questions_available = 1256
    
    # Tests taken
    completed_sessions = InterviewSession.objects.filter(user=user, status='completed')
    tests_taken = completed_sessions.count()
    
    # Average Score
    if completed_sessions.exists():
        avg_score = completed_sessions.aggregate(Avg('total_score'))['total_score__avg']
        average_score = int(avg_score) if avg_score else 0
    else:
        average_score = 0
        
    # Streak Days
    from django.db.models.functions import TruncDate
    import datetime
    
    dates = completed_sessions.annotate(date=TruncDate('created_at')).values_list('date', flat=True).distinct().order_by('-date')
    
    streak_days = 0
    if dates:
        current_date = datetime.date.today()
        for d in dates:
            if d == current_date:
                streak_days += 1
                current_date -= datetime.timedelta(days=1)
            elif d == current_date - datetime.timedelta(days=1) and streak_days == 0:
                # If they missed today but did yesterday, count from yesterday
                streak_days += 1
                current_date = d - datetime.timedelta(days=1)
            else:
                break
    # Map topics to their view names for resuming
    topic_map = {
        'System Design': 'system_design',
        'Aptitude Questions': 'aptitude_questions',
        'HR General': 'hr_general',
        'HR Behavioral': 'hr_behavioral',
        'HR Experience': 'hr_experience',
        'HR Company Fit': 'hr_company_fit',
        'HR Career Goals': 'hr_career_goals',
        'Behavioral Questions': 'behavioral_questions',
        'Mixed Practice': 'mixed_practice',
        'Company Specific': 'company_specific',
        'Most Asked': 'most_asked',
        'Technical Questions': 'technical_questions',
        'Data Structure': 'data_structure',
        'Algorithms': 'algorithms',
        'Database': 'database',
        'Operating System': 'operating_system',
        'Computer Networks': 'computer_networks',
        'Oops Concepts': 'oops_concepts',
        'Miscellaneous': 'miscellaneous'
    }
    
    # Recent Sessions for Continue Practice Table (only practice topics)
    practice_topics = list(topic_map.keys())
    recent_sessions = list(InterviewSession.objects.filter(user=user, topic__in=practice_topics).order_by('-created_at')[:5])
    
    for session in recent_sessions:
        view_name = topic_map.get(session.topic, 'practice')
        session.resume_url = f"{reverse(view_name)}?session_id={session.id}"
            
    context = {
        'questions_available': questions_available,
        'tests_taken': tests_taken,
        'average_score': average_score,
        'streak_days': streak_days,
        'recent_sessions': recent_sessions,
    }
    
    return render(request, "Practice.html", context)


@login_required
def technical_questions(request):
    """Technical Questions Page"""
    user = request.user
    
    # Static info
    total_questions = 650
    categories = 7
    
    # Dynamic info
    saved_count = SavedQuestion.objects.filter(user=user).count()
    
    # Calculate progress (mock logic)
    tq_sessions_count = InterviewSession.objects.filter(user=user).exclude(topic__icontains='HR').count()
    progress = min(100, tq_sessions_count * 5)
    
    # Recent Technical Questions
    recent_questions = InterviewQuestionAnswer.objects.filter(
        session__user=user
    ).exclude(
        session__topic__icontains='HR'
    ).order_by('-created_at')[:5]

    context = {
        'total_questions': total_questions,
        'categories': categories,
        'saved_count': saved_count,
        'progress': progress,
        'recent_questions': recent_questions
    }
    return render(request, "Technical_Question.html", context)

@login_required
def hr_questions(request):
    """HR Questions Page"""
    user = request.user
    
    # Static info
    total_questions = 250
    categories = 5
    
    # Dynamic info
    saved_count = SavedQuestion.objects.filter(user=user).count()
    
    # Calculate progress (mock logic: 10% per HR session up to 100%)
    hr_sessions_count = InterviewSession.objects.filter(user=user, topic__icontains='HR').count()
    progress = min(100, hr_sessions_count * 10)
    
    # Recent HR Questions
    recent_questions = InterviewQuestionAnswer.objects.filter(
        session__user=user, 
        session__topic__icontains='HR'
    ).order_by('-created_at')[:5]

    context = {
        'total_questions': total_questions,
        'categories': categories,
        'saved_count': saved_count,
        'progress': progress,
        'recent_questions': recent_questions
    }
    return render(request, "HR Question.html", context)

def hr_general(request):
    """HR General Questions Page"""
    return render(request, "HR General.html")

def hr_experience(request):
    """HR Experience Questions Page"""
    return render(request, "HR Experiance.html")

def hr_behavioral(request):
    """HR Behavioral Questions Page"""
    return render(request, "HR Behiveral.html")

def hr_company_fit(request):
    """HR Company Fit Questions Page"""
    return render(request, "HR Company.html")

def hr_career_goals(request):
    """HR Career Goals Questions Page"""
    return render(request, "HR Career.html")


def aptitude_questions(request):
    return render(request, "Apitude Question.html")


def system_design(request):
    return render(request, "System Design.html")


def behavioral_questions(request):
    return render(request, "Practice Behaveral.html")


def mixed_practice(request):
    return render(request, "Mixed Practice.html")


def company_specific(request):
    return render(request, "Company Specific.html")


def most_asked(request):
    return render(request, "Most Asked.html")


def saved_questions(request):
    saved_list = []
    if request.user.is_authenticated:
        saved_list = SavedQuestion.objects.filter(user=request.user)
    return render(request, "Saved Question MI.html", {'saved_questions': saved_list})


def Data_Structure(request):
    return render(request, "TQ Data Structure.html")


def Algorithms(request):
    return render(request, "TQ Algorithms.html")

def Database(request):
    return render(request, "TQ Database.html")

def Operating_System(request):
    return render(request, "TQ Operating System.html")

def Computer_Networks(request):
    return render(request, "TQ Network.html")

def Oops_Concepts(request):
    return render(request, "TQ oops.html")

def Miscellaneous(request):
    return render(request, "TQ Miscellaneous.html")


def Contact(request):
    """Contact Form Handler"""
    if request.method == "POST":
        name = request.POST.get("name", "").strip()
        email = request.POST.get("email", "").strip()
        subject = request.POST.get("subject", "").strip()
        message = request.POST.get("message", "").strip()

        if name and email and message:
            ContactMessage.objects.create(
                name=name,
                email=email,
                subject=subject,
                message=message
            )
            
            # Send email notification
            email_subject = f"New Contact Message: {subject}"
            email_body = f"Name: {name}\nEmail: {email}\nSubject: {subject}\n\nMessage:\n{message}"
            try:
                send_mail(
                    email_subject,
                    email_body,
                    'aiinterviewprep05@gmail.com',
                    ['aiinterviewprep05@gmail.com'],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Error sending email: {e}")
                messages.error(request, f"Message saved, but failed to send email. Did you configure the Google App Password? Error: {e}")
                return redirect("Contact")
                
            # Send SMS Notification via Twilio
            try:
                if Client and getattr(settings, 'TWILIO_ACCOUNT_SID', None) and settings.TWILIO_ACCOUNT_SID != 'your-twilio-account-sid-here':
                    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
                    sms_body = f"New message from {name} ({email}) - {subject}"
                    
                    message = client.messages.create(
                        body=sms_body,
                        from_=settings.TWILIO_PHONE_NUMBER,
                        to=settings.TARGET_PHONE_NUMBER
                    )
            except Exception as e:
                print(f"Error sending SMS: {e}")
                
            messages.success(request, "Thank you! Your message has been sent successfully.")
            return redirect("Contact")
        else:
            messages.error(request, "Please fill in all required fields.")

    return render(request, "Contact.html")


@login_required
def toggle_save_question(request):
    """API view to bookmark/unbookmark practice questions"""
    if request.method == "POST":
        title = request.POST.get("title", "").strip()
        category = request.POST.get("category", "General")

        if title:
            obj, created = SavedQuestion.objects.get_or_create(
                user=request.user,
                question_title=title,
                defaults={'category': category}
            )
            if not created:
                obj.delete()
                return JsonResponse({'status': 'removed', 'saved': False})
            return JsonResponse({'status': 'saved', 'saved': True})

    return JsonResponse({'error': 'Invalid request'}, status=400)


# ==========================================
# Feature Detail Views (Marketing Pages)
# ==========================================

def feature_mock_interview(request):
    """Marketing page for AI Mock Interviews"""
    return render(request, "feature_mock_interview.html")

def feature_dashboard(request):
    """Marketing page for Performance Dashboard"""
    return render(request, "feature_dashboard.html")

def feature_practice(request):
    """Marketing page for Practice Questions"""
    return render(request, "feature_practice.html")

from .company_data import company_questions
from django.http import JsonResponse

def get_company_questions(request):
    company = request.GET.get('company', 'General')
    questions = company_questions.get(company, company_questions.get('General', []))
    return JsonResponse({'questions': questions})

@login_required
def interview_settings(request):
    """Interview Settings Page"""
    from django.core.management import call_command
    from django.db.utils import OperationalError
    
    # Auto-apply migrations if they haven't been applied yet
    try:
        setting, created = UserInterviewSetting.objects.get_or_create(user=request.user)
    except OperationalError:
        try:
            call_command('makemigrations', interactive=False)
            call_command('migrate', interactive=False)
            setting, created = UserInterviewSetting.objects.get_or_create(user=request.user)
        except Exception as e:
            setting = None
            messages.error(request, f"Database error: {str(e)}")

    if request.method == "POST":
        if setting is None:
            messages.error(request, "Cannot save settings due to a database error.")
            return redirect("Interview_settings")
        setting.interview_type = request.POST.get("interview_type", "Technical Interview")
        setting.difficulty_level = request.POST.get("difficulty_level", "Medium")
        setting.interview_duration = request.POST.get("interview_duration", "30 Minutes")
        setting.number_of_questions = request.POST.get("number_of_questions", "10 Questions")
        setting.language = request.POST.get("language", "English")
        
        # Checkboxes return 'on' if checked, else None
        setting.enable_voice = request.POST.get("enable_voice") == "on"
        setting.show_hints = request.POST.get("show_hints") == "on"
        setting.record_interview = request.POST.get("record_interview") == "on"
        
        setting.feedback_performance = request.POST.get("feedback_performance", "Detailed Feedback")

        setting.save()
        messages.success(request, "Settings saved successfully!")
        return redirect("Interview_settings")

    return render(request, "Interview Settings MI.html", {"setting": setting})

@login_required
def help_tips(request):
    """Help & Tips Page"""
    return render(request, "MI helps, Tips.html")

@login_required
def previous_interviews(request):
    """Previous Mock Interviews Page"""
    sessions = InterviewSession.objects.filter(user=request.user).order_by('-created_at')
    
    total_interviews = sessions.count()
    avg_score = sessions.aggregate(Avg('total_score'))['total_score__avg'] or 0
    avg_score = int(avg_score)
    
    now = timezone.now()
    this_month_count = sessions.filter(created_at__year=now.year, created_at__month=now.month).count()
    
    best_session = sessions.order_by('-total_score').first()
    best_score = best_session.total_score if best_session else 0
    best_topic = best_session.topic if best_session else "N/A"

    context = {
        'sessions': sessions,
        'total_interviews': total_interviews,
        'avg_score': avg_score,
        'this_month_count': this_month_count,
        'best_score': best_score,
        'best_topic': best_topic,
    }
    return render(request, "Previous Mock Interview.html", context)


import json
from django.views.decorators.csrf import csrf_exempt

@login_required
@csrf_exempt
def tq_start_session(request):
    """Starts a new Technical Question session in the backend."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            topic = data.get("topic", "Technical Questions")
            
            session = InterviewSession.objects.create(
                user=request.user,
                topic=topic,
                difficulty="Medium",
                status='ongoing'
            )
            return JsonResponse({'session_id': session.id})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)


@login_required
def tq_session_status(request, session_id):
    """Returns the status and answered question count for a session."""
    if request.method == "GET":
        try:
            session = get_object_or_404(InterviewSession, id=session_id, user=request.user)
            answered_count = session.questions.exclude(user_answer='').count()
            return JsonResponse({
                'success': True,
                'status': session.status,
                'answered_count': answered_count
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)


@login_required
@csrf_exempt
def tq_evaluate_answer(request):
    """Evaluates a single Technical Question answer and updates the session."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            session_id = data.get("session_id")
            question_text = data.get("question_text", "").strip()
            user_answer = data.get("user_answer", "").strip()
            is_final = data.get("is_final", False)

            if not session_id or not question_text:
                return JsonResponse({'error': 'Missing required fields.'}, status=400)

            session = get_object_or_404(InterviewSession, id=session_id, user=request.user)

            # Evaluate the answer
            evaluation = evaluate_interview_answer(question_text, user_answer, topic=session.topic)

            # Save the record
            InterviewQuestionAnswer.objects.create(
                session=session,
                question_text=question_text,
                user_answer=user_answer,
                ai_feedback=evaluation['ai_feedback'],
                score=evaluation['score'],
                suggested_answer=evaluation['suggested_answer']
            )

            # Update overall session score
            answered_qas = session.questions.exclude(user_answer='')
            if answered_qas.exists():
                avg_score = answered_qas.aggregate(Avg('score'))['score__avg'] or 0
                session.total_score = int(avg_score)
                if is_final:
                    session.status = 'completed'
                    session.completed_at = timezone.now()
                session.save()

            return JsonResponse({'success': True, 'score': evaluation['score']})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

