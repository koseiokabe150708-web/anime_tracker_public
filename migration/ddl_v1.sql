BEGIN;

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE anime (

  anime_id SERIAL PRIMARY KEY,

  content_type TEXT NOT NULL
    CHECK (content_type IN ('ANIME_SHOW', 'MOVIE')),

  title TEXT NOT NULL,

  watch_status TEXT,

  rating INTEGER,

  notes TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

);

CREATE TRIGGER trg_anime_updated_at
BEFORE UPDATE ON anime
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

COMMIT;