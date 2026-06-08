from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.main_stories import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Shin Chan Tracker API is running"}

app.include_router(router)
