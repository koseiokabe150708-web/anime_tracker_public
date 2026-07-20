from pydantic import BaseModel

class CharacterCreate(BaseModel):
    anime_name: str
    character_name: str

class EpisodeCharacterCreate(BaseModel):
    anime_id: int
    character_id: int
