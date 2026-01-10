from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import bcrypt

db = SQLAlchemy()

class Users(db.Model):

    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String, nullable = False, unique = True)
    password_digest = db.Column(db.String, nullable = False)
    clips = db.relationship("Clips", cascade = "delete")

    def __init__(self, **kwargs):
        self.email = kwargs.get("email")
        self.password_digiest = bcrypt.hashpw(kwargs.get("password"))


class Clips(db.Model):

    __tablename__ = "clips"
    id = db.Column(db.Integer, primary_key = True)
    text = db.Column(db.String, nullable = False)
    language = db.Column(db.String, nullable = True)
    dateCreated = db.Column(db.DateTime, default = datetime.now, nullable = False)
    source = db.Column(db.String, nullable = False)
    user = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)
    
    def __init__(self, **kwargs):
        self.user = kwargs.get("userId")
        self.text = kwargs.get("text")
        self.language = kwargs.get("language")
        self.dateCreated = datetime.now
        self.source = kwargs.get("source")
    
