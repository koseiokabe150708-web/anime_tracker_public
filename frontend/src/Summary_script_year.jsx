import { useEffect, useState } from "react";
import Layout from "./Layout"

function Summary_script_year() {
  const [animeList, setAnimeList] = useState([]);
  
  const years = [...new Set(animeList.map((anime) => new Date(anime.anime_date).getFullYear()))]
  const scriptwriterOptions = ["不明", "黒住光", "ひるまちかこ", "中弘子", "晨原大輔", "阪口和久", "モラル", "川辺美奈子", "清水東", "翁妙子", "筧昌也"]

  useEffect(() => {
    fetch("http://127.0.0.1:8000/anime")
      .then((res) => res.json())
      .then((data) => setAnimeList(data));
  }, []);

  return (
    <Layout>
      <div>
        <h1>Script Writer by Year</h1>
        {years.map((y) => (
          <div key={y}>
              <h2>{y}</h2>
              {scriptwriterOptions.map((s) => {
                  const count = animeList.filter((anime) => new Date(anime.anime_date).getFullYear() === y && anime.script_writer === s)
                  if (count.length === 0) return null
                  return <p key={s}>{s}：{count.length}話</p>
      })}
    </div>
  ))}
      </div>
    </Layout>
      );
}
export default Summary_script_year;