
from flask_sqlalchemy import SQLAlchemy
import bcrypt

db = SQLAlchemy()

class Users(db.model):
    
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String, nullable = False, unique = True)
    password_digest = db.Column(db.String, nullable = False)
    
    
    def __init__(self, **kwargs):
        self.email = kwargs.get("email")
        self.password_digiest = bcrypt.hashpw(kwargs.get("password"))
        
    
    

        