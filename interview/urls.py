from django.urls import path
from . import views
from . import views_admin

urlpatterns = [
    path("", views.home, name="home"),
    path("signup/", views.Signup, name="signup"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("dashboard/", views.dashboard, name="dashboard"),

    # Mock Interview System
    path("mock-interview/", views.mock_interview, name="mock_interview"),
    path("mock-interview/start/", views.start_interview, name="start_interview"),
    path("mock-interview/session/<int:session_id>/", views.session_detail, name="session_detail"),
    path("mock-interview/history/", views.previous_interviews, name="previous_interviews"),
    path("mock-interview/settings/", views.interview_settings, name="Interview_settings"),
    path("mock-interview/help/", views.help_tips, name="Help"),


    # Practice Categories & Topics
    path("practice/", views.practice, name="practice"),
    path("practice/technical/", views.technical_questions, name="technical_questions"),
    path("practice/hr/", views.hr_questions, name="hr_questions"),
    path("practice/hr/general/", views.hr_general, name="hr_general"),
    path("practice/hr/experience/", views.hr_experience, name="hr_experience"),
    path("practice/hr/behavioral/", views.hr_behavioral, name="hr_behavioral"),
    path("practice/hr/company-fit/", views.hr_company_fit, name="hr_company_fit"),
    path("practice/hr/career-goals/", views.hr_career_goals, name="hr_career_goals"),
    path("practice/aptitude/", views.aptitude_questions, name="aptitude_questions"),
    path("practice/system-design/", views.system_design, name="system_design"),
    path("practice/behavioral/", views.behavioral_questions, name="behavioral_questions"),
    path("practice/mixed/", views.mixed_practice, name="mixed_practice"),
    path("practice/company-specific/", views.company_specific, name="company_specific"),
    path("practice/most-asked/", views.most_asked, name="most_asked"),
    path("practice/saved/", views.saved_questions, name="saved_questions"),
    path("data-structure/", views.Data_Structure, name="data_structure"),
    path("algorithms/", views.Algorithms, name="algorithms"),
    path("database/", views.Database, name="database"),
    path("operating-system/", views.Operating_System, name="operating_system"),
    path("computer-networks/", views.Computer_Networks, name="computer_networks"),
    path("oops-concepts/", views.Oops_Concepts, name="oops_concepts"),
    path("miscellaneous/", views.Miscellaneous, name="miscellaneous"),

    # TQ API Endpoints
    path("api/tq/start/", views.tq_start_session, name="tq_start_session"),
    path("api/tq/evaluate/", views.tq_evaluate_answer, name="tq_evaluate_answer"),
    path("api/tq/session-status/<int:session_id>/", views.tq_session_status, name="tq_session_status"),

    # Admin URLs
    path("admin-dashboard/", views_admin.admin_dashboard, name="admin_dashboard"),
    path("api/toggle-save-question/", views.toggle_save_question, name="toggle_save_question"),
    path("api/get-company-questions/", views.get_company_questions, name="get_company_questions"),

    # Profile & Contact
    path("profile/", views.profile, name="profile"),
    path("contact/", views.Contact, name="Contact"),

    # Custom Admin Site
    path("admin-panel/", views_admin.admin_dashboard, name="admin_dashboard"),
    path("admin-panel/users/", views_admin.admin_users, name="admin_users"),
    path("admin-panel/users/create/", views_admin.admin_user_create, name="admin_user_create"),
    path("admin-panel/users/edit/<int:user_id>/", views_admin.admin_user_edit, name="admin_user_edit"),
    path("admin-panel/users/toggle/<int:user_id>/", views_admin.admin_user_toggle, name="admin_user_toggle"),
    path("admin-panel/users/delete/<int:user_id>/", views_admin.admin_user_delete, name="admin_user_delete"),
    

    path("admin-panel/interviews/", views_admin.admin_interviews, name="admin_interviews"),
    path("admin-panel/interviews/<int:session_id>/", views_admin.admin_interview_detail, name="admin_interview_detail"),
    path("admin-panel/interviews/delete/<int:session_id>/", views_admin.admin_interview_delete, name="admin_interview_delete"),
    
    
    path("admin-panel/feedback/", views_admin.admin_feedback, name="admin_feedback"),
    path("admin-panel/feedback/toggle/<int:message_id>/", views_admin.admin_feedback_toggle, name="admin_feedback_toggle"),
    path("admin-panel/feedback/delete/<int:message_id>/", views_admin.admin_feedback_delete, name="admin_feedback_delete"),
    
    path("admin-panel/analytics/", views_admin.admin_analytics, name="admin_analytics"),

    path("admin-panel/settings/", views_admin.admin_settings, name="admin_settings"),

    # Feature Detail Pages
    path("feature/mock-interview/", views.feature_mock_interview, name="feature_mock_interview"),
    path("feature/dashboard/", views.feature_dashboard, name="feature_dashboard"),
    path("feature/practice/", views.feature_practice, name="feature_practice"),
]