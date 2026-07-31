import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import MoviePage from "./MoviePage";
import MovieHome from "./MovieHome";
import AnimePage from './AnimePage.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import Profile from './Profile.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/movie" element={<MovieHome/>} />
        <Route path="/movie/:animeName" element={<MoviePage/>} />
        <Route path="/anime/:animeName" element={<AnimePage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
