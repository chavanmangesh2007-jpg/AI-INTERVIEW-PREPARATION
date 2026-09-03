from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from .models import UserProfile, InterviewSession, ContactMessage, InterviewQuestionAnswer
from django.db.models import Avg
from django.utils import timezone
from datetime import timedelta

def is_admin(user):
    return user.is_authenticated and (user.is_superuser or (hasattr(user, 'profile') and user.profile.role.lower() == 'admin'))

def admin_required(view_func):
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('login')
        if not is_admin(request.user):
            messages.error(request, "Access Denied: Only Admin users can access the Admin Panel.")
            return redirect('dashboard')
        return view_func(request, *args, **kwargs)
    return _wrapped_view

@admin_required
def admin_dashboard(request):
    total_users = User.objects.count()
    active_users = User.objects.filter(last_login__gte=timezone.now() - timedelta(days=30)).count()
    total_interviews = InterviewSession.objects.count()
    ai_questions = InterviewQuestionAnswer.objects.count()
    avg_score = InterviewSession.objects.aggregate(Avg('total_score'))['total_score__avg'] or 0
    recent_users = UserProfile.objects.order_by('-created_at')[:5]
    
    context = {
        'total_users': total_users,
        'active_users': active_users,
        'total_interviews': total_interviews,
        'ai_questions': ai_questions,
        'avg_score': round(avg_score, 1),
        'recent_users': recent_users,
    }
    return render(request, 'admin_dashboard.html', context)

@admin_required
def admin_users(request):
    profiles = UserProfile.objects.select_related('user').all().order_by('-created_at')
    return render(request, 'admin_users.html', {'profiles': profiles})

@admin_required
def admin_user_create(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        full_name = request.POST.get('full_name')
        role = request.POST.get('role', 'Candidate')
        target_role = request.POST.get('target_role', 'Software Engineer')
        
        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists.")
            return redirect('admin_user_create')
            
        user = User.objects.create_user(username=username, email=email, password=password)
        UserProfile.objects.create(user=user, full_name=full_name, role=role, target_role=target_role)
        messages.success(request, f"User {username} created successfully.")
        return redirect('admin_users')
        
    return render(request, 'admin_user_form.html')

@admin_required
def admin_user_edit(request, user_id):
    user = User.objects.get(id=user_id)
    profile = user.profile
    
    if request.method == 'POST':
        user.email = request.POST.get('email')
        user.save()
        
        profile.full_name = request.POST.get('full_name')
        profile.role = request.POST.get('role', 'Candidate')
        profile.target_role = request.POST.get('target_role', 'Software Engineer')
        profile.save()
        
        messages.success(request, f"User {user.username} updated successfully.")
        return redirect('admin_users')
        
    return render(request, 'admin_user_form.html', {'edit_user': user, 'profile': profile})

@admin_required
def admin_user_toggle(request, user_id):
    if request.method == 'POST':
        user = User.objects.get(id=user_id)
        if user == request.user:
            messages.error(request, "You cannot deactivate your own admin account.")
            return redirect('admin_users')
            
        user.is_active = not user.is_active
        user.save()
        status = "activated" if user.is_active else "deactivated"
        messages.success(request, f"User {user.username} has been {status}.")
    return redirect('admin_users')

@admin_required
def admin_user_delete(request, user_id):
    if request.method == 'POST':
        user = User.objects.get(id=user_id)
        if user == request.user:
            messages.error(request, "You cannot delete your own admin account.")
            return redirect('admin_users')
            
        username = user.username
        user.delete()
        messages.success(request, f"User {username} has been permanently deleted.")
    return redirect('admin_users')

from .models import QuestionBank



@admin_required
def admin_interviews(request):
    interviews = InterviewSession.objects.select_related('user', 'user__profile').all().order_by('-created_at')
    return render(request, 'admin_interviews.html', {'interviews': interviews})

@admin_required
def admin_interview_detail(request, session_id):
    session = InterviewSession.objects.prefetch_related('questions').get(id=session_id)
    return render(request, 'admin_interview_detail.html', {'session': session})

@admin_required
def admin_interview_delete(request, session_id):
    if request.method == 'POST':
        session = InterviewSession.objects.get(id=session_id)
        session.delete()
        messages.success(request, "Interview session has been permanently deleted.")
    return redirect('admin_interviews')


@admin_required
def admin_feedback(request):
    feedback = ContactMessage.objects.all().order_by('-created_at')
    return render(request, 'admin_feedback.html', {'feedback': feedback})

@admin_required
def admin_feedback_toggle(request, message_id):
    if request.method == 'POST':
        msg = ContactMessage.objects.get(id=message_id)
        msg.is_read = not msg.is_read
        msg.save()
        status = "read" if msg.is_read else "unread"
        messages.success(request, f"Message marked as {status}.")
    return redirect('admin_feedback')

@admin_required
def admin_feedback_delete(request, message_id):
    if request.method == 'POST':
        msg = ContactMessage.objects.get(id=message_id)
        msg.delete()
        messages.success(request, "Message has been deleted.")
    return redirect('admin_feedback')

from .models import SavedQuestion, ActivityLog

@admin_required
def admin_analytics(request):
    context = {
        'total_interviews': InterviewSession.objects.count(),
        'avg_score': round(InterviewSession.objects.aggregate(Avg('total_score'))['total_score__avg'] or 0, 1),
        'total_users': User.objects.count(),
        'total_saved_q': SavedQuestion.objects.count(),
        'ai_questions': InterviewQuestionAnswer.objects.count(),
        'recent_sessions': InterviewSession.objects.select_related('user', 'user__profile').order_by('-created_at')[:5]
    }
    return render(request, 'admin_analytics.html', context)



@admin_required
def admin_settings(request):
    if request.method == 'POST':
        user = request.user
        user.email = request.POST.get('email', user.email)
        user.first_name = request.POST.get('first_name', user.first_name)
        user.last_name = request.POST.get('last_name', user.last_name)
        
        new_password = request.POST.get('new_password')
        if new_password:
            user.set_password(new_password)
            
        user.save()
        messages.success(request, "Admin settings updated successfully.")
        return redirect('admin_settings')
        
    logs = ActivityLog.objects.select_related('user').all().order_by('-timestamp')[:50]
    return render(request, 'admin_settings.html', {'logs': logs})
