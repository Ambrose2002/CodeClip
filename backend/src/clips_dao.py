from db import Clips, db
from users_dao import get_user_by_id

from datetime import datetime


def get_all_clips(user_id) -> list:

    clips = Clips.query.filter(Clips.user_id == user_id).all()

    if clips:
        return [clip.serialize() for clip in clips]
    return []


def get_clip_by_id(user_id, clip_id) -> list:

    clip = Clips.query.filter(Clips.user_id == user_id, Clips.id == clip_id).first()

    if clip:
        return [clip.serialize()]
    return []


def add_clip(user_id, text, language, source, title, embedding):

    success, user = get_user_by_id(user_id)
    print(user)
    if success and user:
        clip = Clips(
            text=text, title=title, language=language, source=source, user_id=user.id, embedding=embedding
        )
        db.session.add(clip)
        db.session.commit()

        return True, clip

    return False, None

def modify_clip(user_id, clip_id, title, text, language, source, embedding):
    clip = Clips.query.filter(Clips.user_id == user_id, Clips.id == clip_id).first()

    if clip:
        
        clip.title = title
        clip.text = text
        clip.language = language
        clip.source = source
        clip.date_modified = datetime.now()
        clip.embedding = embedding
        db.session.add(clip)
        db.session.commit()
        
        return True, clip.serialize()
    
    return False, None
