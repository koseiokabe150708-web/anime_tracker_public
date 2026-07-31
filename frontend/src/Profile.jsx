import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout"
import { fetchWithAuth, API_BASE_URL } from "./api";

const STATUS_META = {
  watched: { label: "Watched", color: "#2e7d32", bg: "#e8f5e9" },
  watching: { label: "Watching", color: "#1565c0", bg: "#e3f2fd" },
  planToWatch: { label: "Plan to watch", color: "#6a1b9a", bg: "#f3e5f5" },
  dropped: { label: "Dropped", color: "#c62828", bg: "#ffebee" },
};

const ANIME_SORT_OPTIONS = [
  { key: "rating", label: "Rating" },
  { key: "name", label: "A-Z" },
  { key: "episodes", label: "Most episodes" },
];

const MOVIE_SORT_OPTIONS = [
  { key: "rating", label: "Rating" },
  { key: "name", label: "A-Z" },
  { key: "year", label: "Newest" },
];

function StatPill({ statusKey, count }) {
  const meta = STATUS_META[statusKey];
  if (count === 0) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "999px", backgroundColor: meta.bg, color: meta.color, fontSize: "13px", fontWeight: 600 }}>
      {meta.label} {count}
    </span>
  );
}

function OverviewStat({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <span style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a" }}>{value}</span>
      <span style={{ fontSize: "13px", color: "#666" }}>{label}</span>
    </div>
  );
}

