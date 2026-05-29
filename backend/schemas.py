from pydantic import BaseModel
from datetime import date

class AnimeCreate(BaseModel):
    content_type: str
    title: str
    story_number: int
    positive_score: int
    negative_score: int
    opponent: str | None = None
    rokuyo: str | None = None
    notes: str | None = None
    anime_date: date
    character_appear: bool = True
    watch_status: str
