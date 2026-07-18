import { useEffect, useState } from "react";
import Layout from "./Layout"
import { useParams } from "react-router-dom";
import { fetchWithAuth } from "./api";

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
  const [animeName, setAnimeName] = useState(urlAnimeName);
  const [animeSearch, setAnimeSearch] = useState("");
  const [sortOption, setSortOption] = useState("");

  const years = ["all", ...new Set(animeList.map((anime) => new Date(anime.anime_date).getFullYear()))]
  const [year, setYear] = useState("all");

  const filteredByAnimeName = animeList.filter(a => a.anime_name === urlAnimeName)
  

const filteredBySearch = animeSearch === "" 
  ? filteredByAnimeName 
  : filteredByAnimeName.filter(a => a.title.includes(animeSearch))

  const filteredAnime = year === "all" 
  ? filteredBySearch
  : filteredBySearch.filter(a => new Date(a.anime_date).getFullYear() === year)

  const monthOptions = ["all", ...new Set(animeList.map((anime) => new Date(anime.anime_date).getMonth() + 1))].sort((a, b) => {
  if (a === "all") return -1;
  return a - b;
})
  const [monthOption, setMonthOption] = useState("all");
  const filteredAnimemonth = monthOption === "all" ? filteredAnime : filteredAnime.filter((anime) => new Date(anime.anime_date).getMonth() + 1 === monthOption)

  const [activeFilter, setActiveFilter] = useState("year")

  const [editingAnime, setEditingAnime] = useState(null)

  const sortedAnime = sortOption === "date" ? [...filteredAnime].sort((a, b) => new Date(a.anime_date) - new Date(b.anime_date)) : 
  sortOption === "rating" ? [...filteredAnime].sort((a, b) => b.rating - a.rating) :
  sortOption === "episode" ? [...filteredAnime].sort((a, b) => a.episode_number - b.episode_number) : filteredAnime

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20
  const paginatedAnime = sortedAnime.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const totalPages = Math.ceil(sortedAnime.length / pageSize)



  useEffect(() => {
  
  fetchWithAuth("http://127.0.0.1:8000/anime")
    .then((res) => res.json())
    .then((data) => setAnimeList(data));
}, []);

  async function handleAddAnime() {
    try {
      setLoading(true);
      setError("");

      const payload = {
        anime_name: animeName,
        title: title,
        alphabet: alphabets,
        episode_number: Number(episodeNumber),
        notes: notes,
        script_writer: scriptwriter,
        anime_director: animedirector,
        anime_date: date,
        rating: Number(rating),
        content_type: content,
        watch_status: watchStatus,
      };

      const token = localStorage.getItem("token");


  await fetchWithAuth("http://127.0.0.1:8000/anime", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});


// POST already has token, fix the refresh:

const res = await fetchWithAuth("http://127.0.0.1:8000/anime");
      const data = await res.json();
      setAnimeList(data);

      setAnimeName(urlAnimeName)
      setTitle("");
      setEpisodeNumber("");
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

  async function handleEdit(anime){
    console.log("anime object:", anime)
    setAnimeName(urlAnimeName);
    setTitle(anime.title || "");
    setEpisodeNumber(anime.episode_number);
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
      notes: notes,
      script_writer: scriptwriter,
      anime_director: animedirector,
      anime_date: date,
      rating: Number(rating),
      content_type: content,
      watch_status: watchStatus,
    };

    console.log("payload:", payload)

    const token = localStorage.getItem("token");

const putRes = await fetchWithAuth(`http://127.0.0.1:8000/anime/${editingAnime.anime_id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const res = await fetchWithAuth("http://127.0.0.1:8000/anime");
    const data = await res.json();
    setAnimeList(data);

    setAnimeName(urlAnimeName)
    setTitle("");
    setEpisodeNumber("");
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

  async function handleDelete(anime_id){
    const confirmed = window.confirm("本当に削除しますか?")
    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");
      
      

await fetchWithAuth(`http://127.0.0.1:8000/anime/${anime_id}`, {
  method: "DELETE",
});
const res = await fetchWithAuth("http://127.0.0.1:8000/anime");
      const data = await res.json();
      setAnimeList(data);

    } catch (err) {
      setError("Failed to delete anime");
    } finally {
      setLoading(false);
    }
  }

    return (
  <Layout>
    {/* Form at top */}
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", padding: "16px", backgroundColor: "#f5f5f5", borderRadius: "8px", marginBottom: "16px" }}>
      <h1 style={{ color: "#1a1a1a", width: "100%" }}>{urlAnimeName}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Saving...</p>}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>タイトル</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>コンテンツ</label>
        <select value={content} onChange={(e) => setContent(e.target.value)}>
          {["ANIME_SHOW","SHORT", "SPECIAL"].map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
        </select>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Alphabet</label>
        <input value={alphabets} onChange={(e) => setAlphabet(e.target.value)} placeholder="Alphabet" style={{ width: "80px" }}/>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>話数</label>
        <input type="number" value={episodeNumber} onChange={(e) => setEpisodeNumber(e.target.value)} placeholder="Episode number" style={{ width: "80px" }}/>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>脚本</label>
        <input value={scriptwriter} onChange={(e) => setScriptWriter(e.target.value)} placeholder="Script writer" />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>作画監督</label>
        <input value={animedirector} onChange={(e) => setAnimeDirector(e.target.value)} placeholder="Anime director" />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>日付</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>メモ</label>
        <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>評価</label>
        <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Ratings" style={{ width: "80px" }}/>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>視聴状況</label>
        <select value={watchStatus} onChange={(e) => setWatchStatus(e.target.value)}>
          {["WATCHED", "WATCHING", "PLAN TO WATCH", "DROPPED"].map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
        </select>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <button onClick={editingAnime ? handleUpdate : handleAddAnime}>
          {editingAnime ? "Update" : "Add Anime"}
        </button>
      </div>
    </div>

    {/* Sidebar + Cards */}
    <div style={{ display: "flex", gap: "16px" }}>

      {/* Sidebar */}
      <div style={{ width: "180px", display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#f5f5f5", }}>
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
      </div>

      {/* Cards + Pagination */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {paginatedAnime.map((anime) => {
            const bgColor = anime.watch_status === "WATCHED" ? "#004583" : "#888888"
            const borderColor = bgColor
            return (
              <div key={anime.anime_id} style={{ border: `2px solid ${borderColor}`, backgroundColor: bgColor, padding: "10px", color: "white", margin: "10px", borderRadius: "8px", width: "250px" }}>
                <h2>{anime.content_type === "ANIME_SHOW" ? `${anime.episode_number} ${anime.alphabet}` : `${anime.content_type} ${anime.episode_number} ${anime.alphabet}`}</h2>
                <p>タイトル：{anime.title}</p>
                <p>日付：{anime.anime_date}</p>
                <p>脚本：{anime.script_writer}</p>
                <p>作画監督：{anime.anime_director}</p>
                <p>評価：{anime.rating}</p>
                <p>視聴状況：{anime.watch_status}</p>
                <button onClick={() => handleEdit(anime)}>Edit</button>
                <button onClick={() => handleDelete(anime.anime_id)}>Delete</button>
              </div>
            )
          })}
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

}export default AnimePage;