from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from app.schemas.users import UserCreate, UserLogin, Token
from app.auth import hash_password, verify_password, create_access_token
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(
    tags=["users"]
)

@router.post("/register")
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.execute(text("""SELECT * FROM users WHERE email = :email """), {"email": payload.email}).fetchone()

    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(payload.password)

    db.execute(
    text("INSERT INTO users (email, password_hash) VALUES (:email, :password_hash)"),
    {"email": payload.email, "password_hash": hashed}
)

    db.commit()
    return {"message": "User registered successfully"}


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.execute(
        text("SELECT * FROM users WHERE email = :email"),
        {"email": form_data.username}
    ).mappings().fetchone()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user["email"], "user_id": user["user_id"]})
    return {"access_token": token, "token_type": "bearer"}

