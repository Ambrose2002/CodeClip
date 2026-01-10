from db import Clips, db

def getAllClips(user_id):
    
    clips = Clips.query.filter(Clips.user_id == user_id).all()
    
    return clips


