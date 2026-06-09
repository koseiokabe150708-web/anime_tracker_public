import { useEffect, useState } from "react";
import Layout from "./Layout"
import { DataGrid } from "@mui/x-data-grid";

function Summary_script_year() {
  const [animeList, setAnimeList] = useState([]);
  
  const years = [...new Set(animeList.map((anime) => new Date(anime.anime_date).getFullYear()))]
  const [activeFilter, setActiveFilter] = useState("script_writer")

  const characterappearOptions = ["all", "得点圏"]
  const [characterappearOption, setCharacterAppearOption] = useState("all");
  const filteredCharacterAppear = characterappearOption === "all" ? animeList : animeList.filter((anime) => anime.character_appear === true)

  const scriptwriterOptions = ["黒住光", "ひるまちかこ", "中弘子", "晨原大輔", "阪口和久", "モラル", "川辺美奈子", "清水東", "翁妙子", "筧昌也"]
  const [scriptwriterOption, setScriptWriterOption] = useState("黒住光");
  const filteredScriptWriter = filteredCharacterAppear.filter((anime) => anime.script_writer === scriptwriterOption)

  useEffect(() => {
    fetch("http://127.0.0.1:8000/anime")
      .then((res) => res.json())
      .then((data) => setAnimeList(data));
  }, []);

  const columns = [
    { field: "year", headerName: "ywar", width: 120 },
    { field: "episodes", headerName: "Episodes", width: 120 },
    { field: "episodes_character", headerName: "Episodes character", width: 120 },
    { field: "positive", headerName: "Positive", width: 120 },
    { field: "negative", headerName: "Negative", width: 120 },
    { field: "total", headerName: "Total", width: 120 },
    { field: "positive_per_nine_episodes", headerName: "Positive per nine episodes", width: 120 },
    { field: "negative_per_nine_episodes", headerName: "Negative per nine episodes", width: 120 },
  ];
  
    const rows = years.map((s) => {
        const entries = filteredScriptWriter.filter((anime) => new Date(anime.anime_date).getFullYear() === s)
        const pos = entries.reduce((total, anime) => total + anime.positive_score, 0)
        const neg = entries.reduce((total, anime) => total + anime.negative_score, 0)
        const character = filteredScriptWriter.filter((anime) => new Date(anime.anime_date).getFullYear() === s && anime.character_appear === true)
        return { id: s, year: s, episodes: entries.length, episodes_character: character.length, positive: pos, negative: neg, total: pos - neg, 
            positive_per_nine_episodes: (pos *9/(entries.length)).toFixed(2), 
            negative_per_nine_episodes: (neg *9/(entries.length)).toFixed(2)}
})

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

      <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { pageSize: 100 } },
                }}
                sx={{
                border: "none",
                "& .MuiDataGrid-filler": { backgroundColor: "#4E342E !important" },
                "& .MuiDataGrid-columnHeader": { backgroundColor: "#4E342E !important" },
                "& .MuiDataGrid-columnHeaderTitle": { color: "white !important", fontWeight: "bold !important" },
                }}
                />
            </div>

    </Layout>
      );
}
export default Summary_script_year;