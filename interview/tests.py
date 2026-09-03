import os
import tempfile
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from interview.models import (
    UserProfile,
    InterviewSession,
    InterviewQuestionAnswer,
    SavedQuestion,
    ContactMessage
)
from interview.services import (
    generate_interview_questions,
    evaluate_interview_answer
)


class AIInterviewBackendTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testcandidate',
            email='candidate@example.com',
            password='Password123!'
        )
        self.profile = UserProfile.objects.create(
            user=self.user,
            full_name='Test Candidate',
            target_role='Software Engineer'
        )

    def test_signup_view(self):
        response = self.client.post(reverse('signup'), {
            'fullname': 'New User',
            'email': 'newuser@example.com',
            'password': 'Password123!',
            'confirm_password': 'Password123!'
        })
        self.assertEqual(response.status_code, 302)
        self.assertTrue(User.objects.filter(email='newuser@example.com').exists())

    def test_login_view(self):
        response = self.client.post(reverse('login'), {
            'email': 'candidate@example.com',
            'password': 'Password123!'
        })
        self.assertEqual(response.status_code, 302)
        self.assertEqual(int(self.client.session['_auth_user_id']), self.user.pk)

    def test_contact_form(self):
        response = self.client.post(reverse('Contact'), {
            'name': 'Aditya',
            'email': 'aditya@example.com',
            'subject': 'Technical Support',
            'message': 'Need help with mock interview sessions.'
        })
        self.assertEqual(response.status_code, 302)
        self.assertTrue(ContactMessage.objects.filter(email='aditya@example.com').exists())

    def test_mock_interview_services(self):
        questions = generate_interview_questions(topic='Backend Developer', count=3)
        self.assertEqual(len(questions), 3)

        evaluation = evaluate_interview_answer(
            question_text="Explain RESTful API architecture.",
            user_answer="RESTful APIs use HTTP verbs like GET, POST, PUT, DELETE to manipulate stateless resource representations.",
            topic='Backend Developer'
        )
        self.assertGreaterEqual(evaluation['score'], 60)
        self.assertIn('Strengths', evaluation['ai_feedback'])

    def test_interview_session_creation(self):
        self.client.login(username='testcandidate', password='Password123!')
        response = self.client.post(reverse('start_interview'), {
            'topic': 'Backend Developer',
            'difficulty': 'Medium'
        })
        self.assertEqual(response.status_code, 302)
        session = InterviewSession.objects.filter(user=self.user).last()
        self.assertIsNotNone(session)
        self.assertEqual(session.topic, 'Backend Developer')
        self.assertEqual(session.questions.count(), 4)

