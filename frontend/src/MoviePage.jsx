import { useEffect, useState } from "react";
import Layout from "./Layout"
import { useParams } from "react-router-dom";
import { fetchWithAuth, API_BASE_URL } from "./api";
import MovieCard from "./MovieCard";

function MoviePage() {
  const { animeName: urlAnimeName } = useParams();
  const [animeList, setAnimeList] = useState([]);
  const [title, setTitle] = useState("");
  const [movieName, setMovieName] = useState("");
  const [movieNumber, setMovieNumber] = useState("");
  const [runtime, setRuntime] = useState("");
  const [notes, setNotes] = useState("");
  const [scriptwriter, setScriptWriter] = useState("");
  const [moviedirector, setMovieDirector] = useState("");
  const [date, setDate] = useState("");
  const [watchStatus, setWatchStatus] = useState("WATCHED");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [movieSearch, setMovieSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [year, setYear] = useState("all");
  const [monthOption, setMonthOption] = useState("all");
  const [activeFilter, setActiveFilter] = useState("year")
  const [editingMovie, setEditingMovie] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)


  const movieList = animeList.filter(a => a.content_type === "MOVIE" && a.anime_name === urlAnimeName)

  const years = ["all", ...new Set(movieList.map((movie) => new Date(movie.anime_date).getFullYear()))]

  const filteredBySearch = movieSearch === ""
    ? movieList
    : movieList.filter(m =>
        m.title.includes(movieSearch) || (m.anime_name || "").includes(movieSearch)
      )

  const filteredMovie = year === "all"
    ? filteredBySearch
    : filteredBySearch.filter(m => new Date(m.anime_date).getFullYear() === year)

  const monthOptions = ["all", ...new Set(movieList.map((movie) => new Date(movie.anime_date).getMonth() + 1))].sort((a, b) => {
    if (a === "all") return -1;
    if (b === "all") return 1;
    return a - b;
  })

  const filteredMoviemonth = monthOption === "all"
    ? filteredMovie
    : filteredMovie.filter((movie) => new Date(movie.anime_date).getMonth() + 1 === monthOption)

  const sortedMovie = sortOption === "date"
    ? [...filteredMoviemonth].sort((a, b) => new Date(a.anime_date) - new Date(b.anime_date))
    : sortOption === "rating"
    ? [...filteredMoviemonth].sort((a, b) => b.rating - a.rating)
    : sortOption === "number"
    ? [...filteredMoviemonth].sort((a, b) => a.episode_number - b.episode_number)
    : filteredMoviemonth;

  const pageSize = 20
  const paginatedMovie = sortedMovie.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const totalPages = Math.ceil(sortedMovie.length / pageSize)

  useEffect(() => {
    fetchWithAuth(`${API_BASE_URL}/anime`)
      .then((res) => res.json())
      .then((data) => setAnimeList(data));
  }, []);

  useEffect(() => {
    setMovieName(urlAnimeName);
  }, [urlAnimeName]);

  async function handleAddMovie() {
    if (!title.trim()) {
      setError("タイトルを入力してください");
      return;
    }
    if (!movieNumber || movieNumber <= 0) {
      setError("番号を入力してください")
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
        anime_name: movieName,
        title: title,
        episode_number: Number(movieNumber),
        runtime: Number(runtime),
        notes: notes,
        script_writer: scriptwriter,
        anime_director: moviedirector,
        anime_date: date,
        rating: Number(rating),
        content_type: "MOVIE",
        watch_status: watchStatus,
      };

      await fetchWithAuth(`${API_BASE_URL}/anime`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const res = await fetchWithAuth(`${API_BASE_URL}/anime`);
      const data = await res.json();
      setAnimeList(data);

      setTitle("");
      setMovieName("");
      setMovieNumber("");
      setRuntime("");
      setNotes("");
      setScriptWriter("");
      setMovieDirector("");
      setDate("");
      setRating(0);
      setWatchStatus("WATCHED");

    } catch (err) {
      setError("Failed to add movie");
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(movie) {
    setTitle(movie.title || "");
    setMovieName(urlAnimeName);
    setMovieNumber(movie.episode_number);
    setRuntime(movie.runtime || "");
    setNotes(movie.notes || "");
    setScriptWriter(movie.script_writer || "")
    setMovieDirector(movie.anime_director || "");
    setDate(movie.anime_date);
    setWatchStatus(movie.watch_status || "");
    setRating(movie.rating || 0);
    setEditingMovie(movie)
  }

  async function handleUpdate() {
    try {
      setLoading(true);
      setError("");

      const payload = {
        anime_name: movieName,
        title: title,
        episode_number: Number(movieNumber),
        runtime: Number(runtime),
        notes: notes,
        script_writer: scriptwriter,
        anime_director: moviedirector,
        anime_date: date,
        rating: Number(rating),
        content_type: "MOVIE",
        watch_status: watchStatus,
      };

      await fetchWithAuth(`${API_BASE_URL}/anime/${editingMovie.anime_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const res = await fetchWithAuth(`${API_BASE_URL}/anime`);
      const data = await res.json();
      setAnimeList(data);

      setTitle("");
      setMovieName("");
      setMovieNumber("");
      setRuntime("");
      setNotes("");
      setScriptWriter("");
      setMovieDirector("");
      setDate("");
      setWatchStatus("WATCHED");
      setRating(0);
      setEditingMovie(null);

    } catch (err) {
      setError("Failed to edit movie");
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
      const res = await fetchWithAuth(`${API_BASE_URL}/anime`);
      const data = await res.json();
      setAnimeList(data);
    } catch (err) {
      setError("Failed to delete movie");
    } finally {
      setLoading(false);
    }
  }

  function resetFilter() {
    setYear("all");
    setMonthOption("all");
    setSortOption("");
    setMovieSearch("");
    setCurrentPage(1);
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
          {showForm ? "✕ Close" : "+ Add Movie"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {showForm && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Movie number</label>
              <input type="number" value={movieNumber} onChange={(e) => setMovieNumber(e.target.value)} style={{ width: "80px" }}/>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Runtime (min)</label>
              <input type="number" value={runtime} onChange={(e) => setRuntime(e.target.value)} style={{ width: "80px" }}/>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Script writer</label>
              <input value={scriptwriter} onChange={(e) => setScriptWriter(e.target.value)} placeholder="Script writer" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Director</label>
              <input value={moviedirector} onChange={(e) => setMovieDirector(e.target.value)} placeholder="Director" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Notes</label>
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
              <button onClick={editingMovie ? handleUpdate : handleAddMovie}>
                {editingMovie ? "Update" : "Add Movie"}
              </button>
            </div>
          </div>
        )}
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
              <button onClick={() => setSortOption("number")}>番号順</button>
            </div>
          </div>
          <div>
            <p style={{ fontWeight: "bold", marginBottom: "4px" }}>検索</p>
            <input value={movieSearch} onChange={(e) => setMovieSearch(e.target.value)} placeholder="Title or franchise" style={{ width: "100%" }}/>
          </div>
          <button onClick={() => resetFilter()}>reset</button>
        </div>

        {/* Cards + Pagination */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {paginatedMovie.map((movie) => (
              <MovieCard
                key={movie.anime_id}
                movie={movie}
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

export default MoviePage;