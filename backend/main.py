from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends, HTTPException

from lunardate import LunarDate

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
    rows = db.execute(text("SELECT * FROM anime ORDER by anime_date, alphabet")).fetchall()
    return [dict(row._mapping) for row in rows]

@app.post("/anime")
def add_anime(payload: AnimeCreate, db: Session = Depends(get_db)):

    lunar = LunarDate.fromSolarDate(payload.anime_date.year, payload.anime_date.month, payload.anime_date.day)
    rokuyo_list = ["大安", "赤口", "先勝", "友引", "先負", "仏滅"]
    rokuyo = rokuyo_list[(lunar.month + lunar.day) % 6]

    db.execute(
        text("""
            INSERT INTO anime (
                content_type,
                title,
                story_number,
                alphabet,
                positive_score,
                negative_score,
                opponent,
                rokuyo,
                notes,
                script_writer,
                animation_director,
                anime_date,
                character_appear,
                watch_status
            )
            VALUES (
                :content_type,
                :title,
                :story_number,
                :alphabet,
                :positive_score,
                :negative_score,
                :opponent,
                :rokuyo,
                :notes,
                :script_writer,
                :animation_director,
                :anime_date,
                :character_appear,
                :watch_status
            )
        """),
        {**payload.model_dump(), "rokuyo": rokuyo}
    )

    db.commit()

    return {"message": "Anime added successfully"}

@app.get("/anime/{anime_id}")
def get_anime_by_story(anime_id: int, db: Session = Depends(get_db)):
    row = db.execute(
        text(f"""
            SELECT * 
            FROM anime
            WHERE anime_id = :anime_id
        """),
        {"anime_id": anime_id},
    ).mappings().fetchone()
                
    if not row:
        raise HTTPException(status_code=404, detail="Anime not found")
    
    return dict(row)

@app.put("/anime/{anime_id}")
def update_anime(
    anime_id: int,
    payload: AnimeCreate,
    db: Session = Depends(get_db)
):
    result = db.execute(
        text("""
            UPDATE anime
            SET
                content_type = :content_type,
                story_number = :story_number,
                alphabet = :alphabet,
                title = :title,
                positive_score = :positive_score,
                negative_score = :negative_score,
                opponent = :opponent,
                rokuyo = :rokuyo,
                notes = :notes,
                script_writer = :script_writer,
                animation_director = :animation_director,
                anime_date = :anime_date,
                character_appear = :character_appear,
                watch_status = :watch_status
            WHERE anime_id = :anime_id
        """),
        {
            **payload.model_dump(),
            "anime_id": anime_id
        }
    )

    db.commit()

    if result.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Anime not found"
        )

    return {"message": "Anime updated successfully"}
