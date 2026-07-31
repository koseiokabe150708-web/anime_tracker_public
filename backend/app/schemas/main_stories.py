from pydantic import BaseModel
from datetime import date

class AnimeCreate(BaseModel):
    title: str
    anime_name: str | None = None
    episode_number: int
    season_number: int | None = None
    runtime: int | None = None
    anime_date: date
    notes: str | None = None
    script_writer: str | None = None
    anime_director: str | None = None
    rating: int
    content_type: str = "ANIME SHOW"
    alphabet: str | None = None
    watch_status: str