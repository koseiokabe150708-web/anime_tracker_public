from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.schemas.main_stories import AnimeCreate

def get_anime(db, user_id: int):
    rows = db.execute(text("SELECT * FROM anime_tracker WHERE user_id = :user_id ORDER BY anime_date"), {"user_id": user_id}).fetchall()
    return [dict(row._mapping) for row in rows]

def add_anime(payload: AnimeCreate, db, user_id: int):

    anime_exist = db.execute(text("""SELECT 1 FROM anime_tracker 
        WHERE user_id = :user_id 
        AND anime_name = :anime_name 
        AND LOWER(TRIM(title)) = LOWER(TRIM(:title)) 
        AND episode_number = :episode_number """), 
        {"user_id": user_id, "anime_name" : payload.anime_name, "title" : payload.title, "episode_number" : payload.episode_number}).fetchone()
    
    if anime_exist:
            raise HTTPException(status_code=400, detail="An anime with this title already exists")

    episode_exist = db.execute(text("""SELECT 1 FROM anime_tracker 
            WHERE user_id = :user_id 
            AND anime_name = :anime_name 
            AND episode_number = :episode_number 
            AND season_number IS NOT DISTINCT FROM :season_number 
            AND alphabet IS NOT DISTINCT FROM :alphabet """), 
            {"user_id": user_id, "anime_name" : payload.anime_name, "episode_number" : payload.episode_number, "season_number" : payload.season_number, "alphabet" : payload.alphabet}).fetchone()
        
    if episode_exist:
                raise HTTPException(status_code=400, detail="An anime with this episode number already exists")

    db.execute(
        text("""
            INSERT INTO anime_tracker (
                anime_name,
                title,
                episode_number,
                season_number,
                runtime,
                anime_date,
                notes,
                script_writer,
                anime_director,
                rating,
                content_type,
                alphabet,
                watch_status,
                user_id
            )
            VALUES (
                :anime_name,
                :title,
                :episode_number,
                :season_number,
                :runtime,
                :anime_date,
                :notes,
                :script_writer,
                :anime_director,
                :rating,
                :content_type,
                :alphabet,
                :watch_status,
                :user_id
            )
        """), {**payload.model_dump(), "user_id": user_id,}
    )

    db.commit()

    return {"message": "Anime added successfully"}


def get_anime_by_story(anime_id: int, db, user_id: int):
    row = db.execute(
        text(f"""
            SELECT * 
            FROM anime_tracker
            WHERE anime_id = :anime_id AND user_id = :user_id
        """),
        {"anime_id": anime_id, "user_id": user_id}
    ).mappings().fetchone()
                
    if not row:
        raise HTTPException(status_code=404, detail="Anime not found")
    
    return dict(row)


def update_anime(
    anime_id: int,
    payload: AnimeCreate,
    db
    , user_id: int
):
    anime_exist = db.execute(text("""SELECT 1 FROM anime_tracker 
            WHERE user_id = :user_id 
            AND anime_name = :anime_name 
            AND LOWER(TRIM(title)) = LOWER(TRIM(:title)) \
            AND anime_id != :anime_id """), 
            {"user_id": user_id, "anime_name" : payload.anime_name, "title" : payload.title, "anime_id" : anime_id}).fetchone()
        
    if anime_exist:
         raise HTTPException(status_code=400, detail="An anime with this title already exists")
    
    episode_exist = db.execute(text("""SELECT 1 FROM anime_tracker 
                WHERE user_id = :user_id 
                AND anime_name = :anime_name 
                AND episode_number = :episode_number 
                AND season_number IS NOT DISTINCT FROM :season_number 
                AND alphabet IS NOT DISTINCT FROM :alphabet 
                AND anime_id != :anime_id"""), 
                {"user_id": user_id, "anime_name" : payload.anime_name, "episode_number" : payload.episode_number, "season_number" : payload.season_number, "alphabet" : payload.alphabet, "anime_id" : anime_id}).fetchone()
            
    if episode_exist:
          raise HTTPException(status_code=400, detail="An anime with this episode number already exists")

    result = db.execute(
        text("""
            UPDATE anime_tracker
            SET
                anime_name = :anime_name,
                title = :title,
                episode_number = :episode_number,
                season_number = :season_number,
                runtime = :runtime,
                anime_date = :anime_date,
                notes = :notes,
                script_writer = :script_writer,
                anime_director = :anime_director,
                rating = :rating,
                content_type = :content_type,
                alphabet = :alphabet,
                watch_status = :watch_status
            WHERE anime_id = :anime_id AND user_id = :user_id
        """),
        {
            **payload.model_dump(),
            "anime_id": anime_id,
            "user_id": user_id,
        }
    )

    db.commit()

    if result.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Anime not found"
        )

    return {"message": "Anime updated successfully"}

def delete_anime(anime_id: int, db, user_id: int):
    result = db.execute(
        text("""
            DELETE FROM anime_tracker WHERE anime_id = :anime_id AND user_id = :user_id
        """),{"anime_id": anime_id, "user_id": user_id}
    )
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Anime not found")

    db.commit()

    return {"message": "Anime deleted successfully"}


