from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login
from .models import UserProfile

class SessionUserMiddleware:
    """
    Middleware that preserves user authentication session state across requests.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if hasattr(request, 'user') and not request.user.is_authenticated:
            user_info = request.session.get('user_info')
            if user_info and isinstance(user_info, dict):
                username = user_info.get('username')
                email = user_info.get('email', '')
                first_name = user_info.get('first_name', '')

                if username:
                    try:
                        user, created = User.objects.get_or_create(
                            username=username,
                            defaults={'email': email, 'first_name': first_name}
                        )
                        if created:
                            user.set_unusable_password()
                            user.save()
                            UserProfile.objects.get_or_create(
                                user=user,
                                defaults={'full_name': first_name or username}
                            )

                        auth_login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                    except Exception as e:
                        print(f"SessionUserMiddleware auto-login failed: {e}")

        response = self.get_response(request)
        return response
