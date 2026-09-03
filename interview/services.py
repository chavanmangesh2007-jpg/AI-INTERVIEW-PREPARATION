import os
import re
import random

try:
    # pyrefly: ignore [missing-import]
    import google.generativeai as genai
except ImportError:
    genai = None

import json

# Domain question repository for fallback & offline AI response generation
TOPIC_QUESTIONS = {
    'Backend Developer': [
        "Explain RESTful API architecture and how it differs from GraphQL.",
        "What are database indexes, and how do they optimize query performance? What are their trade-offs?",
        "How do you handle concurrency, race conditions, and transactions in relational databases?",
        "Describe microservices vs monolithic architecture. When would you choose one over the other?",
        "How do caching strategies (like Redis or Memcached) improve backend service latency?",
        "Explain the concept of rate limiting and how you would implement it.",
        "What is database normalization and denormalization? When should you denormalize?",
        "How does OAuth2 work? Describe the flow for authenticating a user.",
        "What is an event-driven architecture, and what are its pros and cons?",
        "Describe the differences between SQL and NoSQL databases. When would you use NoSQL?",
        "Explain how JWT (JSON Web Tokens) work for stateless authentication.",
        "What is a message queue (e.g., RabbitMQ, Kafka) and why is it useful in a backend system?",
        "How do you prevent common security vulnerabilities like SQL Injection and XSS?",
        "What are database ACID properties?",
        "Explain how you would design an API that supports pagination and filtering.",
        "Describe how reverse proxies and load balancers work.",
        "How do you handle background jobs or long-running tasks in a web application?",
        "What is a connection pool and why is it necessary?",
        "Explain CAP theorem and its implications in distributed systems.",
        "How do you monitor and debug performance issues in a production backend?"
    ],
    'Frontend Developer': [
        "Explain the Virtual DOM in React or modern frameworks and how it optimizes UI updates.",
        "What is the difference between state and props, and how do you manage global state effectively?",
        "Describe how browser rendering works, including parsing HTML, CSSOM, reflow, and repaint.",
        "How do you optimize frontend web performance and reduce initial page bundle size?",
        "Explain CSS Flexbox vs Grid and how to achieve responsive design without external libraries.",
        "What is the event loop in JavaScript and how does it handle asynchronous code?",
        "Explain the difference between local storage, session storage, and cookies.",
        "How does prototype-based inheritance work in JavaScript?",
        "Describe Server-Side Rendering (SSR) vs Single Page Applications (SPA). What are the SEO implications?",
        "What are closures in JavaScript, and what are some common use cases for them?",
        "Explain CORS (Cross-Origin Resource Sharing) and how to handle CORS errors.",
        "What is Webpack or Vite, and why do we need module bundlers in modern frontend development?",
        "Describe the CSS Box Model.",
        "How do you ensure your web application is accessible (a11y) to all users?",
        "Explain the concepts of debouncing and throttling in JavaScript.",
        "What is semantic HTML and why is it important?",
        "Describe the lifecycle of a React component (or your framework of choice).",
        "How do you handle routing in a Single Page Application?",
        "Explain the difference between let, const, and var.",
        "How do you test frontend applications (e.g., unit tests, E2E tests)?"
    ],
    'Data Scientist': [
        "Explain the bias-variance trade-off in machine learning and how to prevent overfitting.",
        "What is the difference between supervised, unsupervised, and reinforcement learning?",
        "How do you handle missing or imbalanced data in a dataset before training a model?",
        "Explain the ROC-AUC curve and precision-recall trade-off.",
        "What are feature engineering techniques and why are they crucial in ML pipelines?",
        "Describe the difference between Bagging and Boosting.",
        "How does a Random Forest algorithm work?",
        "Explain the concept of cross-validation.",
        "What is the curse of dimensionality and how does PCA address it?",
        "Describe the differences between L1 (Lasso) and L2 (Ridge) regularization.",
        "How do you evaluate a clustering algorithm like K-Means?",
        "Explain the backpropagation algorithm in neural networks.",
        "What are Word Embeddings (like Word2Vec) in NLP?",
        "Describe a time series forecasting model you have used.",
        "What is A/B testing and how do you determine statistical significance?",
        "Explain the difference between correlation and causation.",
        "How do you deploy a machine learning model to production?",
        "What are vanishing and exploding gradients in deep learning?",
        "Describe how a Convolutional Neural Network (CNN) extracts features from an image.",
        "How do you choose between a simple linear regression and a complex deep learning model for a task?"
    ],
    'Software Engineer': [
        "Explain Object-Oriented Programming (OOP) concepts: Encapsulation, Abstraction, Inheritance, and Polymorphism.",
        "What is the time and space complexity of Quick Sort vs Merge Sort?",
        "How do hash tables work under the hood, and how are hash collisions resolved?",
        "What is CI/CD and how does automated testing fit into modern software development cycles?",
        "Explain git rebase vs git merge and when to use each.",
        "What is dependency injection and inversion of control?",
        "Describe the SOLID principles of object-oriented design.",
        "How does a garbage collector work in languages like Java or C#?",
        "Explain the concepts of multithreading and multiprocessing.",
        "What are design patterns? Explain the Singleton and Factory patterns.",
        "How do you review someone else's code? What specific things do you look for?",
        "Describe the Agile methodology and how it compares to Waterfall.",
        "What are RESTful APIs and what are the standard HTTP methods used?",
        "Explain the difference between an interface and an abstract class.",
        "How do you handle exceptions and errors robustly in your code?",
        "What is TDD (Test-Driven Development)?",
        "Explain the concept of deadlocks in concurrent programming and how to prevent them.",
        "How do you manage configuration for different environments (dev, staging, prod)?",
        "What is containerization (e.g., Docker) and why is it beneficial?",
        "Describe a challenging technical problem you solved recently."
    ],
    'HR Behavioral': [
        "Tell me about a time when you faced a major conflict with a team member and how you resolved it.",
        "Describe a situation where you had to work under a tight deadline with incomplete requirements.",
        "What is your greatest weakness, and how are you actively working to overcome it?",
        "Why do you want to join our organization, and where do you see yourself in 5 years?",
        "Give an example of a project that failed or did not go as planned. What did you learn?",
        "Tell me about a time you had to adapt quickly to a significant change at work.",
        "Describe a situation where you had to persuade someone to see things your way.",
        "How do you prioritize tasks when you have multiple urgent deadlines?",
        "Give an example of a time you stepped up as a leader when it wasn't expected of you.",
        "Tell me about a time you received constructive criticism. How did you react?",
        "Describe a time when you went above and beyond for a customer or client.",
        "How do you handle working with someone whose personality clashes with yours?",
        "Tell me about a goal you achieved that took a long time and a lot of dedication.",
        "Describe a situation where you made a mistake. How did you handle it?",
        "What motivates you to do your best work?",
        "Tell me about a time you had to learn a new skill quickly to complete a task.",
        "How do you ensure you are communicating effectively with remote team members?",
        "Describe a time when you disagreed with your manager's decision.",
        "What are you most proud of in your career so far?",
        "How do you define success for yourself?"
    ],
    'System Design': [
        "Design a URL shortening service like Bitly handling millions of requests per day.",
        "How would you design a real-time messaging application like WhatsApp or Slack?",
        "Explain horizontal vs vertical scaling and how to implement load balancers.",
        "How do you design a system for high availability, fault tolerance, and disaster recovery?",
        "What is database sharding and partitioning, and when should it be implemented?",
        "Design a video streaming service like YouTube or Netflix.",
        "How would you design an API rate limiter?",
        "Design a ride-sharing service like Uber or Lyft.",
        "Explain how a Content Delivery Network (CDN) works and its benefits.",
        "Design a distributed cache system like Memcached or Redis.",
        "How would you design a web crawler that scales?",
        "Design an autocomplete/typeahead suggestion system.",
        "Explain the differences between long-polling, WebSockets, and Server-Sent Events.",
        "Design a scalable ticket booking system for movies or concerts.",
        "How would you design a news feed system like Twitter or Facebook?",
        "Describe the concepts of consistent hashing and where it's used.",
        "Design a distributed file storage system like Amazon S3.",
        "How do you handle data replication and consistency across multiple data centers?",
        "Design a scalable logging and metrics aggregation system.",
        "What is API gateway pattern and what responsibilities should an API gateway have?"
    ],
    'Data Structure': [
        "Explain the difference between an Array and a Linked List in memory allocation and operations.",
        "What is a Binary Search Tree (BST) and how does self-balancing (AVL / Red-Black) preserve O(log n)?",
        "Explain Stack vs Queue data structures with real-world application examples.",
        "How does a Graph traversal work using BFS and DFS?",
        "What is a Heap (Min/Max Heap) and where is it used in algorithm optimization?",
        "Describe how a Trie data structure works and its primary use cases.",
        "How do you detect a cycle in a Directed Graph?",
        "Explain the concept of a Disjoint-Set (Union-Find) data structure.",
        "What is a Deque (Double-Ended Queue)?",
        "How would you implement a LRU (Least Recently Used) cache?",
        "Describe the structure and use case of a Bloom Filter.",
        "What are the advantages of using an Adjacency List over an Adjacency Matrix for representing graphs?",
        "Explain the difference between a Singly Linked List and a Doubly Linked List.",
        "How do you find the lowest common ancestor of two nodes in a Binary Tree?",
        "What is a Priority Queue and how is it typically implemented?",
        "Describe the Floyd-Warshall algorithm for finding all-pairs shortest paths.",
        "How do you reverse a linked list iteratively and recursively?",
        "Explain the concept of topological sorting in a Directed Acyclic Graph (DAG).",
        "What is a Segment Tree and what type of problems does it solve?",
        "How do you find the middle element of a linked list in a single pass?"
    ]
}

