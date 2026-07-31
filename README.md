# Anime Tracker Public
An anime tracking web application system that allows user to store their personal anime episodes and movies, organizing episodes, assign characters to specific episodes and also rate them.

## Features
- User registration and login
- JWT-based authentication
- Personal anime and movie collections for each user
- Add, edit, delete episode to animes or movies
- Add, edit, delete characters for each anime or movie episode 
- Sort animes and movies by dates, episode number and ratings
- Search anime name by title, or by filtering by different characters
- Simple multipage layout interface

## Tech Stack

### Backend
- FastAPI
- Python
- PostgreSQL database

### Frontend
- React
- Vite
- JavaScript

## Project structure
anime_tracker_public/
├── README.md
├── backend
│   ├── Procfile
│   ├── app
│   ├── database.py
│   ├── main.py
│   ├── migrate_rokuyo.py
│   └── requirements.txt
├── frontend
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   ├── src
│   └── vite.config.js
└── migration
    └── ddl_v1.sql

## API
### Anime
- |GET| '/anime' - Get all the anime for the user
- |POST| '/anime' - Add new anime for the user
- |GET| '/anime/{anime_id}' - Get the anime of the anime_id for the user
- |PUT| '/anime/{anime_id}' - Edit the anime of the anime_id for the user
- |DELETE| '/anime/{anime_id}' - Delete the anime of the anime_id for the user

### Movie
- |GET| '/movie' - Get all the movie for the user
- |POST| '/movie' - Add new movie for the user
- |GET| /movie/{movie_id} - Get the movie of the movie_id for the user
- |PUT| /movie/{movie_id} - Edit the movie of the movie_id for the user
- |DELETE| /movie/{movie_id} - Delete the movie of the movie_id for the user

### Users
- |POST| /register - Add new user to registration
- |POST| /login - Login the user and let the user get the token and refresh token
- |POST| /refresh - Get the new refresh token when expire

### Characters
- |GET| /character - Get all the characters for the user
- |POST| /character - Add new characters for the user
- |PUT| /character/{character_id} - Edit the character of the character_id for the user
- |DELETE| /character/{character_id} - Delete the character of the character_id for the user
- |GET| /episode_characters - Get all the characters and episode relationship for the user
- |DELETE| /episode_characters/{character_id} - Delete  characters and episode relationship for the specific character_id for the user
- |GET| /episode_characters/{anime_id} - Get all the characters and episode relationship for the specific anime of anime_id for the user
- |POST| /episode_characters - Add new characters and episode relationship for the user

### Future improvement
- Allow user to rate and put comments on each episodes in anime publicly
- Add automated testing
- Able to add images to anime episodes
- Create character page to display character ranking