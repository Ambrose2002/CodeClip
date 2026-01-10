from db import Clips, db
from users_dao import get_user_by_id


def get_all_clips(user_id):

    clips = Clips.query.filter(Clips.user_id == user_id).all()

    if clips:
        return [clip.serialize() for clip in clips]
    return []


def get_clip_by_id(user_id, clip_id):

    clip = Clips.query.filter(Clips.user_id == user_id and Clips.id == clip_id).first()

    if clip:
        return [clip.serialize()]
    return []


def add_clip(user_id, text, language, source, title):

    success, user = get_user_by_id(user_id)

    if success and user:
        clip = Clips(
            text=text, title=title, language=language, source=source, user_id=user.id
        )
        db.session.add(clip)
        db.session.commit()

        return True, clip

    return False, None
