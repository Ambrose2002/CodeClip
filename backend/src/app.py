import os
from dotenv import load_dotenv
import json
from flask import Flask, session, request, make_response
from flask_cors import CORS
# import torch
# from sentence_transformers import SentenceTransformer

from src.db import db
from src.users_dao import create_user, verify_user, user_exists, get_user_by_id
from src.clips_dao import (
    get_all_clips,
    add_clip,
    get_clip_by_id,
    modify_clip,
    delete_clip,
    basic_search
)

# Load environment variables from .env file (for local development)
load_dotenv()

# Initialize the model
# model = SentenceTransformer(
#     "all-MiniLM-L6-v2", device="cuda" if torch.cuda.is_available() else "cpu"
# )

app = Flask(__name__)

# Session configuration
app.config.update(
    SESSION_COOKIE_SAMESITE="None",
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
)

# Get allowed origins from environment or use defaults
allowed_origins = os.environ.get("ALLOWED_ORIGINS", "").split(",")
if not allowed_origins or allowed_origins == [""]:
    # Default for local development
    allowed_origins = ["chrome-extension://goalaikhicijokpfakcfmppipibckimn"]

CORS(
    app,
    supports_credentials=True,
    origins=allowed_origins,
)

# Secret key for sessions
app.secret_key = os.environ.get("SECRET_KEY") or os.environ.get(
    "FLASK_SECRET_KEY", "dev-secret-key"
)

# Database configuration
database_url = os.environ.get("DATABASE_URL")

if database_url:
    # Production: Use PostgreSQL from Render
    # Render provides DATABASE_URL starting with postgres://, but SQLAlchemy needs postgresql://
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    print("Using PostgreSQL database")
else:
    # Development: Use SQLite
    instance_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../instance")
    )
    os.makedirs(instance_path, exist_ok=True)
    db_filename = os.path.join(instance_path, "codeclip.db")
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///%s" % db_filename
    print("Using SQLite database")

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = os.environ.get("FLASK_ENV") != "production"

db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()
    print("Database tables created successfully")


def success_response(data, code=200):
    return json.dumps({"ok": True, "data": data, "error": ""}), code


def failure_response(message, code=404):
    return json.dumps({"ok": False, "data": [], "error": message}), code


@app.route("/")
def health_check():
    """Health check endpoint"""
    return success_response({"status": "healthy", "message": "CodeClip API is running"})


@app.route("/api/signup", methods=["POST"])
def signup():

    body = json.loads(request.data)
    if not body:
        return failure_response("request body required", 400)

    email, password = body.get("email"), body.get("password")

    if not email:
        return failure_response("Invalid body: email required", 400)
    if not password:
        return failure_response("Invalid body: password required", 400)

    created, user = create_user(email, password)

    if created and user:
        session["user_id"] = user.id
        return success_response([user.serialize()])

    return failure_response("User with email: " + email + " already exists", 400)


@app.route("/api/login", methods=["POST"])
def login():
    body = json.loads(request.data)

    if not body:
        return failure_response("request body required", 400)

    email, password = body.get("email"), body.get("password")

    if not email:
        return failure_response("Invalid body. email required", 400)
    if not password:
        return failure_response("Invalid body. password required", 400)

    exists = user_exists(email)
    if not exists:
        return failure_response(f"user with email {email} does not exist", 400)

    success, user = verify_user(email, password)

    if success and user:
        session["user_id"] = user.id
        return success_response([user.serialize()], 200)
    return failure_response("password is incorrect", 400)


@app.route("/api/logout", methods=["GET"])
def logout():
    session.clear()
    resp = make_response({"ok": True})
    resp.delete_cookie("session")
    return resp


@app.route("/api/me", methods=["GET"])
def me():
    user_id = session.get("user_id")
    if not user_id:
        return failure_response("Unauthorized", 401)
    exists, user = get_user_by_id(user_id)

    if exists and user:
        return success_response([user.serialize()])
    return failure_response("User does not exist", 400)


@app.route("/api/get/clips")
def get_clips():
    user_id = session.get("user_id")

    if not user_id:
        return failure_response("Unauthorized", 401)

    return success_response(get_all_clips(user_id), 200)


@app.route("/api/clip/query", methods=["POST"])
def query_clips():
    user_id = session.get("user_id")
    if not user_id:
        return failure_response("Unauthorized", 401)

    body = json.loads(request.data)
    if not body:
        return failure_response("invalid request body", 400)

    query = body.get("query") or ""
    # results = semantic_search(user_id, query, model, 0.05)
    results = basic_search(user_id, query)
    return success_response(results, 200)


@app.route("/api/post/clip", methods=["POST"])
def add_single_clip():
    user_id = session.get("user_id")
    if not user_id:
        return failure_response("Unauthorized", 401)

    if not request.data:
        return failure_response("invalid request body", 400)

    body = json.loads(request.data)
    if not body:
        return failure_response("invalid request body", 400)
    text = body.get("text")
    title = body.get("title")
    language = body.get("language")
    source = body.get("source")

    if not text or not title or not source or not language:
        return failure_response(
            "invalid body: text, title, source, and language required", 400
        )

    # text_to_embed = f"language: {language} \ntitle: {title} \n code: {text}"
    # embedding = model.encode(text_to_embed)

    success, clip = add_clip(user_id, text, language, source, title, [])

    if success and clip:
        return success_response([clip.serialize()], 200)

    return failure_response("error adding clip", 400)


@app.route("/api/clip/edit/<int:clip_id>", methods=["POST"])
def edit_clip(clip_id):
    user_id = session.get("user_id")
    if not user_id:
        return failure_response("Unauthorized", 401)

    body = json.loads(request.data)
    if not body:
        return failure_response("invalid request body", 400)
    text = body.get("code")
    title = body.get("title")
    language = body.get("language")
    source = body.get("source")

    if not text or not title or not source or not language:
        return failure_response(
            "invalid body: code, title, source, and language required", 400
        )

    # text_to_embed = f"language: {language} \ntitle: {title} \n code: {text}"
    # embedding = model.encode(text_to_embed)

    success, clip = modify_clip(
        user_id, clip_id, title, text, language, source, []
    )

    if success and clip:
        return success_response([clip], 200)

    return failure_response("Failed to save clip", 404)


@app.route("/api/get/clip/<int:clip_id>", methods=["GET"])
def get_clip(clip_id):
    user_id = session.get("user_id")
    if not user_id:
        return failure_response("Unauthorized", 401)

    clip = get_clip_by_id(user_id, clip_id)
    if clip:
        return success_response(clip, 200)
    return failure_response("clip not found", 404)


@app.route("/api/delete/clip/<int:clip_id>", methods=["DELETE"])
def remove_clip(clip_id):
    user_id = session.get("user_id")
    if not user_id:
        return failure_response("Unauthorized", 401)

    removed, message = delete_clip(user_id, clip_id)
    print(message)
    if removed:
        return success_response([])
    return failure_response(message)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
