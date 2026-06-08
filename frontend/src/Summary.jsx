import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Layout from "./Layout"

function Summary() {

    const [animeList, setAnimeList] = useState([]);
    const years = [...new Set(animeList.map((anime) => new Date(anime.anime_date).getFullYear()))]

    useEffect(() => {
    fetch("http://127.0.0.1:8000/anime")
      .then((res) => res.json())
      .then((data) => setAnimeList(data));
  }, []);

    const columns = [
    { field: "year", headerName: "Year", width: 120 },
    { field: "positive", headerName: "Positive", width: 120 },
    { field: "negative", headerName: "Negative", width: 120 },
    { field: "win", headerName: "Wins", width: 120 },
    { field: "lose", headerName: "Loses", width: 120 },
    { field: "total", headerName: "Total", width: 120 },
    { field: "episodes", headerName: "Episodes", width: 120 },
    { field: "episodes_character", headerName: "Episodes character", width: 120 },
    { field: "positive_per_nine_episodes", headerName: "Positive per nine episodes", width: 120 },
    { field: "negative_per_nine_episodes", headerName: "Negative per nine episodes", width: 120 },
    { field: "positive_per_nine_episodes_t", headerName: "得点圏得点率", width: 120 },
    { field: "negative_per_nine_episodes_t", headerName: "得点圏失点率", width: 120 },
  ];
  
    const rows = years.map((y) => {
        const entries = animeList.filter((anime) => new Date(anime.anime_date).getFullYear() === y)
        const pos = entries.reduce((total, anime) => total + anime.positive_score, 0)
        const neg = entries.reduce((total, anime) => total + anime.negative_score, 0)
        const character = animeList.filter((anime) => new Date(anime.anime_date).getFullYear() === y && anime.character_appear === true)
        const wins = animeList.filter((anime) => new Date(anime.anime_date).getFullYear() === y && anime.positive_score > anime.negative_score)
        const loses = animeList.filter((anime) => new Date(anime.anime_date).getFullYear() === y && anime.positive_score < anime.negative_score)
        return { id: y, year: y, positive: pos, negative: neg, total: pos - neg, win: wins.length, lose: loses.length, episodes: entries.length, episodes_character: character.length, 
            positive_per_nine_episodes: (pos *9/(entries.length)).toFixed(2), 
            negative_per_nine_episodes: (neg *9/(entries.length)).toFixed(2),
            positive_per_nine_episodes_t: (pos *9/(character.length)).toFixed(2), 
            negative_per_nine_episodes_t: (neg *9/(character.length)).toFixed(2)}
})


return (
    <Layout>
            <div style={{ padding: 24 }}>
            <h1 style={{ color: "#1a1a1a" }}>Summary</h1>


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

    export default Summary;