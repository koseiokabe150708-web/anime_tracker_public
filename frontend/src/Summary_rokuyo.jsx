import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { DataGrid } from "@mui/x-data-grid";
import Layout from "./Layout"

function Summary_rokuyo() {

    const [animeList, setAnimeList] = useState([]);

    const rokuyoOptions = ["大安", "仏滅", "先負", "先勝", "赤口", "友引"]

    useEffect(() => {
    fetch("http://127.0.0.1:8000/anime")
      .then((res) => res.json())
      .then((data) => setAnimeList(data));
  }, []);

    const columns = [
    { field: "rokuyo", headerName: "Rokuyo", width: 120 },
    { field: "episodes", headerName: "Episodes", width: 120 },
    { field: "episodes_character", headerName: "Episodes character", width: 120 },
    { field: "positive", headerName: "Positive", width: 120 },
    { field: "negative", headerName: "Negative", width: 120 },
    { field: "total", headerName: "Total", width: 120 },
    { field: "positive_per_nine_episodes", headerName: "Positive per nine episodes", width: 120 },
    { field: "negative_per_nine_episodes", headerName: "Negative per nine episodes", width: 120 },
  ];
  
    const rows = rokuyoOptions.map((r) => {
        const entries = animeList.filter((anime) => anime.rokuyo === r)
        const pos = entries.reduce((total, anime) => total + anime.positive_score, 0)
        const neg = entries.reduce((total, anime) => total + anime.negative_score, 0)
        const character = animeList.filter((anime) => anime.rokuyo === r && anime.character_appear === true)
        return { id: r, rokuyo: r, episodes: entries.length, episodes_character: character.length, positive: pos, negative: neg, total: pos - neg, 
            positive_per_nine_episodes: (pos *9/(entries.length)).toFixed(2), 
            negative_per_nine_episodes: (neg *9/(entries.length)).toFixed(2)}
})


return (
        <Layout>
            <div style={{ padding: 24 }}>
            <h1 style={{ color: "#1a1a1a" }}>Summary rokuyo</h1>
            <Link to="/">Go to Main</Link>


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

    export default Summary_rokuyo;