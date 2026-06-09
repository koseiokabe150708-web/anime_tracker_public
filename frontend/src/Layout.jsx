import { Link } from "react-router-dom";

export default function Layout({ children }) {

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "white", width: "100%" }}>
      {/* Top header */}
    <div style={{ 
      backgroundColor: "#1a1a1a",
      color: "white", 
      padding: "12px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
      }}>
        <span style={{ fontWeight: "bold", fontSize: 18 }}>Shin chan tracker</span>
        <span>Kosei</span>
        </div>
      
      {/* Sidebar + Content */}
      <div style={{ display: "flex", flex: 1 }}>
        <nav style={{ 
          width: 200, 
          alignSelf: "stretch",
          display: "flex", 
          flexDirection: "column",
          padding: 16,
          gap: 16,
          backgroundColor: "#4E342E",
          color: "white",
        }}>
        <Link to="/" style={{ color: "white" }}>Tracker</Link>
        <Link to="/summary" style={{ color: "white" }}>Summary</Link>
        <Link to="/categories" style={{ color: "white" }}>Categories</Link>
        <Link to="/summary_script" style={{ color: "white" }}>Script Writer</Link>
        <Link to="/summary_script_year" style={{ color: "white" }}>Script by Year</Link>
        <Link to="/movie" style={{ color: "white" }}>Movie</Link>
      </nav>
      <main style={{ flex: 1, padding: 24, backgroundColor: "white" }}>
        {children}
        </main>
    </div>
  </div>
  );
}