import os
from db import db
import json
from flask import Flask, session, request
from users_dao import create_user, verify_user
from clips_dao import get_all_clips, add_clip, get_clip_by_id

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY")

db_filename = "codeclip.db"

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///%s" % db_filename
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = True

db.init_app(app)

with app.app_context():
    db.create_all()


def success_response(data, code=200):
    return json.dumps({"ok": True, "data": data, "error": ""}), code


def failure_response(message, code=404):
    return json.dumps({"ok": False, "data": [],"error": message}), code


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

    if created:
        assert user is not None
        return success_response([user.serialize()])

    return failure_response("User with email: " + email + " already exists", 400)


@app.route("/api/login", methods=["POST"])
def login():
    body = json.loads(request.data)
    body = json.loads(request.data)
    if not body:
        return failure_response("request body required", 400)

    email, password = body.get("email"), body.get("password")

    if not email:
        return failure_response("Invalid body. email required", 400)
    if not password:
        return failure_response("Invalid body. password required", 400)

    success, user = verify_user(email, password)

    if not success:
        return failure_response("error logging in", 400)

    if user:
        session["user_id"] = user.id
        return success_response([user.serialize()], 200)
    return failure_response("error logging in", 400)


@app.route("/api/logout", methods=["GET"])
def logout():
    session.clear()
    return success_response([], 200)


@app.route("/api/get/clips")
def get_clips():
    user_id = session["user_id"]

    if not user_id:
        return failure_response("Unauthorized", 401)

    return success_response(get_all_clips(user_id), 200)


@app.route("api/post/clip", methods=["POST"])
def add():
    user_id = session["user_id"]
    if not user_id:
        return failure_response("Unauthorized", 401)

    body = json.loads(request.data)
    if not body:
        return failure_response("invalid body", 400)
    text = body.get("text")
    title = body.get("title")
    language = body.get("language")
    source = body.get("source")

    if not text or not title or not language or not source:
        return failure_response("invalid body", 400)

    success, clip = add_clip(user_id, text, language, source, title)

    if success and clip:
        return success_response([clip.serialize()], 200)

    return failure_response("error adding clip", 400)


@app.route("api/get/clip/<int:clip_id>", methods=["GET"])
def get_clip(clip_id):
    user_id = session["user_id"]
    if not user_id:
        return failure_response("Unauthorized", 401)
    return success_response(get_clip_by_id(user_id, clip_id), 200)
