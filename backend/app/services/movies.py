from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.schemas.movies import MovieCreate

def get_movie(db):
    rows = db.execute(text("SELECT * FROM movies ORDER by year")).fetchall()
    return [dict(row._mapping) for row in rows]

def add_movie(payload: MovieCreate, db):
    db.execute(
        text("""
            INSERT INTO movies (
                year,
                title,
                movie_number,
                positive_score,
                negative_score,
                opponent,
                movie_date,
                script_writer,
                movie_director
            )
            VALUES (
                :year,
                :title,
                :movie_number,
                :positive_score,
                :negative_score,
                :opponent,
                :movie_date,
                :script_writer,
                :movie_director
            )
        """),
        {**payload.model_dump()}
    )

    db.commit()

    return {"message": "Movie added successfully"}


def get_movie_by_story(movie_id: int, db):
    row = db.execute(
        text(f"""
            SELECT * 
            FROM movies
            WHERE movie_id = :movie_id
        """),
        {"movie_id": movie_id},
    ).mappings().fetchone()
                
    if not row:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    return dict(row)


def update_movie(
    movie_id: int,
    payload: MovieCreate,
    db
):

    result = db.execute(
        text("""
            UPDATE movies
            SET
                year = :year,
                title = :title,
                movie_number = :movie_number,
                positive_score = :positive_score,
                negative_score = :negative_score,
                opponent = :opponent,
                movie_date = :movie_date,
                script_writer = :script_writer,
                movie_director = :movie_director
            WHERE movie_id = :movie_id
        """),
        {
            **payload.model_dump(),
            "movie_id": movie_id,
        }
    )

    db.commit()

    if result.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Movie not found"
        )

    return {"message": "Movie updated successfully"}

def delete_movie(movie_id: int, db):
    result = db.execute(
        text("""
            DELETE FROM movies WHERE movie_id = :movie_id
        """),{"movie_id": movie_id}
    )
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Movie not found")

    db.commit()

    return {"message": "Movie deleted successfully"}

