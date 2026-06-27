import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Summary from './Summary.jsx'
import Categories from './Category.jsx'
import Movie from './Movie.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/categories" element={<Categories/>} />
        <Route path="/movie" element={<Movie/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
