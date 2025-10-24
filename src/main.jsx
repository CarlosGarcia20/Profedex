import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Home from './pages/Common/Home/Home'
import AlumnoP from './pages/Common/Profiles/AlumnoP'
import MaestroP from './pages/Common/Profiles/MaestroP'
import Equipo from './pages/Common/Equipo/Equipo'
import HomeTeacher from './pages/Common/Home/Home-Teacher'
import CommunityContent from './pages/Common/Community/CommunityContent'

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<Home />} />
        <Route path="/student/profile" element={<AlumnoP />} />
        <Route path="/student/team" element={<Equipo />} />
        <Route path="/teacher" element={<HomeTeacher />} />
        <Route path="/teacher/profile" element={<MaestroP />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
