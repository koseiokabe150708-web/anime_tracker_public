from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from app.schemas.users import UserCreate, UserLogin, Token, RefreshToken
from app.auth import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from jose import JWTError
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
    token_2 = create_refresh_token({"sub": user["email"], "user_id": user["user_id"]})
    db.execute(text("""UPDATE users SET refresh_token = :refresh_token WHERE user_id = :user_id """), {"refresh_token": token_2, "user_id": user["user_id"]})
    db.commit()
    return {"access_token": token, "refresh_token": token_2, "token_type": "bearer"}

@router.post("/refresh")
def refresh(payload: RefreshToken, db: Session = Depends(get_db)):
    if not payload.refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")
    try:
        decoded = decode_token(payload.refresh_token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    user_id = decoded.get("user_id")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user = db.execute(
        text("SELECT * FROM users WHERE user_id = :user_id AND refresh_token = :refresh_token"),
        {"user_id": user_id, "refresh_token": payload.refresh_token}
    ).mappings().fetchone()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    new_access_token = create_access_token({"sub": user["email"], "user_id": user["user_id"]})
    return {"access_token": new_access_token, "token_type": "bearer"}
