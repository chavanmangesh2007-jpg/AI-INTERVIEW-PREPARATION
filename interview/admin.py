from django.contrib import admin
# pyrefly: ignore [missing-import]
from .models import (
    UserProfile,
    InterviewSession,
    InterviewQuestionAnswer,
    SavedQuestion,
    ContactMessage
)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'target_role', 'experience_level', 'created_at')
    search_fields = ('user__username', 'user__email', 'full_name', 'target_role')


class InterviewQuestionAnswerInline(admin.TabularInline):
    model = InterviewQuestionAnswer
    extra = 0


@admin.register(InterviewSession)
class InterviewSessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'topic', 'difficulty', 'status', 'total_score', 'created_at')
    list_filter = ('topic', 'difficulty', 'status', 'created_at')
    search_fields = ('user__username', 'topic')
    inlines = [InterviewQuestionAnswerInline]



@admin.register(SavedQuestion)
class SavedQuestionAdmin(admin.ModelAdmin):
    list_display = ('user', 'question_title', 'category', 'difficulty', 'created_at')
    list_filter = ('category', 'difficulty')
    search_fields = ('user__username', 'question_title')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
