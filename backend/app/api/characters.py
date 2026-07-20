from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from app.services.characters import get_character, add_character, get_episode_characters, add_episode_character
from app.schemas.characters import CharacterCreate, EpisodeCharacterCreate
from app.auth import get_current_user

router = APIRouter(
    tags=["character"]
)

@router.get("/character")
def get_character_endpoint(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return get_character(db, current_user["user_id"])

@router.post("/character")
def add_character_endpoint(payload: CharacterCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):

    return add_character(payload, db, current_user["user_id"])

@router.get("/episode_character/{anime_id}")
def get_episode_character_endpoint(anime_id: int, db: Session = Depends(get_db)):
    return get_episode_characters(anime_id, db)

@router.post("/episode_character")
def add_episode_character_endpoint(payload: EpisodeCharacterCreate, db: Session = Depends(get_db)):
    return add_episode_character(payload, db)
