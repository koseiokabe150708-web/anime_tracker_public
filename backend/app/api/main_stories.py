from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from app.services.main_stories import get_anime, add_anime, get_anime_by_story, update_anime, delete_anime
from app.schemas.main_stories import AnimeCreate
from app.auth import get_current_user

router = APIRouter(
    tags=["anime"]
)

@router.get("/anime")
def get_anime_endpoint(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return get_anime(db, current_user["user_id"])

@router.post("/anime")
def add_anime_endpoint(payload: AnimeCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):

    return add_anime(payload, db, current_user["user_id"])

@router.get("/anime/{anime_id}")
def get_anime_by_story_endpoint(anime_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    
    return get_anime_by_story(anime_id, db, current_user["user_id"])

@router.put("/anime/{anime_id}")
def update_anime_endpoint(anime_id: int, payload: AnimeCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return update_anime(anime_id, payload, db, current_user["user_id"])

@router.delete("/anime/{anime_id}")
def delete_anime_endpoint(anime_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return delete_anime(anime_id, db, current_user["user_id"])