from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.main_stories import router
from app.api.characters import router as character_router
from app.api.users import router as users_router
import os
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=ALLOWED_ORIGINS, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/")
def root():
    return {"message": "Shin Chan Tracker API is running"}

app.include_router(router)
app.include_router(users_router)
app.include_router(character_router)
