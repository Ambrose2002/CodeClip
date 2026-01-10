from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import bcrypt  # type: ignore

db = SQLAlchemy()


class Users(db.Model):

    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password_digest = db.Column(db.String, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    clips = db.relationship("Clips", cascade="delete")

    def __init__(self, **kwargs):
        self.email = kwargs.get("email")
        self.date_created = datetime.now()
        self.password_digiest = bcrypt.hashpw(kwargs.get("password"))

    def check_password(self, password) -> bool:
        return bcrypt.checkpw(password.encode("utf-8"), self.password_digest)

    def serialize(self):
        return {"id": self.id, "email": self.email, "date_created": self.date_created}


class Clips(db.Model):

    __tablename__ = "clips"
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String, nullable=False)
    language = db.Column(db.String, nullable=True)
    date_created = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    source = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    def __init__(self, **kwargs):
        self.user = kwargs.get("userId")
        self.text = kwargs.get("text")
        self.language = kwargs.get("language")
        self.date_created = datetime.now()
        self.source = kwargs.get("source")

    def serialize(self):
        return {
            "id": self.id,
            "text": self.text,
            "language": self.language,
            "date_created": self.date_created.isoformat(),
            "source": self.source,
        }
