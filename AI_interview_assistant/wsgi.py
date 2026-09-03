"""
WSGI config for AI_interview_assistant project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AI_interview_assistant.settings')

application = get_wsgi_application()

app = application

if os.getenv('VERCEL') or os.environ.get('VERCEL_ENV'):
    try:
        from django.core.management import call_command
        call_command('migrate', interactive=False)
    except Exception as e:
        print(f"Auto migration check: {e}")
