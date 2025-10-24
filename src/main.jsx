import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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

root.render(<CommunityContent />);
