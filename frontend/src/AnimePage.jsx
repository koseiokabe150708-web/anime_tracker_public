import { useEffect, useState } from "react";
import Layout from "./Layout"
import { useParams } from "react-router-dom";
import { fetchWithAuth, API_BASE_URL } from "./api";
import AnimeCard from "./AnimeCard";

function AnimePage() {
    const { animeName: urlAnimeName } = useParams();
    const [animeList, setAnimeList] = useState([]);
  const [title, setTitle] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [scriptwriter, setScriptWriter] = useState("");
  const [animedirector, setAnimeDirector] = useState("");
  const [date, setDate] = useState("");
  const [watchStatus, setWatchStatus] = useState("WATCHED");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState("ANIME_SHOW");
  const [alphabets, setAlphabet] = useState("");
  const [seasonNumber, setSeasonNumber] = useState("");
  const [animeName, setAnimeName] = useState(urlAnimeName);
  const [animeSearch, setAnimeSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState("");
  const [characters, setCharacters] = useState([]);

  const [editingCharacter, setEditingCharacter] = useState(null);
  const [editCharacterName, setEditCharacterName] = useState("");

  const [year, setYear] = useState("all");
  const [monthOption, setMonthOption] = useState("all");
  const [activeFilter, setActiveFilter] = useState("year")
  const [editingAnime, setEditingAnime] = useState(null)
  const [episodeCharacters, setEpisodeCharacters] = useState([]);
  const [characterFilter, setCharacterFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1)

  // ---- derived data (order matters: each depends on the one above it) ----

  const years = ["all", ...new Set(animeList.map((anime) => new Date(anime.anime_date).getFullYear()))]

  const filteredByAnimeName = animeList.filter(a => a.anime_name === urlAnimeName && a.content_type !== "MOVIE")

  const filteredBySearch = animeSearch === ""
    ? filteredByAnimeName
    : filteredByAnimeName.filter(a => a.title.includes(animeSearch))

  const filteredAnime = year === "all"
    ? filteredBySearch
    : filteredBySearch.filter(a => new Date(a.anime_date).getFullYear() === year)

  const monthOptions = ["all", ...new Set(animeList.map((anime) => new Date(anime.anime_date).getMonth() + 1))].sort((a, b) => {
    if (a === "all") return -1;
    if (b === "all") return 1;
    return a - b;
  })

  const filteredAnimemonth = monthOption === "all"
    ? filteredAnime
    : filteredAnime.filter((anime) => new Date(anime.anime_date).getMonth() + 1 === monthOption)

  const filteredByCharacter = characterFilter === ""
    ? filteredAnimemonth
    : filteredAnimemonth.filter(anime =>
        episodeCharacters.some(
          ec => ec.anime_id === anime.anime_id && ec.character_id === Number(characterFilter)
        )
      );

  const sortedAnime = sortOption === "date"
    ? [...filteredByCharacter].sort((a, b) => new Date(a.anime_date) - new Date(b.anime_date))
    : sortOption === "rating"
    ? [...filteredByCharacter].sort((a, b) => b.rating - a.rating)
    : sortOption === "episode"
    ? [...filteredByCharacter].sort((a, b) => a.episode_number - b.episode_number)
    : filteredByCharacter;

  const pageSize = 20
  const paginatedAnime = sortedAnime.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const totalPages = Math.ceil(sortedAnime.length / pageSize)

  // ---- effects ----

  useEffect(() => {
    fetchWithAuth(`${API_BASE_URL}/episode_characters`)
      .then(res => res.json())
      .then(data => setEpisodeCharacters(data));
  }, []);

  useEffect(() => {
    fetchWithAuth(`${API_BASE_URL}/anime`)
      .then((res) => res.json())
      .then((data) => setAnimeList(data));
  }, []);

  useEffect(() => {
    fetchWithAuth(`${API_BASE_URL}/character`)
      .then(res => res.json())
      .then(data => setCharacters(data.filter(c => c.anime_name === urlAnimeName)));
  }, [urlAnimeName]);

  useEffect(() => {
    setAnimeName(urlAnimeName);
  }, [urlAnimeName]);

  // ---- handlers ----

  async function handleAddAnime() {
    if (!title.trim()) {
      setError("タイトルを入力してください");
      return;
    }
    if (episodeNumber <= 0) {
      setError("話数を入力してください")
      return;
    }
    if (!date) {
      setError("日付を入力してください")
      return;
    }
    if (!rating || rating < 1 || rating > 10) {
      setError("評価を入力してください")
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        anime_name: animeName,
        title: title,
        alphabet: alphabets,
        episode_number: Number(episodeNumber),
        season_number: Number(seasonNumber),
        notes: notes,
        script_writer: scriptwriter,
        anime_director: animedirector,
        anime_date: date,
        rating: Number(rating),
        content_type: content,
        watch_status: watchStatus,
      };

      const res = await fetchWithAuth(`${API_BASE_URL}/anime`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.detail || "Failed to add anime");
        return;
      }

      const animeres = await fetchWithAuth(`${API_BASE_URL}/anime`)
      const data = await animeres.json();
      setAnimeList(data);

      setAnimeName(urlAnimeName)
      setTitle("");
      setEpisodeNumber("");
      setSeasonNumber("");
      setNotes("");
      setScriptWriter("");
      setAnimeDirector("");
      setDate("");
      setRating(0);
      setAlphabet("");
      setWatchStatus("WATCHED");

    } catch (err) {
      setError("Failed to add anime");
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(anime) {
    setAnimeName(urlAnimeName);
    setTitle(anime.title || "");
    setEpisodeNumber(anime.episode_number);
    setSeasonNumber(anime.season_number);
    setNotes(anime.notes || "");
    setScriptWriter(anime.script_writer || "")
    setAnimeDirector(anime.anime_director || "");
    setDate(anime.anime_date);
    setWatchStatus(anime.watch_status || "");
    setContent(anime.content_type || "");
    setRating(anime.rating || 0);
    setAlphabet(anime.alphabet || "");
    setEditingAnime(anime)
  }

  async function handleUpdate() {
    try {
      setLoading(true);
      setError("");

      const payload = {
        anime_name: animeName,
        title: title,
        alphabet: alphabets,
        episode_number: Number(episodeNumber),
        season_number: Number(seasonNumber),
        notes: notes,
        script_writer: scriptwriter,
        anime_director: animedirector,
        anime_date: date,
        rating: Number(rating),
        content_type: content,
        watch_status: watchStatus,
      };

      const res = await fetchWithAuth(
  `${API_BASE_URL}/anime/${editingAnime.anime_id}`
, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.detail || "Failed to edit anime");
        return;
      }

      const animeres = await fetchWithAuth(`${API_BASE_URL}/anime`)
      const data = await animeres.json();
      setAnimeList(data);

      setAnimeName(urlAnimeName)
      setTitle("");
      setEpisodeNumber("");
      setSeasonNumber("");
      setNotes("");
      setScriptWriter("");
      setAnimeDirector("");
      setDate("");
      setWatchStatus("WATCHED");
      setRating(0);
      setAlphabet("");
      setEditingAnime(null);

    } catch (err) {
      setError("Failed to edit anime");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(anime_id) {
    const confirmed = window.confirm("本当に削除しますか?");
    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");

    
      await fetchWithAuth(`${API_BASE_URL}/anime/${anime_id}`, {
  method: "DELETE",
});
      const res = await fetchWithAuth(`${API_BASE_URL}/anime`)
      const data = await res.json();
      setAnimeList(data);
    } catch (err) {
      setError("Failed to delete anime");
    } finally {
      setLoading(false);
    }
  }

  function resetFilter() {
    setYear("all");
    setMonthOption("all");
    setSortOption("");
    setAnimeSearch("");
    setCurrentPage(1);
    setCharacterFilter("");
  }

  async function handleAddCharacter() {
    if (!newCharacterName.trim()) return;
    const res = await fetchWithAuth(`${API_BASE_URL}/character`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ anime_name: urlAnimeName, character_name: newCharacterName })
    });
    if (!res.ok) {
      const error = await res.json();
      alert(error.detail || "Failed to add character");
      return;
    }
    setNewCharacterName("");
    const charres = await fetchWithAuth(`${API_BASE_URL}/character`);
    const data = await charres.json();
    setCharacters(data.filter(c => c.anime_name === urlAnimeName));
  }

  async function handleDeleteCharacter(character_id) {
    const confirmed = window.confirm("このキャラクターを削除しますか？");
    if (!confirmed) return;

    await fetchWithAuth(`${API_BASE_URL}/character/${character_id}`, {
      method: "DELETE",
    });

    const res = await fetchWithAuth(`${API_BASE_URL}/character`);
    const data = await res.json();
    setCharacters(data.filter(c => c.anime_name === urlAnimeName));
  }

  async function handleUpdateCharacter(character_id) {
    const res = await fetchWithAuth(`${API_BASE_URL}/character/${character_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anime_name: urlAnimeName,
        character_name: editCharacterName
      })
    });
    if (!res.ok) {
      const error = await res.json();
      alert(error.detail || "Failed to edit character");
      return;
    }
    setEditingCharacter(null);
    const charres = await fetchWithAuth(`${API_BASE_URL}/character`);
    const data = await charres.json();
    setCharacters(data.filter(c => c.anime_name === urlAnimeName));
  }

  function StarRating({ rating, onChange }) {
    return (
      <div>
        {[1,2,3,4,5,6,7,8,9,10].map(star => (
          <span
            key={star}
            onClick={() => onChange(star)}
            style={{ cursor: "pointer", fontSize: "20px", color: star <= rating ? "#FFD700" : "#ccc" }}
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  return (
    <Layout>
      {/* Form at top */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", padding: "16px", backgroundColor: "#f5f5f5", borderRadius: "8px", marginBottom: "16px" }}>
        <h1 style={{ color: "#1a1a1a", width: "100%" }}>{urlAnimeName}</h1>

        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Close" : "+ Add Anime"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {showForm && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Content</label>
            <select value={content} onChange={(e) => setContent(e.target.value)}>
                {["ANIME_SHOW","SHORT","SPECIAL"].map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Alphabet</label>
              <select value={alphabets} onChange={(e) => setAlphabet(e.target.value)} style={{ width: "140px" }}>
                <option value="">Single episode</option>
                <option value="a">a</option>
                <option value="b">b</option>
                <option value="c">c</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Episode number</label>
              <input type="number" value={episodeNumber} onChange={(e) => setEpisodeNumber(e.target.value)} placeholder="Episode number" style={{ width: "80px" }}/>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Season number</label>
              <input type="number" value={seasonNumber} onChange={(e) => setSeasonNumber(e.target.value)} placeholder="Season number" style={{ width: "80px" }}/>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Script writer</label>
              <input value={scriptwriter} onChange={(e) => setScriptWriter(e.target.value)} placeholder="Script writer" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Anime director</label>
              <input value={animedirector} onChange={(e) => setAnimeDirector(e.target.value)} placeholder="Anime director" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Note</label>
              <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Rating</label>
              <StarRating rating={Number(rating)} onChange={(val) => setRating(val)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Watch status</label>
              <select value={watchStatus} onChange={(e) => setWatchStatus(e.target.value)}>
                {["WATCHED","WATCHING","PLAN TO WATCH","DROPPED"].map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={editingAnime ? handleUpdate : handleAddAnime}>
                {editingAnime ? "Update" : "Add Anime"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Character Management */}
      <div style={{ padding: "16px", backgroundColor: "#f5f5f5", borderRadius: "8px", marginBottom: "16px" }}>
        <h3>Managing characters</h3>
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <input
            value={newCharacterName}
            onChange={(e) => setNewCharacterName(e.target.value)}
            placeholder="キャラクター名"
          />
          <button onClick={handleAddCharacter}>追加</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {characters.map(c => (
            <span key={c.character_id} style={{ backgroundColor: "#ddd", padding: "4px 8px", borderRadius: "4px", display: "inline-flex", gap: "4px", alignItems: "center" }}>
              {editingCharacter === c.character_id ? (
                <>
                  <input value={editCharacterName} onChange={(e) => setEditCharacterName(e.target.value)} style={{ width: "100px" }}/>
                  <button onClick={() => handleUpdateCharacter(c.character_id)}>保存</button>
                  <button onClick={() => setEditingCharacter(null)}>✕</button>
                </>
              ) : (
                <>
                  {c.character_name}
                  <button onClick={() => { setEditingCharacter(c.character_id); setEditCharacterName(c.character_name); }} style={{ background: "none", border: "none", cursor: "pointer" }}>✏️</button>
                  <button onClick={() => handleDeleteCharacter(c.character_id)} style={{ background: "none", border: "none", cursor: "pointer", color: "red" }}>×</button>
                </>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Sidebar + Cards */}
      <div style={{ display: "flex", gap: "16px" }}>

        {/* Sidebar */}
        <div style={{ width: "180px", display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#f5f5f5" }}>
          <div>
            <p style={{ fontWeight: "bold", marginBottom: "4px" }}>年</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {years.map((y) => (<button key={y} onClick={() => { setYear(y); setActiveFilter("year"); }}>{y}</button>))}
            </div>
          </div>
          <div>
            <p style={{ fontWeight: "bold", marginBottom: "4px" }}>月</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {monthOptions.map((m) => (<button key={m} onClick={() => { setMonthOption(m); setActiveFilter("month"); }}>{m === "all" ? "all" : `${m}月`}</button>))}
            </div>
          </div>
          <div>
            <p style={{ fontWeight: "bold", marginBottom: "4px" }}>並び替え</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <button onClick={() => setSortOption("date")}>日付順</button>
              <button onClick={() => setSortOption("rating")}>評価順</button>
              <button onClick={() => setSortOption("episode")}>話数順</button>
            </div>
          </div>
          <div>
            <p style={{ fontWeight: "bold", marginBottom: "4px" }}>検索</p>
            <input value={animeSearch} onChange={(e) => setAnimeSearch(e.target.value)} placeholder="Anime search" style={{ width: "100%" }}/>
          </div>
          <div>
          <p style={{ fontWeight: "bold", marginBottom: "4px" }}>登場人物</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            <button onClick={() => setCharacterFilter("")}>all</button>
            {characters.map((c) => (
              <button key={c.character_id} onClick={() => setCharacterFilter(String(c.character_id))}>
                {c.character_name}
              </button>
            ))}
          </div>
        </div>
          <button onClick={() => resetFilter()}>reset</button>
        </div>

  

        {/* Cards + Pagination */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {paginatedAnime.map((anime) => (
              <AnimeCard
                key={anime.anime_id}
                anime={anime}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", padding: "16px" }}>
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Previous</button>
            <span>{currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default AnimePage;