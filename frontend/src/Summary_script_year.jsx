import { useEffect, useState } from "react";
import Layout from "./Layout"

function Summary_script_year() {
  const [animeList, setAnimeList] = useState([]);

  const scriptwriterOptions = ["不明", "黒住光", "ひるまちかこ", "中弘子", "晨原大輔", "阪口和久", "モラル", "川辺美奈子", "清水東", "翁妙子", "筧昌也"]
  const characterappearOptions = ["all", "得点圏"]
  
  const years = [...new Set(animeList.map((anime) => new Date(anime.anime_date).getFullYear()))]
  const [activeFilter, setActiveFilter] = useState("script_writer")
  const [characterappearOption, setCharacterAppearOption] = useState("all");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/anime")
      .then((res) => res.json())
      .then((data) => setAnimeList(data));
  }, []);

  return (
    <Layout>
      <div>
        <h1>Script Writer by Year</h1>
        <div style={{ textAlign: 'right' }}>
          {characterappearOptions.map((c) => (<button key={String(c)} onClick={() => setCharacterAppearOption(c)}>{c === "all" ? "全て" : "得点圏"}
    </button>
  ))}
        </div>

        <div style={{ textAlign: 'right' }}>
  {scriptwriterOptions.map((s) => (<button key={s} onClick={() => { setScriptWriterOption(s); setActiveFilter("script_writer"); }}>{s}</button>))}
</div>
      </div>
    </Layout>
      );
}
export default Summary_script_year;