function TabBar({ activeTab, onChange }) {
  const tabs = [
    { key: "anime", label: "Anime" },
    { key: "movie", label: "Movie" },
  ];
  return (
    <div style={{ display: "flex", gap: "4px", marginBottom: "20px", borderBottom: "2px solid #eee" }}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          style={{
            padding: "10px 20px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: 600,
            color: activeTab === tab.key ? "#1565c0" : "#888",
            borderBottom: activeTab === tab.key ? "2px solid #1565c0" : "2px solid transparent",
            marginBottom: "-2px",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function Profile(){
    const [activeTab, setActiveTab] = useState("anime");

    const [animeList, setAnimeList] = useState([]);
    const [animeSearch, setAnimeSearch] = useState("");
    const [animeSortOption, setAnimeSortOption] = useState("rating");

    const [movieSearch, setMovieSearch] = useState("");
    const [movieSortOption, setMovieSortOption] = useState("rating");

    useEffect(() => {
        fetchWithAuth(`${API_BASE_URL}/anime`)
            .then((res) => res.json())
            .then((data) => setAnimeList(data));
    }, []);


    // ---- anime rows (grouped by series) ----
    const onlyAnimeList = animeList.filter(a => a.content_type !== "MOVIE")
    const animeNames = [...new Set(onlyAnimeList.map(a => a.anime_name).filter(Boolean))]

    const animeRows = animeNames.map((name) => {
        const entries = onlyAnimeList.filter(a => a.anime_name === name)
        const average_rating = (entries.reduce((total, anime) => total + anime.rating, 0) / entries.length).toFixed(1)
        const watched = entries.filter(a => a.watch_status === "WATCHED").length
        const watching = entries.filter(a => a.watch_status === "WATCHING").length
        const planToWatch = entries.filter(a => a.watch_status === "PLAN TO WATCH").length
        const dropped = entries.filter(a => a.watch_status === "DROPPED").length
        return { name, average_rating, watched, watching, planToWatch, dropped, total: entries.length }
    })

    const totalAnimeTracked = animeNames.length
    const totalAnimeEpisodes = onlyAnimeList.length
    const totalAnimeWatched = onlyAnimeList.filter(a => a.watch_status === "WATCHED").length
    const animeRatedEntries = onlyAnimeList.filter(a => a.rating)
    const overallAnimeRating = animeRatedEntries.length
        ? (animeRatedEntries.reduce((total, a) => total + a.rating, 0) / animeRatedEntries.length).toFixed(1)
        : "—"

    const searchedAnimeRows = animeSearch.trim() === ""
        ? animeRows
        : animeRows.filter(row => row.name.toLowerCase().includes(animeSearch.trim().toLowerCase()))

    const sortedAnimeRows = [...searchedAnimeRows].sort((a, b) => {
        if (animeSortOption === "rating") return b.average_rating - a.average_rating
        if (animeSortOption === "episodes") return b.total - a.total
        if (animeSortOption === "name") return a.name.localeCompare(b.name)
        return 0
    })

    // ---- movie rows (flat, one card per movie) ----
    const movieList = animeList.filter(a => a.content_type === "MOVIE")
    const totalMoviesTracked = movieList.length
    const totalMoviesWatched = movieList.filter(m => m.watch_status === "WATCHED").length
    const movieRatedEntries = movieList.filter(m => m.rating)
    const overallMovieRating = movieRatedEntries.length
        ? (movieRatedEntries.reduce((total, m) => total + m.rating, 0) / movieRatedEntries.length).toFixed(1)
        : "—"

    const searchedMovies = movieSearch.trim() === ""
        ? movieList
        : movieList.filter(m => (m.title || "").toLowerCase().includes(movieSearch.trim().toLowerCase()))

    const sortedMovies = [...searchedMovies].sort((a, b) => {
        if (movieSortOption === "rating") return (b.rating || 0) - (a.rating || 0)
        if (movieSortOption === "year") return new Date(b.anime_date) - new Date(a.anime_date)
        if (movieSortOption === "name") return (a.title || "").localeCompare(b.title || "")
        return 0
    })

    return(
        <Layout>
            <div style={{ padding: 24, maxWidth: "900px", margin: "0 auto" }}>
                <h1 style={{ color: "#1a1a1a", marginBottom: "20px" }}>Profile</h1>

                <TabBar activeTab={activeTab} onChange={setActiveTab} />

                {activeTab === "anime" && (
                    <>
                        {/* Overview banner */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", padding: "20px 24px", borderRadius: "10px", backgroundColor: "#f5f5f5", marginBottom: "24px" }}>
                            <OverviewStat label="Anime tracked" value={totalAnimeTracked} />
                            <OverviewStat label="Episodes logged" value={totalAnimeEpisodes} />
                            <OverviewStat label="Episodes watched" value={totalAnimeWatched} />
                            <OverviewStat label="Overall avg rating" value={overallAnimeRating} />
                        </div>

                        {/* Controls */}
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                            <input
                                value={animeSearch}
                                onChange={(e) => setAnimeSearch(e.target.value)}
                                placeholder="Search anime"
                                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", minWidth: "200px" }}
                            />
                            <div style={{ display: "flex", gap: "8px" }}>
                                {ANIME_SORT_OPTIONS.map(opt => (
                                    <button
                                        key={opt.key}
                                        onClick={() => setAnimeSortOption(opt.key)}
                                        style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #ccc", backgroundColor: animeSortOption === opt.key ? "#1565c0" : "#fff", color: animeSortOption === opt.key ? "#fff" : "#333", cursor: "pointer" }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {sortedAnimeRows.length === 0 && (
                            <p style={{ color: "#666" }}>No anime found.</p>
                        )}

                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {sortedAnimeRows.map((row) => (
                                <Link key={row.name} to={`/anime/${encodeURIComponent(row.name)}`} style={{ textDecoration: "none" }}>
                                    <div
                                        style={{ border: "1px solid #e0e0e0", borderLeft: "5px solid #1565c0", padding: "20px 24px", borderRadius: "10px", backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", cursor: "pointer", transition: "box-shadow 0.15s ease" }}
                                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)"}
                                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
                                            <h2 style={{ color: "#1a1a1a", fontSize: "20px", fontWeight: 700, margin: 0 }}>{row.name}</h2>
                                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                <span style={{ color: "#FFD700", fontSize: "18px" }}>★</span>
                                                <span style={{ color: "#1a1a1a", fontWeight: 700, fontSize: "16px" }}>{row.average_rating}</span>
                                                <span style={{ color: "#888", fontSize: "13px" }}>avg</span>
                                            </div>
                                        </div>
                                        <p style={{ color: "#666", fontSize: "14px", margin: "6px 0 14px" }}>
                                            {row.total} episode{row.total === 1 ? "" : "s"} tracked
                                        </p>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                            <StatPill statusKey="watched" count={row.watched} />
                                            <StatPill statusKey="watching" count={row.watching} />
                                            <StatPill statusKey="planToWatch" count={row.planToWatch} />
                                            <StatPill statusKey="dropped" count={row.dropped} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === "movie" && (
                    <>
                        {/* Overview banner */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", padding: "20px 24px", borderRadius: "10px", backgroundColor: "#f5f5f5", marginBottom: "24px" }}>
                            <OverviewStat label="Movies tracked" value={totalMoviesTracked} />
                            <OverviewStat label="Movies watched" value={totalMoviesWatched} />
                            <OverviewStat label="Overall avg rating" value={overallMovieRating} />
                        </div>

                        {/* Controls */}
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                            <input
                                value={movieSearch}
                                onChange={(e) => setMovieSearch(e.target.value)}
                                placeholder="Search movies"
                                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", minWidth: "200px" }}
                            />
                            <div style={{ display: "flex", gap: "8px" }}>
                                {MOVIE_SORT_OPTIONS.map(opt => (
                                    <button
                                        key={opt.key}
                                        onClick={() => setMovieSortOption(opt.key)}
                                        style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #ccc", backgroundColor: movieSortOption === opt.key ? "#1565c0" : "#fff", color: movieSortOption === opt.key ? "#fff" : "#333", cursor: "pointer" }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {sortedMovies.length === 0 && (
                            <p style={{ color: "#666" }}>No movies found.</p>
                        )}

                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {sortedMovies.map((movie) => (
                                <div
                                    key={movie.anime_id}
                                    style={{ border: "1px solid #e0e0e0", borderLeft: "5px solid #c62828", padding: "20px 24px", borderRadius: "10px", backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
                                        <h2 style={{ color: "#1a1a1a", fontSize: "20px", fontWeight: 700, margin: 0 }}>
                                            {movie.title} {movie.anime_date && <span style={{ color: "#888", fontWeight: 400, fontSize: "16px" }}>({new Date(movie.anime_date).getFullYear()})</span>}
                                        </h2>
                                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                            <span style={{ color: "#FFD700", fontSize: "18px" }}>★</span>
                                            <span style={{ color: "#1a1a1a", fontWeight: 700, fontSize: "16px" }}>{movie.rating ?? "—"}</span>
                                        </div>
                                    </div>
                                    <p style={{ color: "#666", fontSize: "14px", margin: "6px 0 14px" }}>
                                        {[movie.anime_director, movie.script_writer, movie.episode_number && `#${movie.episode_number}`].filter(Boolean).join(" · ")}
                                    </p>
                                    {movie.notes && (
                                        <p style={{ color: "#888", fontSize: "13px", margin: "0 0 10px", fontStyle: "italic" }}>
                                            {movie.notes}
                                        </p>
                                    )}
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                        <StatPill statusKey="watched" count={movie.watch_status === "WATCHED" ? 1 : 0} />
                                        <StatPill statusKey="watching" count={movie.watch_status === "WATCHING" ? 1 : 0} />
                                        <StatPill statusKey="planToWatch" count={movie.watch_status === "PLAN TO WATCH" ? 1 : 0} />
                                        <StatPill statusKey="dropped" count={movie.watch_status === "DROPPED" ? 1 : 0} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    )

}export default Profile;