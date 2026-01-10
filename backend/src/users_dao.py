from db import Users, db
def user_exists(email):
    user = Users.query.filter(Users.email == email).first()
    
    if user: 
        return True
    return False

def create_user(email, password):
    
    if (user_exists(email)):
        return False, None
    
    user = Users(email = email, password = password)
    db.session.add(user)
    db.session.commit()
    return True, user