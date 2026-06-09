import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Layout from "./Layout"

function Summary_script() {

    const [animeList, setAnimeList] = useState([]);

    const scriptwriterOptions = ["不明", "黒住光", "ひるまちかこ", "中弘子", "晨原大輔", "阪口和久", "モラル", "川辺美奈子", "清水東", "翁妙子", "筧昌也"]
    const [period, setPeriod] = useState("all")

    const characterappearOptions = ["all", "得点圏"]
    const [characterappearOption, setCharacterAppearOption] = useState("all");
    const filteredCharacterAppear = characterappearOption === "all" ? animeList : animeList.filter((anime) => anime.character_appear === true)

    const filteredByPeriod = period === "all" ? filteredCharacterAppear 
  : period === "2017" ? filteredCharacterAppear.filter(anime => new Date(anime.anime_date).getFullYear() >= 2017)
  : filteredCharacterAppear.filter(anime => new Date(anime.anime_date).getFullYear() >= 2022)

    useEffect(() => {
    fetch("http://127.0.0.1:8000/anime")
      .then((res) => res.json())
      .then((data) => setAnimeList(data));
  }, []);

    const columns = [
    { field: "script_writer", headerName: "Script writer", width: 120 },
    { field: "episodes", headerName: "Episodes", width: 120 },
    { field: "episodes_character", headerName: "Episodes character", width: 120 },
    { field: "positive", headerName: "Positive", width: 120 },
    { field: "negative", headerName: "Negative", width: 120 },
    { field: "total", headerName: "Total", width: 120 },
    { field: "positive_per_nine_episodes", headerName: "Positive per nine episodes", width: 120 },
    { field: "negative_per_nine_episodes", headerName: "Negative per nine episodes", width: 120 },
  ];
  
    const rows = scriptwriterOptions.map((s) => {
        const entries = filteredByPeriod.filter((anime) => anime.script_writer === s)
        const pos = entries.reduce((total, anime) => total + anime.positive_score, 0)
        const neg = entries.reduce((total, anime) => total + anime.negative_score, 0)
        const character = filteredByPeriod.filter((anime) => anime.script_writer === s && anime.character_appear === true)
        return { id: s, script_writer: s, episodes: entries.length, episodes_character: character.length, positive: pos, negative: neg, total: pos - neg, 
            positive_per_nine_episodes: (pos *9/(entries.length)).toFixed(2), 
            negative_per_nine_episodes: (neg *9/(entries.length)).toFixed(2)}
})


return (
        <Layout>
            <div style={{ padding: 24 }}>
            <h1 style={{ color: "#1a1a1a" }}>Summary Script writer</h1>
        <button onClick={() => setCharacterAppearOption("all")}>All</button>
        <button onClick={() => setCharacterAppearOption("得点圏")}>得点圏～</button>    
        <button onClick={() => setPeriod("all")}>All</button>
        <button onClick={() => setPeriod("2017")}>2017～</button>
        <button onClick={() => setPeriod("2022")}>2022～</button>    


        <div style={{ height: 600 }}>
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

            </div>
        </Layout>
        );
    }

    export default Summary_script;