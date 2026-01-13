from app import app
from db import db, Users, Clips
import random
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

with app.app_context():
    print("Dropping tables...")
    db.drop_all()

    print("Creating tables...")
    db.create_all()

    print("Seeding users...")
    user1 = Users(email="u1@gmail.com", password="ab123")
    user2 = Users(email="u2@gmail.com", password="ab123")
    user3 = Users(email="u3@gmail.com", password="ab123")
    user4 = Users(email="u4@gmail.com", password="ab123")
    user5 = Users(email="u5@gmail.com", password="ab123")

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
        {
            "text": "def is_palindrome(s):\n    return s == s[::-1]",
            "title": "Check Palindrome",
            "language": "python",
            "source": "https://dev.to/codewizard/palindrome-check-python",
        },
        {
            "text": "const sum = arr => arr.reduce((a, b) => a + b, 0);",
            "title": "Sum Array",
            "language": "javascript",
            "source": "https://www.javascripttutorial.net/array/reduce",
        },
        {
            "text": "SELECT email FROM users WHERE email LIKE '%@gmail.com';",
            "title": "Find Gmail Users",
            "language": "sql",
            "source": "https://www.sqltutorial.org/sql-like",
        },
        {
            "text": "public boolean isEven(int n) {\n    return n % 2 == 0;\n}",
            "title": "Check Even Number",
            "language": "java",
            "source": "https://www.baeldung.com/java-even-odd",
        },
        {
            "text": "func max(a, b int) int {\n    if a > b { return a }\n    return b\n}",
            "title": "Max of Two Numbers",
            "language": "go",
            "source": "https://gobyexample.com/if-else",
        },
        {
            "text": "let reversed = [...str].reverse().join('');",
            "title": "Reverse String",
            "language": "javascript",
            "source": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse",
        },
        {
            "text": "def factorial(n):\n    return 1 if n == 0 else n * factorial(n-1)",
            "title": "Factorial Function",
            "language": "python",
            "source": "https://www.programiz.com/python-programming/examples/factorial",
        },
        {
            "text": "CREATE INDEX idx_users_email ON users(email);",
            "title": "Create Email Index",
            "language": "sql",
            "source": "https://use-the-index-luke.com/sql/creating-indexes",
        },
        {
            "text": "std::vector<int> nums = {1,2,3,4};",
            "title": "Vector Initialization",
            "language": "cpp",
            "source": "https://en.cppreference.com/w/cpp/container/vector",
        },
        {
            "text": "let unique = Array.from(new Set(arr));",
            "title": "Remove Duplicates",
            "language": "javascript",
            "source": "https://www.javascripttutorial.net/es6/javascript-set",
        },
        {
            "text": "fn square(x: i32) -> i32 { x * x }",
            "title": "Square Function",
            "language": "rust",
            "source": "https://doc.rust-lang.org/book/ch03-03-how-functions-work.html",
        },
        {
            "text": "def flatten(lst):\n    return [item for sublist in lst for item in sublist]",
            "title": "Flatten List",
            "language": "python",
            "source": "https://realpython.com/python-flatten-list",
        },
        {
            "text": "SELECT COUNT(*) FROM orders WHERE status = 'pending';",
            "title": "Count Pending Orders",
            "language": "sql",
            "source": "https://www.sqlshack.com/sql-count-function",
        },
        {
            "text": "let now = new Date().toISOString();",
            "title": "Get ISO Date",
            "language": "javascript",
            "source": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString",
        },
        {
            "text": "public static int clamp(int x, int min, int max) {\n    return Math.max(min, Math.min(x, max));\n}",
            "title": "Clamp Value",
            "language": "java",
            "source": "https://stackoverflow.com/questions/9898512/clamping-values-in-java",
        },
        {
            "text": "curl -X GET https://api.example.com/users",
            "title": "API Request",
            "language": "bash",
            "source": "https://curl.se/docs/httpscripting.html",
        },
        {
            "text": "type User = { id: number; name: string }",
            "title": "User Type",
            "language": "typescript",
            "source": "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
        },
        {
            "text": 'var body: some View { Text("Hello") }',
            "title": "SwiftUI Text View",
            "language": "swift",
            "source": "https://developer.apple.com/tutorials/swiftui",
        },
        {
            "text": "if (x === null) throw new Error('Missing value');",
            "title": "Null Check",
            "language": "javascript",
            "source": "https://javascript.info/error-handling",
        },
        {
            "text": "def chunk(lst, size):\n    return [lst[i:i+size] for i in range(0, len(lst), size)]",
            "title": "Chunk List",
            "language": "python",
            "source": "https://www.geeksforgeeks.org/break-list-chunks-size-n-python",
        },
    ]
    data_to_embed = []
    
    for entry in clip_samples:
        data = f"language: {entry['language']} \ntitle: {entry['title']} \n code: {entry['text']}"
        data_to_embed.append(data)
    embeddings = model.encode(data_to_embed)
    

    users = [user1, user2, user3, user4, user5]

    for idx, clip in enumerate(clip_samples):
        user_id = random.randint(1, len(users))
        embedding = embeddings[idx]
        clip_object = Clips(
            text=clip["text"],
            title=clip["title"],
            language=clip["language"],
            source=clip["source"],
            user_id=user_id,
            embedding = embedding
        )
        db.session.add(clip_object)

    db.session.commit()
    print("Clips seeded successfully!")
