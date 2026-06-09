import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Summary from './Summary.jsx'
import Summary_script from './Summary_script.jsx'
import Summary_script_year from './Summary_script_year.jsx'
import Summary_month from './Summary_month.jsx'
import Summary_rokuyo from './Summary_rokuyo.jsx'
import Categories from './Category.jsx'
import Movie from './Movie.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/summary_script" element={<Summary_script/>} />
        <Route path="/summary_script_year" element={<Summary_script_year/>} />
        <Route path="/summary_month" element={<Summary_month/>} />
        <Route path="/summary_rokuyo" element={<Summary_rokuyo/>} />
        <Route path="/categories" element={<Categories/>} />
        <Route path="/movie" element={<Movie/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
