import { useEffect, useState } from "react";
import Layout from "./Layout"
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, API_BASE_URL } from "./api";

function MovieHome() {

  const [animeList, setAnimeList] = useState([]);
  const navigate = useNavigate();
  const [newMovieName, setNewMovieName] = useState("");

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }
  fetchWithAuth(`${API_BASE_URL}/anime`)
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) setAnimeList(data);
    });
}, []);

const movieNames = [...new Set(animeList.filter(a => a.content_type == "MOVIE").map((movie) => movie.anime_name).filter(Boolean))]

  return (
  <Layout>
    <h1>Movies</h1>

    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <label style={{ color: "black" }}>Movie names</label>
        <input value={newMovieName} onChange={(e) => setNewMovieName(e.target.value)} placeholder="Movie_name" style={{ width: "80px" }}/>
      </div>
    
    <button onClick={() => {
    if (newMovieName.trim()) {
      navigate(`/movie/${newMovieName}`);
      setNewMovieName("");
    }
  }}>Add</button>


    <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "24px" }}>
      {movieNames.map((name) => (
        <button key={name} onClick={() => navigate(`/movie/${name}`)} style={{ padding: "20px", fontSize: "18px", borderRadius: "8px" }}>
          {name}
        </button>
      ))}
    </div>
  </Layout>
)
}

export default MovieHome;