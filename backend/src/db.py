from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class Users(db.Model):

    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password_digest = db.Column(db.String, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    clips = db.relationship("Clips", cascade="delete")

    def __init__(self, **kwargs):
        password = kwargs.get("password")
        assert password is not None
        self.email = kwargs.get("email")
        self.date_created = datetime.now()
        self.password_digest = generate_password_hash(password)

    def check_password(self, password) -> bool:
        return check_password_hash(self.password_digest, password)

    def serialize(self):
        return {"id": self.id, "email": self.email, "date_created": self.date_created.isoformat()}


class Clips(db.Model):

    __tablename__ = "clips"
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String, nullable=False)
    language = db.Column(db.String, nullable=True)
    date_created = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    date_modified = db.Column(db.DateTime, nullable = True)
    source = db.Column(db.String, nullable=False)
    title = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    def __init__(self, **kwargs):
        self.user_id = kwargs.get("user_id")
        self.text = kwargs.get("text")
        self.title = kwargs.get("title")
        self.language = kwargs.get("language")
        self.date_created = datetime.now()
        self.source = kwargs.get("source")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "text": self.text,
            "title": self.title,
            "language": self.language,
            "date_created": self.date_created.isoformat(),
            "date_modified": self.date_modified.isoformat() if self.date_modified else "",
            "source": self.source,
        }
