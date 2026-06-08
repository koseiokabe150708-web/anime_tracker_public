from pydantic import BaseModel
from datetime import date

class MovieCreate(BaseModel):
    year: int
    title: str
    movie_number: int
    positive_score: int
    negative_score: int
    opponent: str | None = None
    movie_date: date
    script_writer: str | None = None
    movie_director: str | None = None