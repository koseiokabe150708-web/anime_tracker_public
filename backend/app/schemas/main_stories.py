from pydantic import BaseModel
from datetime import date

class AnimeCreate(BaseModel):
    title: str
    episode_number: int
    anime_date: date
    notes: str | None = None
    script_writer: str | None = None
    anime_director: str | None = None
    rating: int
    watch_status: str