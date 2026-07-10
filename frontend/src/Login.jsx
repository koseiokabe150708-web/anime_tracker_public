import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "./Layout"

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleLogin(){
        try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);
      
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
  setError("Invalid email or password");
  return;
}

    const data = await res.json();
localStorage.setItem("token", data.access_token);

      
      setEmail("");
      setPassword("");

    
      navigate("/");

    } catch (err) {
      setError("Failed to add user");
    } finally {
      setLoading(false);
    }
    }

    return (
        <Layout>
            <div style={{ maxWidth: "400px", margin: "0 auto", padding: "24px" }}>
                <h1>Login</h1>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {loading && <p>Logging in...</p>}
                <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
                    <button onClick={handleLogin}>Login</button>
                    <Link to="/register">Don't have an account? Register</Link>
                </div>

            </div>

        </Layout>
    )

}
export default Login;