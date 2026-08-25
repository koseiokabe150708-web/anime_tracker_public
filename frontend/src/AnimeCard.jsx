import { useEffect, useState } from "react";
import { fetchWithAuth, API_BASE_URL } from "./api";

function AnimeCard({ anime, onEdit, onDelete }) {
  const [characters, setCharacters] = useState([]);
  const [episodeCharacters, setEpisodeCharacters] = useState([]);
  const [showCharacterInput, setShowCharacterInput] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState("");

  useEffect(() => {
  fetchWithAuth(`${API_BASE_URL}/character`)
    .then((res) => res.json())
    .then((data) => setCharacters(data));
}, []);

useEffect(() => {
  fetchWithAuth(
    `${API_BASE_URL}/episode_character/${anime.anime_id}`
  )
    .then((res) => res.json())
    .then((data) => setEpisodeCharacters(data));
}, [anime.anime_id]);

async function handleAddEpisodeCharacter() {
  if (!selectedCharacter) return;

  await fetchWithAuth(`${API_BASE_URL}/episode_character`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      anime_id: anime.anime_id,
      character_id: Number(selectedCharacter),
    }),
  });

  const res = await fetchWithAuth(
    `${API_BASE_URL}/episode_character/${anime.anime_id}`
  );

  const data = await res.json();
  setEpisodeCharacters(data);
  setSelectedCharacter("");
  setShowCharacterInput(false);
}

async function handleDeleteEpisodeCharacter(episode_character_id) {
  await fetchWithAuth(
    `${API_BASE_URL}/episode_character/${episode_character_id}`,
    {
      method: "DELETE",
    }
  );

  const res = await fetchWithAuth(
    `${API_BASE_URL}/episode_character/${anime.anime_id}`
  );

  const data = await res.json();
  setEpisodeCharacters(data);
}

  return (
  <div style={{ border: "2px solid #004583", backgroundColor: "#004583", padding: "10px", color: "white", margin: "10px", borderRadius: "8px", width: "250px" }}>
    {anime.episode_number ? <h2>{anime.content_type === "ANIME_SHOW" ? `${anime.episode_number} ${anime.alphabet}` : `${anime.content_type} ${anime.episode_number} ${anime.alphabet}`}</h2> : null}
    <p>タイトル：{anime.title}</p>
    <p>日付：{anime.anime_date}</p>
    {anime.script_writer && <p> 脚本：{anime.script_writer}</p>}
    {anime.anime_director && <p> 作画監督：{anime.anime_director}</p>}
    <p>評価：{anime.rating}</p>
    <p>視聴状況：{anime.watch_status}</p>
    
    {/* Characters */}
    <div>
      <p>登場キャラ：{episodeCharacters.map(ec => {
  const character = characters.find(c => c.character_id === ec.character_id);
  return (
    <span key={ec.episode_character_id}>
      {character ? character.character_name : ec.character_id}
      <button onClick={() => handleDeleteEpisodeCharacter(ec.episode_character_id)} style={{ background: "none", border: "none", color: "red", cursor: "pointer" }}>×</button>
    </span>
  );
})}</p>
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