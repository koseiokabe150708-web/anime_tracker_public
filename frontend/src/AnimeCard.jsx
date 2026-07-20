import { useEffect, useState } from "react";
import { fetchWithAuth } from "./api";

function AnimeCard({ anime, onEdit, onDelete }) {
  const [characters, setCharacters] = useState([]);
  const [episodeCharacters, setEpisodeCharacters] = useState([]);
  const [showCharacterInput, setShowCharacterInput] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState("");

  useEffect(() => {

    fetchWithAuth("http://127.0.0.1:8000/character")
    .then((res) => res.json())
    .then((data) => setCharacters(data));
}, []);

useEffect(() => {

fetchWithAuth(`http://127.0.0.1:8000/episode_character/${anime.anime_id}`)
    .then((res) => res.json())
    .then((data) => setEpisodeCharacters(data));
}, []);
    // fetch characters for this anime
    // fetch episode characters for this specific episode

async function handleAddEpisodeCharacter() {
  if (!selectedCharacter) return;
  await fetchWithAuth("http://127.0.0.1:8000/episode_character", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ anime_id: anime.anime_id, character_id: Number(selectedCharacter) })
  });
  const res = await fetchWithAuth(`http://127.0.0.1:8000/episode_character/${anime.anime_id}`);
  const data = await res.json();
  setEpisodeCharacters(data);
  setShowCharacterInput(false);
}

  return (
  <div style={{ border: "2px solid #004583", backgroundColor: "#004583", padding: "10px", color: "white", margin: "10px", borderRadius: "8px", width: "250px" }}>
    <h2>{anime.content_type === "ANIME_SHOW" ? `${anime.episode_number} ${anime.alphabet}` : `${anime.content_type} ${anime.episode_number} ${anime.alphabet}`}</h2>
    <p>タイトル：{anime.title}</p>
    <p>日付：{anime.anime_date}</p>
    <p>脚本：{anime.script_writer}</p>
    <p>作画監督：{anime.anime_director}</p>
    <p>評価：{anime.rating}</p>
    <p>視聴状況：{anime.watch_status}</p>
    
    {/* Characters */}
    <div>
      <p>登場キャラ：{episodeCharacters.map(ec => {
  const character = characters.find(c => c.character_id === ec.character_id);
  return character ? character.character_name : ec.character_id;
}).join(", ")}</p>
      <button onClick={() => setShowCharacterInput(!showCharacterInput)}>+ キャラ追加</button>
      {showCharacterInput && (
        <div>
          <select value={selectedCharacter} onChange={(e) => setSelectedCharacter(e.target.value)}>
            <option value="">選択してください</option>
            {characters.filter(c => c.anime_name === anime.anime_name).map(c => (
              <option key={c.character_id} value={c.character_id}>{c.character_name}</option>
            ))}
          </select>
          <button onClick={handleAddEpisodeCharacter}>Add</button>
        </div>
      )}
    </div>

    <button onClick={() => onEdit(anime)}>Edit</button>
    <button onClick={() => onDelete(anime.anime_id)}>Delete</button>
  </div>
);}

export default AnimeCard;