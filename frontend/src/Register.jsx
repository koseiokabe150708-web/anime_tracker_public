import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "./Layout"
import { API_BASE_URL } from "./api";

function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleRegister(){
        try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError("Registration failed");
      return;
    }
    



      
      setEmail("");
      setPassword("");

    
      navigate("/login");

    } catch (err) {
      setError("Failed to add user");
    } finally {
      setLoading(false);
    }
    }

    return (
        <Layout>
            <div style={{ maxWidth: "400px", margin: "0 auto", padding: "24px" }}>
                <h1>Register</h1>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {loading && <p>Logging in...</p>}
                <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
                    <button onClick={handleRegister}>Register</button>
                </div>

            </div>

        </Layout>
    )

}
export default Register;