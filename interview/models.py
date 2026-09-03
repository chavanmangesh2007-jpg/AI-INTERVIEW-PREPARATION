from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('Candidate', 'Candidate'),
        ('Admin', 'Admin'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Candidate')
    target_role = models.CharField(max_length=150, blank=True, default='Software Engineer')
    experience_level = models.CharField(max_length=50, blank=True, default='Entry Level')
    bio = models.TextField(blank=True)
    avatar = models.FileField(upload_to='avatars/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


class InterviewSession(models.Model):
    STATUS_CHOICES = (
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interview_sessions')
    topic = models.CharField(max_length=150)  # e.g., Backend Developer, System Design, HR Behavioral
    difficulty = models.CharField(max_length=50, default='Medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ongoing')
    total_score = models.IntegerField(default=0)  # Average score out of 100
    feedback_summary = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.topic} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"


class InterviewQuestionAnswer(models.Model):
    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    user_answer = models.TextField(blank=True)
    ai_feedback = models.TextField(blank=True)
    score = models.IntegerField(default=0)  # Score 0-100
    suggested_answer = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Q: {self.question_text[:40]}... (Session #{self.session.id})"



class SavedQuestion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_questions')
    question_title = models.CharField(max_length=255)
    category = models.CharField(max_length=100, default='General')  # Data Structures, HR, System Design
    answer_notes = models.TextField(blank=True)
    difficulty = models.CharField(max_length=50, default='Medium')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'question_title')

    def __str__(self):
        return f"{self.user.username} saved: {self.question_title[:30]}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    subject = models.CharField(max_length=255, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name} ({self.email})"

class QuestionBank(models.Model):
    category = models.CharField(max_length=100) # Technical, HR, Coding, Aptitude, Company-Specific
    sub_category = models.CharField(max_length=100, blank=True)
    question_text = models.TextField()
    difficulty = models.CharField(max_length=50, default='Medium') # Easy, Medium, Hard
    sample_answer = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.category}] {self.question_text[:40]}..."

class ActivityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activity_logs', null=True, blank=True)
    action = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username if self.user else 'Anonymous'} - {self.action} at {self.timestamp}"


class UserInterviewSetting(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='interview_settings')
    interview_type = models.CharField(max_length=100, default='Technical Interview')
    difficulty_level = models.CharField(max_length=50, default='Medium')
    interview_duration = models.CharField(max_length=50, default='30 Minutes')
    number_of_questions = models.CharField(max_length=50, default='10 Questions')
    language = models.CharField(max_length=50, default='English')
    enable_voice = models.BooleanField(default=True)
    show_hints = models.BooleanField(default=True)
    record_interview = models.BooleanField(default=False)
    feedback_performance = models.CharField(max_length=50, default='Detailed Feedback')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Interview Settings for {self.user.username}"
