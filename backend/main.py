from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends, HTTPException

from database import get_db
from schemas import AnimeCreate
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Shin Chan Tracker API is running"}

@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1")).scalar()
    return {"database": result}

@app.get("/anime")
def get_anime(db: Session = Depends(get_db)):
    rows = db.execute(text("SELECT * FROM anime ORDER by story_number")).fetchall()
    return [dict(row._mapping) for row in rows]

@app.post("/anime")
def add_anime(payload: AnimeCreate, db: Session = Depends(get_db)):

    db.execute(
        text("""
            INSERT INTO anime (
                content_type,
                title,
                story_number,
                positive_score,
                negative_score,
                opponent,
                rokuyo,
                notes,
                anime_date,
                character_appear,
                watch_status
            )
            VALUES (
                :content_type,
                :title,
                :story_number,
                :positive_score,
                :negative_score,
                :opponent,
                :rokuyo,
                :notes,
                :anime_date,
                :character_appear,
                :watch_status
            )
        """),
        payload.model_dump()
    )

    db.commit()

    return {"message": "Anime added successfully"}

@app.get("/anime/{story_number}")
def get_anime_by_story(story_number: int, db: Session = Depends(get_db)):
    row = db.execute(
        text(f"""
            SELECT * 
            FROM anime
            WHERE story_number = :story_number
        """),
        {"story_number": story_number},
    ).mappings().fetchone()
                
    if not row:
        raise HTTPException(status_code=404, detail="Anime not found")
    
    return dict(row)

@app.put("/anime/{story_number}")
def update_anime(
    story_number: int,
    payload: AnimeCreate,
    db: Session = Depends(get_db)
):
    result = db.execute(
        text("""
            UPDATE anime
            SET
                content_type = :content_type,
                title = :title,
                positive_score = :positive_score,
                negative_score = :negative_score,
                opponent = :opponent,
                rokuyo = :rokuyo,
                notes = :notes,
                anime_date = :anime_date,
                character_appear = :character_appear,
                watch_status = :watch_status
            WHERE story_number = :story_number
        """),
        {
            **payload.model_dump(),
            "story_number": story_number
        }
    )

    db.commit()

    if result.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Anime not found"
        )

    return {"message": "Anime updated successfully"}