from pydantic import BaseModel
from datetime import date

class AnimeCreate(BaseModel):
    content_type: str
    title: str
    story_number: int
    alphabet: str | None = None
    positive_score: int
    negative_score: int
    opponent: str | None = None
    rokuyo: str | None = None
    notes: str | None = None
    script_writer: str | None = None
    animation_director: str | None = None
    anime_date: date
    character_appear: bool = True
    watch_status: str
