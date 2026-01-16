from src.db import Clips, db
from src.users_dao import get_user_by_id
import numpy as np

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
            text=text,
            title=title,
            language=language,
            source=source,
            user_id=user.id,
            embedding=embedding,
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


def semantic_search(user_id, query_text, model, min_score):
    query_vec = np.array(model.encode(query_text), dtype=float)
    clips = Clips.query.filter(Clips.user_id == user_id).all()

    def cosine_sim(a, b):
        denom = np.linalg.norm(a) * np.linalg.norm(b)
        if denom == 0:
            return 0.0
        return float(np.dot(a, b) / denom)

    scored = []
    for clip in clips:
        if clip.embedding is None:
            continue
        clip_vec = np.array(clip.embedding, dtype=float)
        score = cosine_sim(query_vec, clip_vec)
        if score >= min_score:
            scored.append((score, clip))

    scored.sort(key=lambda x: x[0], reverse=True)

    return [{**clip.serialize(), "score": score} for score, clip in scored]


def delete_clip(user_id, clip_id):

    clip = Clips.query.filter(Clips.user_id == user_id, Clips.id == clip_id).first()

    if clip:
        try:
            db.session.delete(clip)
            db.session.commit()
            return True, ""
        except Exception as e:
            return False, str(e)

    return False, "clip not found"
