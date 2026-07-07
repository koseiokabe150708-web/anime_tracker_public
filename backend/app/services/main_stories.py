from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.schemas.main_stories import AnimeCreate

def get_anime(db):
    rows = db.execute(text("SELECT * FROM anime_tracker ORDER by anime_date")).fetchall()
    return [dict(row._mapping) for row in rows]

def add_anime(payload: AnimeCreate, db):

    db.execute(
        text("""
            INSERT INTO anime_tracker (
                anime_name,
                title,
                episode_number,
                anime_date,
                notes,
                script_writer,
                anime_director,
                rating,
                content_type,
                alphabet,
                watch_status
            )
            VALUES (
                :anime_name,
                :title,
                :episode_number,
                :anime_date,
                :notes,
                :script_writer,
                :anime_director,
                :rating,
                :content_type,
                :alphabet,
                :watch_status
            )
        """), {**payload.model_dump()}
    )

    db.commit()

    return {"message": "Anime added successfully"}


def get_anime_by_story(anime_id: int, db):
    row = db.execute(
        text(f"""
            SELECT * 
            FROM anime_tracker
            WHERE anime_id = :anime_id
        """),
        {"anime_id": anime_id},
    ).mappings().fetchone()
                
    if not row:
        raise HTTPException(status_code=404, detail="Anime not found")
    
    return dict(row)


def update_anime(
    anime_id: int,
    payload: AnimeCreate,
    db
):

    result = db.execute(
        text("""
            UPDATE anime_tracker
            SET
                anime_name = :anime_name,
                title = :title,
                episode_number = :episode_number,
                anime_date = :anime_date,
                notes = :notes,
                script_writer = :script_writer,
                anime_director = :anime_director,
                rating = :rating,
                content_type = :content_type,
                alphabet = :alphabet,
                watch_status = :watch_status
            WHERE anime_id = :anime_id
        """),
        {
            **payload.model_dump(),
            "anime_id": anime_id,
        }
    )

    db.commit()

    if result.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Anime not found"
        )

    return {"message": "Anime updated successfully"}

def delete_anime(anime_id: int, db):
    result = db.execute(
        text("""
            DELETE FROM anime_tracker WHERE anime_id = :anime_id
        """),{"anime_id": anime_id}
    )
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Anime not found")

    db.commit()

    return {"message": "Anime deleted successfully"}


