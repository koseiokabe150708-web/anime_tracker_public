from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.schemas.characters import CharacterCreate, EpisodeCharacterCreate

def get_character(db, user_id: int):
    rows = db.execute(text("SELECT * FROM characters WHERE user_id = :user_id ORDER BY character_id"), {"user_id": user_id}).fetchall()
    return [dict(row._mapping) for row in rows]

def add_character(payload: CharacterCreate, db, user_id: int):

    character_exist = db.execute(text("""SELECT 1 FROM characters 
    WHERE user_id = :user_id 
    AND anime_name = :anime_name 
    AND LOWER(TRIM(character_name)) = LOWER(TRIM(:character_name)) """), 
    {"user_id": user_id, "anime_name" : payload.anime_name, "character_name" : payload.character_name}).fetchone()

    if character_exist:
        raise HTTPException(status_code=400, detail="A character with this name already exists")


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
    character_exist = db.execute(text("""SELECT 1 FROM characters 
        WHERE user_id = :user_id 
        AND anime_name = :anime_name 
        AND LOWER(TRIM(character_name)) = LOWER(TRIM(:character_name)) 
        AND character_id != :character_id"""), 
        {"user_id": user_id, "anime_name" : payload.anime_name, "character_name" : payload.character_name, "character_id": character_id}).fetchone()
    
    if character_exist:
        raise HTTPException(status_code=400, detail="A character with this name already exists")

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


def get_episode_characters(anime_id: int, db, user_id: int):
    rows = db.execute(
        text("""
            SELECT ec.*
            FROM episode_characters ec
            JOIN anime_tracker a ON ec.anime_id = a.anime_id
            WHERE ec.anime_id = :anime_id AND a.user_id = :user_id
            ORDER BY ec.episode_character_id
        """),
        {"anime_id": anime_id, "user_id": user_id}
    ).fetchall()
    return [dict(row._mapping) for row in rows]

def add_episode_character(payload: EpisodeCharacterCreate, db, user_id: int):
    anime_check = db.execute(
        text("SELECT 1 FROM anime_tracker WHERE anime_id = :anime_id AND user_id = :user_id"),
        {"anime_id": payload.anime_id, "user_id": user_id}
    ).fetchone()
    if not anime_check:
        raise HTTPException(status_code=404, detail="Anime not found")

    character_check = db.execute(
        text("SELECT 1 FROM characters WHERE character_id = :character_id AND user_id = :user_id"),
        {"character_id": payload.character_id, "user_id": user_id}
    ).fetchone()
    if not character_check:
        raise HTTPException(status_code=404, detail="Character not found")

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

def delete_episode_character(episode_character_id: int, db, user_id: int):
    result = db.execute(
        text("""
            DELETE FROM episode_characters
            WHERE episode_character_id = :episode_character_id
            AND anime_id IN (
                SELECT anime_id FROM anime_tracker WHERE user_id = :user_id
            )
        """),
        {"episode_character_id": episode_character_id, "user_id": user_id}
    )
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Episode character not found")
    db.commit()
    return {"message": "Episode character deleted successfully"}

def get_all_episode_characters(db, user_id: int):
    rows = db.execute(
        text("""
            SELECT ec.*
            FROM episode_characters ec
            JOIN characters c ON ec.character_id = c.character_id
            WHERE c.user_id = :user_id
            ORDER BY ec.episode_character_id
        """),
        {"user_id": user_id}
    ).fetchall()
    return [dict(row._mapping) for row in rows]

