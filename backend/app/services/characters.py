from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.schemas.characters import CharacterCreate, EpisodeCharacterCreate

def get_character(db, user_id: int):
    rows = db.execute(text("SELECT * FROM characters WHERE user_id = :user_id ORDER BY character_id"), {"user_id": user_id}).fetchall()
    return [dict(row._mapping) for row in rows]

def add_character(payload: CharacterCreate, db, user_id: int):

    db.execute(
        text("""
            INSERT INTO characters (
                anime_name,
                character_name,
                user_id
            )
            VALUES (
                :anime_name,
                :character_name,
                :user_id
            )
        """), {**payload.model_dump(), "user_id": user_id,}
    )

    db.commit()

    return {"message": "Character added successfully"}

def update_character(
    character_id: int,
    payload: CharacterCreate,
    db
    , user_id: int
):

    result = db.execute(
        text("""
            UPDATE characters
            SET
                anime_name = :anime_name,
                character_name = :character_name
            WHERE character_id = :character_id AND user_id = :user_id
        """),
        {
            **payload.model_dump(),
            "character_id": character_id,
            "user_id": user_id,
        }
    )

    db.commit()

    if result.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Character not found"
        )

    return {"message": "Character updated successfully"}

def delete_character(character_id: int, db, user_id: int):
    result = db.execute(
        text("""
            DELETE FROM characters WHERE character_id = :character_id AND user_id = :user_id
        """),{"character_id": character_id, "user_id": user_id}
    )
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Character not found")

    db.commit()

    return {"message": "Character deleted successfully"}



def get_episode_characters(anime_id: int, db):
    rows = db.execute(text("SELECT * FROM episode_characters WHERE anime_id=:anime_id ORDER BY episode_character_id"), {"anime_id": anime_id}).fetchall()
    return [dict(row._mapping) for row in rows]

def add_episode_character(payload: EpisodeCharacterCreate, db):
    db.execute(
        text("""
            INSERT INTO episode_characters (
                anime_id,
                character_id
            )
            VALUES (
                :anime_id,
                :character_id
            )
        """), {**payload.model_dump()}
    )

    db.commit()

    return {"message": "Episode character added successfully"}