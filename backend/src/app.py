from db import db
import json
from flask import Flask, session, request
from users_dao import create_user, verify_user

app = Flask(__name__)

db_filename = "codeclip.db"

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///%s" % db_filename
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = True

db.init_app(app)

with app.app_context():
    db.create_all()


def success_response(data, code=200):

    return json.dumps(data), code


def failure_response(message, code=404):
    return json.dumps({"error": message}), code


@app.route("/signup", methods=["POST"])
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
        return success_response(user.serialize())

    return failure_response("User with email: " + email + " already exists", 400)


@app.route("/login", methods=["POST"])
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
        return success_response(user.serialize(), 200)
    return failure_response("error logging in", 400)
