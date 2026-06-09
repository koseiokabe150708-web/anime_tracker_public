import { useEffect, useState } from "react";
import Layout from "./Layout"

function Movie() {
  const [movieList, setMovieList] = useState([]);
  const [title, setTitle] = useState("");
  const [movienumber, setMovieNumber] = useState(0);
  const [positiveScore, setPositiveScore] = useState(0);
  const [negativeScore, setNegativeScore] = useState(0);
  const [opponent, setOpponent] = useState("");
  const [date, setDate] = useState("");
  const [scriptwriter, setScriptWriter] = useState("");
  const [movie_director, setMovieDirector] = useState("");
  

  useEffect(() => {
    fetch("http://127.0.0.1:8000/movie")
      .then((res) => res.json())
      .then((data) => setMovieList(data));
  }, []);

  return (
    <Layout>
      <div>
        <h1 style={{ color: "#1a1a1a" }}>Movie</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <p>Saving...</p>}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", margin: "16px 0", padding: "16px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ color: "black" }}>タイトル</label>
    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
  </div>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ color: "black" }}>映画数</label>
    <input type="number" value={movienumber} onChange={(e) => setMovieNumber(e.target.value)} placeholder="Story number" style={{ width: "80px" }}/>
  </div>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ color: "black" }}>得点</label>
    <input type="number" value={positiveScore} onChange={(e) => setPositiveScore(e.target.value)} placeholder="Positive score" style={{ width: "60px" }}/>
  </div>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ color: "black" }}>失点</label>
    <input type="number" value={negativeScore} onChange={(e) => setNegativeScore(e.target.value)} placeholder="Negative score" style={{ width: "60px" }}/>
  </div>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ color: "black" }}>対戦相手</label>
    <select value={opponent} onChange={(e) => setOpponent(e.target.value)}>
      {["不明","水道橋", "名古屋", "兵庫", "外苑前", "広島"].map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
    </select>
  </div>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ color: "black" }}>日付</label>
    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
  </div>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ color: "black" }}>脚本</label>
    <input value={scriptwriter} onChange={(e) => setScriptWriter(e.target.value)} />
  </div>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ color: "black" }}>監督</label>
    <input value={movie_director} onChange={(e) => setMovieDirector(e.target.value)} />
  </div>
  
  <div style={{ display: "flex", alignItems: "flex-end" }}>
    <button onClick={editingAnime ? handleUpdate : handleAddAnime}>
      {editingAnime ? "Update" : "Add Anime"}
    </button>
  </div>
</div>

      </div>
    </Layout>
      );
}
export default Movie;