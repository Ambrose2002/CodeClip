from app import app
from db import db, Users, Clips
import random

with app.app_context():
    print("Dropping tables...")
    db.drop_all()

    print("Creating tables...")
    db.create_all()

    print("Seeding users...")
    user1 = Users(email="ab123@gmail.com", password="ab123")
    user2 = Users(email="test@gmail.com", password="ab123")
    user3 = Users(email="john@gmail.com", password="ab123")
    user4 = Users(email="jane@gmail.com", password="ab123")
    user5 = Users(email="dev@gmail.com", password="ab123")

    db.session.add_all([user1, user2, user3, user4, user5])

    db.session.commit()

    print("Users seeded successfully!")

    print("Seeding clips...")
    clip_samples = [
        {
            "text": "const greeting = 'Hello, World!';",
            "title": "Hello World in JavaScript",
            "language": "javascript",
            "source": "https://example.com/tutorial",
        },
        {
            "text": "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)",
            "title": "Fibonacci Function",
            "language": "python",
            "source": "https://leetcode.com/problems/fibonacci",
        },
        {
            "text": "SELECT * FROM users WHERE age > 18;",
            "title": "Select Adults",
            "language": "sql",
            "source": "database query",
        },
        {
            "text": 'public class Hello {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
            "title": "Hello World in Java",
            "language": "java",
            "source": "Java tutorial",
        },
        {
            "text": "for i in range(10):\n    print(i)",
            "title": "Print 0-9",
            "language": "python",
            "source": "Python basics",
        },
        {
            "text": "const debounce = (func, delay) => {\n  let timeoutId;\n  return (...args) => {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => func(...args), delay);\n  };\n};",
            "title": "Debounce Function",
            "language": "javascript",
            "source": "https://davidwalsh.name/javascript-debounce-function",
        },
        {
            "text": "SELECT u.name, COUNT(o.id) as order_count\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id\nHAVING COUNT(o.id) > 5;",
            "title": "Users with Multiple Orders",
            "language": "sql",
            "source": "database optimization guide",
        },
        {
            "text": "public class Singleton {\n    private static Singleton instance;\n    private Singleton() {}\n    public static Singleton getInstance() {\n        if (instance == null) {\n            instance = new Singleton();\n        }\n        return instance;\n    }\n}",
            "title": "Singleton Pattern",
            "language": "java",
            "source": "Design Patterns: Gang of Four",
        },
        {
            "text": "func reverseString(s []byte) {\n    left, right := 0, len(s)-1\n    for left < right {\n        s[left], s[right] = s[right], s[left]\n        left++\n        right--\n    }\n}",
            "title": "Reverse String In-Place",
            "language": "go",
            "source": "https://golang.org/doc/effective_go",
        },
        {
            "text": "async function fetchData(url) {\n  try {\n    const response = await fetch(url);\n    return await response.json();\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}",
            "title": "Async Fetch Data",
            "language": "javascript",
            "source": "MDN Web Docs",
        },
    ]

    users = [user1, user2, user3, user4, user5]

    for idx, user in enumerate(users):
        if idx == 4:  # user5 has no clips
            continue
        num_clips = random.randint(1, 10)
        for _ in range(num_clips):
            clip_data = random.choice(clip_samples)
            clip = Clips(
                text=clip_data["text"],
                title=clip_data["title"],
                language=clip_data["language"],
                source=clip_data["source"],
                user_id=user.id,
            )
            db.session.add(clip)

    db.session.commit()
    print("Clips seeded successfully!")
