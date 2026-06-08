from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from app.services.movies import get_movie, add_movie, get_movie_by_story, update_movie, delete_movie
from app.schemas.movies import MovieCreate

router = APIRouter(
    tags=["movie"]
)

@router.get("/movie")
def get_movie_endpoint(db: Session = Depends(get_db)):
    return get_movie(db)

@router.post("/movie")
def add_movie_endpoint(payload: MovieCreate, db: Session = Depends(get_db)):

    return add_movie(payload, db)

@router.get("/movie/{movie_id}")
def get_movie_by_story_endpoint(movie_id: int, db: Session = Depends(get_db)):
    
    return get_movie_by_story(movie_id, db)

@router.put("/movie/{movie_id}")
def update_movie_endpoint(
    movie_id: int,
    payload: MovieCreate,
    db: Session = Depends(get_db)):

    return update_movie(movie_id, payload, db)

@router.delete("/movie/{movie_id}")
def delete_movie_endpoint(movie_id: int, db: Session = Depends(get_db)):
    return delete_movie(movie_id, db)