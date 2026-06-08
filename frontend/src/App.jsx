import { useEffect, useState } from "react";
import Layout from "./Layout"

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [content, setContent] = useState("ANIME_SHOW");
  const [title, setTitle] = useState("");
  const [storyNumber, setStoryNumber] = useState("");
  const [alphabet, setAlphabet] = useState("");
  const [positiveScore, setPositiveScore] = useState(0);
  const [negativeScore, setNegativeScore] = useState(0);
  const [opponent, setOpponent] = useState("");
  const [notes, setNotes] = useState("");
  const [scriptwriter, setScriptWriter] = useState("");
  const [animedirector, setAnimeDirector] = useState("");
  const [date, setDate] = useState("");
  const [character_appear, setCharacter_appear] = useState(true);
  const [watchStatus, setWatchStatus] = useState("WATCHED");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const characterappearOptions = ["all", "得点圏"]
  const [characterappearOption, setCharacterAppearOption] = useState("all");
  const filteredCharacterAppear = characterappearOption === "all" ? animeList : animeList.filter((anime) => anime.character_appear === true)

  const years = ["all", ...new Set(animeList.map((anime) => new Date(anime.anime_date).getFullYear()))]
  const [year, setYear] = useState("all");
  const filteredAnime = year === "all" ? filteredCharacterAppear : filteredCharacterAppear.filter((anime) => new Date(anime.anime_date).getFullYear() === year)

  const monthOptions = ["all", ...new Set(animeList.map((anime) => new Date(anime.anime_date).getMonth() + 1))]
  const [monthOption, setMonthOption] = useState("all");
  const filteredAnimemonth = monthOption === "all" ? filteredAnime : filteredAnime.filter((anime) => new Date(anime.anime_date).getMonth() + 1 === monthOption)

  const rokuyoOptions = ["all", "不明", "大安", "仏滅", "先負", "先勝", "赤口", "友引"]
  const [rokuyoOption, setRokuyoOption] = useState("all");
  const filteredAnimerokuyo = rokuyoOption === "all" ? filteredAnime : filteredAnime.filter((anime) => anime.rokuyo === rokuyoOption)

  const scriptwriterOptions = ["all", "不明", "黒住光", "ひるまちかこ", "中弘子", "晨原大輔", "阪口和久", "モラル", "川辺美奈子", "清水東", "翁妙子", "筧昌也", "待田堂子"]
  const [scriptwriterOption, setScriptWriterOption] = useState("all");
  const filteredAnimescript = scriptwriterOption === "all" ? filteredAnime : filteredAnime.filter((anime) => anime.script_writer === scriptwriterOption)


  const [activeFilter, setActiveFilter] = useState("year")

  const [editingAnime, setEditingAnime] = useState(null)

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
        alphabet: alphabet,
        positive_score: Number(positiveScore),
        negative_score: Number(negativeScore),
        opponent: opponent,
        notes: notes,
        script_writer: scriptwriter,
        animation_director: animedirector,
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
      setAlphabet("");
      setPositiveScore(0);
      setNegativeScore(0);
      setOpponent("");
      setNotes("");
      setScriptWriter("");
      setAnimeDirector("");
      setDate("");
      setCharacter_appear(true);
      setWatchStatus("WATCHED");

    } catch (err) {
      setError("Failed to add anime");
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(anime){
    console.log("anime object:", anime)
    setTitle(anime.title || "");
    setStoryNumber(anime.story_number);
    setAlphabet(anime.alphabet);
    setPositiveScore(anime.positive_score);
    setNegativeScore(anime.negative_score);
    setOpponent(anime.opponent || "");
    setNotes(anime.notes || "");
    setScriptWriter(anime.script_writer || "")
    setAnimeDirector(anime.animation_director || "");
    setDate(anime.anime_date);
    setCharacter_appear(anime.character_appear ?? true);
    setWatchStatus(anime.watch_status || "");
    setEditingAnime(anime)
  }

  
  async function handleUpdate() {
  try {
    setLoading(true);
    setError("");

    const payload = {
      content_type: content,
      title: title,
      story_number: Number(storyNumber),
      alphabet: alphabet,
      positive_score: Number(positiveScore),
      negative_score: Number(negativeScore),
      opponent: opponent,
      notes: notes,
      script_writer: scriptwriter,
      animation_director: animedirector,
      anime_date: date,
      character_appear: character_appear,
      watch_status: watchStatus,
    };

    console.log("payload:", payload)

    const putRes = await fetch(`http://127.0.0.1:8000/anime/${editingAnime.anime_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("status:", putRes.status)
    if (!putRes.ok) {
      const errorData = await putRes.json()
      console.log("error detail:", JSON.stringify(errorData.detail))
    }

    const res = await fetch("http://127.0.0.1:8000/anime");
    const data = await res.json();
    setAnimeList(data);

    setTitle("");
    setStoryNumber("");
    setAlphabet("");
    setPositiveScore(0);
    setNegativeScore(0);
    setOpponent("");
    setNotes("");
    setScriptWriter("");
    setAnimeDirector("");
    setDate("");
    setCharacter_appear(true);
    setWatchStatus("WATCHED");
    setEditingAnime(null);

  } catch (err) {
    setError("Failed to edit anime");
  } finally {
    setLoading(false);
  }
}

  return (
    <Layout>
      <div>
        <h1 style={{ color: "#1a1a1a" }}>Shin Chan Tracker</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <p>Saving...</p>}

        <div style={{ textAlign: 'right' }}>
          {characterappearOptions.map((c) => (<button key={String(c)} onClick={() => setCharacterAppearOption(c)}>{c === "all" ? "全て" : "得点圏"}
    </button>
  ))}
        </div>



<div style={{ textAlign: 'right' }}>
  {years.map((y) => (<button key={y} onClick={() => { setYear(y); setActiveFilter("year"); }}>{y}</button>))}
</div>
<div style={{ textAlign: 'right' }}>
  {rokuyoOptions.map((r) => (<button key={r} onClick={() => { setRokuyoOption(r); setActiveFilter("rokuyo"); }}>{r}</button>))}
</div>
<div style={{ textAlign: 'right' }}>
  {scriptwriterOptions.map((s) => (<button key={s} onClick={() => { setScriptWriterOption(s); setActiveFilter("script_writer"); }}>{s}</button>))}
</div>
<div style={{ textAlign: 'right' }}>
  {monthOptions.map((m) => (<button key={m} onClick={() => { setMonthOption(m); setActiveFilter("month"); }}>{m === "all" ? "all" : `${m}月`}</button>))}
</div>

<div style={{ display: "flex", flexWrap: "wrap", gap: "16px", margin: "16px 0", padding: "16px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ color: "black" }}>タイトル</label>
    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
  </div>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ color: "black" }}>コンテンツ</label>
    <select value={content} onChange={(e) => setContent(e.target.value)}>
      {["ANIME_SHOW","SHORT", "SPECIAL"].map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
    </select>
  </div>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ color: "black" }}>話数</label>
    <input type="number" value={storyNumber} onChange={(e) => setStoryNumber(e.target.value)} placeholder="Story number" style={{ width: "80px" }}/>
  </div>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ color: "black" }}>アルファベット</label>
    <select value={alphabet} onChange={(e) => setAlphabet(e.target.value)}>
      {["不明", "a","b", "c", "d", "e", "f"].map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
    </select>
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
    <label style={{ color: "black" }}>脚本</label>
    <select value={scriptwriter} onChange={(e) => setScriptWriter(e.target.value)}>
      {["不明", "黒住光", "ひるまちかこ", "中弘子", "晨原大輔", "阪口和久", "モラル", "川辺美奈子", "清水東", "翁妙子", "筧昌也", "待田堂子"].map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
    </select>
  </div>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ color: "black" }}>作画監督</label>
    <select value={animedirector} onChange={(e) => setAnimeDirector(e.target.value)}>
      {["不明", "木村優子", "間々田益子", "原勝徳", "門脇孝一", "入江康智", "針金屋英郎", "林静香", "大森孝敏", "樋口善法", "高倉佳彦", "橋本とよ子", "海老原尚樹", "尾鷲英俊"].map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
    </select>
  </div>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ color: "black" }}>日付</label>
    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
  </div>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ color: "black" }}>メモ</label>
    <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
  </div>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ color: "black" }}>得点圏</label>
    <input type="checkbox" checked={character_appear} onChange={(e) => setCharacter_appear(e.target.checked)} />
  </div>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ color: "black" }}>視聴状況</label>
    <input value={watchStatus} onChange={(e) => setWatchStatus(e.target.value)} placeholder="Watch status" />
  </div>
  <div style={{ display: "flex", alignItems: "flex-end" }}>
    <button onClick={editingAnime ? handleUpdate : handleAddAnime}>
      {editingAnime ? "Update" : "Add Anime"}
    </button>
  </div>
</div>

        {activeFilter === "year" && (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {filteredAnime.map((anime) => {
        const borderColor = anime.positive_score > anime.negative_score ? "blue" : anime.negative_score > anime.positive_score ? "#E70012" : "#00a051"
        const bgColor = anime.positive_score > anime.negative_score ? "#004583" : anime.negative_score > anime.positive_score ? "#BF0000" : "green"
          return (<div key={anime.anime_id} style={{ border: `2px solid ${borderColor}`, backgroundColor: bgColor, padding: "10px", color: "white",margin: "10px", borderRadius: "8px", width: "250px" }}>
            <h2>{anime.story_number} {anime.alphabet}</h2>
              <p>タイトル：{anime.title}</p>
              <p>日付：{anime.anime_date}</p>
              <p>脚本：{anime.script_writer}</p>
              <p>作画監督：{anime.animation_director}</p>
              <p>六曜：{anime.rokuyo}</p>
              <p>得点圏：{anime.character_appear ? "あり" : "なし"}</p>
              <p>Score: +{anime.positive_score} / -{anime.negative_score}</p>
              <button onClick={() => handleEdit(anime)}>Edit</button>
            </div>)
  })}
      </div>
  )}
            
        {activeFilter === "rokuyo" && (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {filteredAnimerokuyo.map((anime) => {
        const borderColor = anime.positive_score > anime.negative_score ? "blue" : anime.negative_score > anime.positive_score ? "#E70012" : "#00a051"
        const bgColor = anime.positive_score > anime.negative_score ? "#004583" : anime.negative_score > anime.positive_score ? "#BF0000" : "green"
          return (<div key={anime.anime_id} style={{ border: `2px solid ${borderColor}`, backgroundColor: bgColor, padding: "10px", color: "white",margin: "10px", borderRadius: "8px", width: "250px" }}>
            <h2>{anime.story_number} {anime.alphabet}</h2>
              <p>タイトル：{anime.title}</p>
              <p>日付：{anime.anime_date}</p>
              <p>脚本：{anime.script_writer}</p>
              <p>作画監督：{anime.animation_director}</p>
              <p>六曜：{anime.rokuyo}</p>
              <p>得点圏：{anime.character_appear ? "あり" : "なし"}</p>
              <p>Score: +{anime.positive_score} / -{anime.negative_score}</p>
              <button onClick={() => handleEdit(anime)}>Edit</button>
            </div>)
  })}
      </div>
  )}


        {activeFilter === "script_writer" && (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {filteredAnimescript.map((anime) => {
        const borderColor = anime.positive_score > anime.negative_score ? "blue" : anime.negative_score > anime.positive_score ? "#E70012" : "#00a051"
        const bgColor = anime.positive_score > anime.negative_score ? "#004583" : anime.negative_score > anime.positive_score ? "#BF0000" : "green"
          return (<div key={anime.anime_id} style={{ border: `2px solid ${borderColor}`, backgroundColor: bgColor, padding: "10px", color: "white",margin: "10px", borderRadius: "8px", width: "250px" }}>
            <h2>{anime.story_number} {anime.alphabet}</h2>
              <p>タイトル：{anime.title}</p>
              <p>日付：{anime.anime_date}</p>
              <p>脚本：{anime.script_writer}</p>
              <p>作画監督：{anime.animation_director}</p>
              <p>六曜：{anime.rokuyo}</p>
              <p>得点圏：{anime.character_appear ? "あり" : "なし"}</p>
              <p>Score: +{anime.positive_score} / -{anime.negative_score}</p>
              <button onClick={() => handleEdit(anime)}>Edit</button>
            </div>)
  })}
      </div>
  )}
        

        {activeFilter === "month" && (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {filteredAnimemonth.map((anime) => {
        const borderColor = anime.positive_score > anime.negative_score ? "blue" : anime.negative_score > anime.positive_score ? "#E70012" : "#00a051"
        const bgColor = anime.positive_score > anime.negative_score ? "#004583" : anime.negative_score > anime.positive_score ? "#BF0000" : "green"
          return (<div key={anime.anime_id} style={{ border: `2px solid ${borderColor}`, backgroundColor: bgColor, padding: "10px", color: "white",margin: "10px", borderRadius: "8px", width: "250px" }}>
            <h2>{anime.story_number} {anime.alphabet}</h2>
              <p>タイトル：{anime.title}</p>
              <p>日付：{anime.anime_date}</p>
              <p>脚本：{anime.script_writer}</p>
              <p>作画監督：{anime.animation_director}</p>
              <p>六曜：{anime.rokuyo}</p>
              <p>得点圏：{anime.character_appear ? "あり" : "なし"}</p>
              <p>Score: +{anime.positive_score} / -{anime.negative_score}</p>
              <button onClick={() => handleEdit(anime)}>Edit</button>
            </div>)
  })}
      </div>
  )}
      </div>
    </Layout>
  );
}

export default App;