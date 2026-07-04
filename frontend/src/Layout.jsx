import { Link } from "react-router-dom";

export default function Layout({ children }) {

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "white", width: "100%" }}>

      <div style={{ display: "flex", height: "6px" }}>
        <div style={{ flex: 1, backgroundColor: "#FF0000" }} />
        <div style={{ flex: 1, backgroundColor: "#FF7700" }} />
        <div style={{ flex: 1, backgroundColor: "#FFFF00" }} />
        <div style={{ flex: 1, backgroundColor: "#00CC00" }} />
        <div style={{ flex: 1, backgroundColor: "#0000FF" }} />
        <div style={{ flex: 1, backgroundColor: "#FF00FF" }} />
</div>
      {/* Top header */}
    <div style={{ 
      backgroundColor: "#1a1a1a",
      color: "white", 
      padding: "12px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
      }}>
        <span style={{ fontWeight: "bold", fontSize: 18 }}>Anime Recorder</span>
        <span>Kosei</span>
        </div>
      
      {/* Sidebar + Content */}
      <main style={{ flex: 1, padding: 24, backgroundColor: "white" }}>
        {children}
        </main>

        <nav style={{ 
          alignSelf: "stretch",
          display: "flex", 
          justifyContent: "space-around",
          padding: 16,
          gap: 16,
          backgroundColor: "#4E342E",
          color: "white",
          position: "sticky",
          bottom: 0,
        }}>
        <Link to="/" style={{ color: "white" }}>Tracker</Link>
        <Link to="/summary" style={{ color: "white" }}>Summary</Link>
        <Link to="/categories" style={{ color: "white" }}>Categories</Link>
        <Link to="/movie" style={{ color: "white" }}>Movie</Link>
      </nav>
  </div>
  );
}