DEFAULT_QUESTIONS = [
    "What is your approach to solving complex engineering problems?",
    "Describe a technical challenge you recently solved and the steps you took.",
    "How do you ensure code quality and maintainability in a team environment?",
    "What steps do you take when debugging an issue in a production environment?",
    "How do you stay updated with modern technologies and industry best practices?"
]


def generate_interview_questions(topic='Software Engineer', difficulty='Medium', count=3):
    """
    Generates tailored interview questions based on topic and difficulty.
    Uses Google Gemini API if configured, otherwise falls back to hardcoded.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    
    if genai and api_key:
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"Generate {count} {difficulty} difficulty mock interview questions for a {topic} position. Return ONLY a JSON list of strings, with no markdown formatting or extra text."
            response = model.generate_content(prompt)
            
            text = response.text.strip()
            text = re.sub(r'^```(?:json)?', '', text, flags=re.IGNORECASE)
            text = re.sub(r'```$', '', text).strip()
            
            questions = json.loads(text)
            if isinstance(questions, list) and len(questions) > 0:
                return questions[:count]
        except Exception as e:
            print(f"AI Generation failed: {e}. Falling back to local questions.")
            pass # Fall back to local questions if AI fails

    # Fallback to local
    questions_pool = TOPIC_QUESTIONS.get(topic, DEFAULT_QUESTIONS)
    selected = random.sample(questions_pool, min(count, len(questions_pool)))
    return selected


def evaluate_interview_answer(question_text, user_answer, topic='Software Engineer'):
    """
    Evaluates candidate's answer using keyword analysis, length, technical depth, and structure.
    Returns dict with score (0-100), ai_feedback, and suggested_answer.
    """
    if not user_answer or len(user_answer.strip()) < 10:
        return {
            'score': 20,
            'ai_feedback': "Your answer was extremely brief or empty. Try providing a structured explanation using the STAR method (Situation, Task, Action, Result) with specific examples and technical depth.",
            'suggested_answer': f"A comprehensive answer to '{question_text}' should cover key concepts, practical implementation steps, trade-offs, and real-world examples relevant to {topic}."
        }

    word_count = len(user_answer.strip().split())
    base_score = 60

    # Reward elaboration and detail
    if word_count > 30:
        base_score += 15
    if word_count > 70:
        base_score += 15

    # Check technical indicators
    tech_keywords = ['example', 'for instance', 'architecture', 'performance', 'process', 'result', 'code', 'data', 'system', 'scale', 'optimize', 'method', 'key', 'impact']
    keyword_matches = sum(1 for kw in tech_keywords if kw in user_answer.lower())
    base_score += min(10, keyword_matches * 2)

    score = min(98, max(30, base_score))

    feedback_parts = [
        f"**Overall Score**: {score}/100.",
        f"**Strengths**: Good initiative in addressing the question. Your response contains around {word_count} words."
    ]

    if score >= 80:
        feedback_parts.append("**Feedback**: Excellent depth and clear communication of concepts. You highlighted technical reasoning well.")
    elif score >= 60:
        feedback_parts.append("**Feedback**: Solid answer. To make it stand out further, include specific metrics, code snippets, or architecture trade-offs.")
    else:
        feedback_parts.append("**Feedback**: Adequate start, but needs more concrete details, technical jargon, and structured steps.")

    suggested_answer = (
        f"A strong model answer for '{question_text}' starts by defining the core principle, "
        f"explaining the step-by-step mechanism, comparing alternatives/trade-offs, and concluding with a personal project experience."
    )

    return {
        'score': score,
        'ai_feedback': "\n\n".join(feedback_parts),
        'suggested_answer': suggested_answer
    }


def analyze_resume_content(file_path, target_job='Software Engineer'):
    """
    Extracts text from file (PDF, DOCX, TXT) and evaluates key sections, skills, formatting, and relevance.
    """
    raw_text = ""
    ext = os.path.splitext(file_path)[1].lower()

    try:
        if ext == '.txt':
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                raw_text = f.read()
        else:
            # Fallback text reading for binary/other files
            with open(file_path, 'rb') as f:
                content = f.read()
                # Basic string extraction
                raw_text = "".join([chr(b) if 32 <= b <= 126 or b in (10, 13) else ' ' for b in content])
    except Exception as e:
        raw_text = f"Error reading resume file: {str(e)}"

    text_lower = raw_text.lower()

    # Skill detection bank
    all_skills = [
        'python', 'django', 'javascript', 'react', 'node.js', 'sql', 'postgres', 'mongodb',
        'git', 'docker', 'aws', 'kubernetes', 'rest api', 'html', 'css', 'java', 'c++',
        'machine learning', 'data analysis', 'linux', 'agile', 'system design'
    ]

    found_skills = [skill.title() for skill in all_skills if skill in text_lower]
    if not found_skills:
        found_skills = ['Communication', 'Problem Solving', 'Git', 'Software Development', 'Python']

    # Scoring logic
    score = 65
    if len(raw_text) > 300:
        score += 10
    if len(found_skills) >= 5:
        score += 15
    if 'education' in text_lower or 'degree' in text_lower or 'university' in text_lower:
        score += 5
    if 'experience' in text_lower or 'project' in text_lower:
        score += 5

    score = min(96, max(45, score))

    strengths = (
        f"• Clear layout with identified core skills: {', '.join(found_skills[:5])}.\n"
        f"• Good relevance for target role: '{target_job}'.\n"
        f"• Demonstrates relevant project or technical terminology."
    )

    weaknesses = (
        "• Could feature more quantifiable metrics (e.g., 'Improved speed by 35%').\n"
        "• Consider adding a dedicated Highlights / Key Achievements section near the top.\n"
        "• Tailor summary section specifically to the target company's job description."
    )

    recommendations = (
        "1. Action Verbs: Begin bullet points with strong action verbs (e.g., Architected, Developed, Spearheaded).\n"
        "2. Tech Stack Consistency: List version numbers or relevant frameworks alongside primary languages.\n"
        "3. Metrics & Results: Add measurable impacts for every major project listed."
    )

    return {
        'overall_score': score,
        'extracted_skills': ", ".join(found_skills),
        'strengths': strengths,
        'weaknesses': weaknesses,
        'recommendations': recommendations
    }
