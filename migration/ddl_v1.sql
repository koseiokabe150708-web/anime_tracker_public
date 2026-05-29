BEGIN;

DROP TABLE IF EXISTS anime;

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE anime (
  anime_id        SERIAL PRIMARY KEY,
  content_type    TEXT NOT NULL CHECK (content_type IN ('ANIME_SHOW', 'MOVIE')),
  title           TEXT NOT NULL,
  story_number    INTEGER,
  positive_score  INTEGER CHECK (positive_score >= 0),
  negative_score  INTEGER CHECK (negative_score >= 0),
  opponent        TEXT,
  rokuyo          TEXT,
  notes           TEXT,
  anime_date      DATE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  character_appear       BOOLEAN NOT NULL DEFAULT TRUE,
  watch_status    TEXT,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_anime_updated_at
BEFORE UPDATE ON anime
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

COMMIT;