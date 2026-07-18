import { useEffect, useState } from "react";
import Layout from "./Layout"
import { fetchWithAuth } from "./api";

function Profile(){
    const [animeList, setAnimeList] = useState([]);

    useEffect(() => {
  
  fetchWithAuth("http://127.0.0.1:8000/anime")
    .then((res) => res.json())
    .then((data) => setAnimeList(data));
}, []);

    const animeNames = [...new Set(animeList.map(a => a.anime_name).filter(Boolean))]

    const rows = animeNames.map((name) => {
        const entries = animeList.filter(a => a.anime_name === name)
        const average_rating = (entries.reduce((total, anime) => total + anime.rating, 0) / entries.length).toFixed(1)
        const watched = entries.filter(a => a.watch_status === "WATCHED").length
        const watching = entries.filter(a => a.watch_status === "WATCHING").length
        const planToWatch = entries.filter(a => a.watch_status === "PLAN TO WATCH").length
        const dropped = entries.filter(a => a.watch_status === "DROPPED").length
        return { name, average_rating, watched, watching, planToWatch, dropped, total: entries.length }
    })

    return(
        <Layout>
            <div style={{ padding: 24 }}>
            <h1 style={{ color: "#1a1a1a" }}>Profile</h1>
            {rows.map((row) => (
                <div key={row.name} style={{ border: "1px solid #ddd", padding: "16px", marginBottom: "16px", borderRadius: "8px" }}>
                    <h2>{row.name}</h2> 
                    <p>Total episodes {row.total}</p>
                    <p>Average rating {row.average_rating}</p>
                    <p>Watched {row.watched}</p>
                    <p>Watching {row.watching}</p>
                    <p>Plan to watch {row.planToWatch}</p>
                    <p>Dropped {row.dropped}</p>

                </div>
            ))}

            

            </div>
        </Layout>
    )

}export default Profile;