import { useEffect, useState } from "react";

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [content, setContent] = useState("ANIME_SHOW");
  const [title, setTitle] = useState("");
  const [storyNumber, setStoryNumber] = useState("");
  const [positiveScore, setPositiveScore] = useState(0);
  const [negativeScore, setNegativeScore] = useState(0);
  const [opponent, setOpponent] = useState("");
  const [rokuyo, setRokuyo] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [character_appear, setCharacter_appear] = useState(true);
  const [watchStatus, setWatchStatus] = useState("WATCHED");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/anime")
      .then((res) => res.json())
      .then((data) => setAnimeList(data));
  }, []);

  async function handleAddAnime() {
    try {
      setLoading(true);
      setError("");

      const payload = {
        content_type: content,
        title: title,
        story_number: Number(storyNumber),
        positive_score: Number(positiveScore),
        negative_score: Number(negativeScore),
        opponent: opponent,
        rokuyo: rokuyo,
        notes: notes,
        anime_date: date,
        character_appear: character_appear,
        watch_status: watchStatus,
      };

      await fetch("http://127.0.0.1:8000/anime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const res = await fetch("http://127.0.0.1:8000/anime");
      const data = await res.json();
      setAnimeList(data);

      setTitle("");
      setStoryNumber("");
      setPositiveScore(0);
      setNegativeScore(0);
      setOpponent("");
      setRokuyo("");
      setNotes("");
      setDate("");
      setCharacter_appear(true);
      setWatchStatus("WATCHED");

    } catch (err) {
      setError("Failed to add anime");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Shin Chan Tracker</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Saving...</p>}

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
  />
        <select 
        value={content} 
        onChange={(e) => setContent(e.target.value)}>
          {["ANIME_SHOW", "MOVIE"].map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>

        <input
        type = "number"
        value={storyNumber}
        onChange={(e) => setStoryNumber(e.target.value)}
        placeholder="Story number"
  />
        <input
        type = "number"
        value={positiveScore}
        onChange={(e) => setPositiveScore(e.target.value)}
        placeholder="Positive score"
  />
        <input
        type = "number"
        value={negativeScore}
        onChange={(e) => setNegativeScore(e.target.value)}
        placeholder="Negative score"
  />
        <select 
        value={opponent} 
        onChange={(e) => setOpponent(e.target.value)}>
          {["Y", "C", "H", "G", "H"].map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>

        <select 
        value={rokuyo} 
        onChange={(e) => setRokuyo(e.target.value)}>
          {["大安", "仏滅", "先負", "先勝", "赤口", "友引"].map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>

        <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
  />
        <input
        type = "date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        placeholder="Dates"
  />
        <label>
          Character Appears
        <input
        type="checkbox"
        checked={character_appear}
        onChange={(e) => setCharacter_appear(e.target.checked)}
  />
        </label>

        <input
        value={watchStatus}
        onChange={(e) => setWatchStatus(e.target.value)}
        placeholder="Watch status"
  />
        <button onClick={handleAddAnime}>Add Anime</button>

      {animeList.map((anime) => (
        <div key={anime.anime_id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px", borderRadius: "8px" }}>
          <h3>{anime.story_number}</h3>
          <p>{anime.title}</p>
          <p>Score: +{anime.positive_score} / -{anime.negative_score}</p>
        </div>
      ))}
    </div>
  );
}

export default App;