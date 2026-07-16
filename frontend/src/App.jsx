import { useEffect, useState } from "react";
import Layout from "./Layout"
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "./api";

function App() {

  const [animeList, setAnimeList] = useState([]);
  const animeNames = [...new Set(animeList.map((anime) => anime.anime_name).filter(Boolean))]
  const navigate = useNavigate();
  const [newAnimeName, setNewAnimeName] = useState("");

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }
  fetchWithAuth("http://127.0.0.1:8000/anime")
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) setAnimeList(data);
    });
}, []);

  return (
  <Layout>
    <h1>Anime Recorder</h1>

    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <label style={{ color: "black" }}>アニメ名</label>
        <input value={newAnimeName} onChange={(e) => setNewAnimeName(e.target.value)} placeholder="Anime_name" style={{ width: "80px" }}/>
      </div>
    
    <button onClick={() => {
    if (newAnimeName.trim()) {
      navigate(`/anime/${newAnimeName}`);
      setNewAnimeName("");
    }
  }}>Add</button>


    <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "24px" }}>
      {animeNames.map((name) => (
        <button key={name} onClick={() => navigate(`/anime/${name}`)} style={{ padding: "20px", fontSize: "18px", borderRadius: "8px" }}>
          {name}
        </button>
      ))}
    </div>
  </Layout>
)
}

export default App;