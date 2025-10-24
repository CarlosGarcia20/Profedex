import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Home from './pages/Common/Home/Home'
import AlumnoP from './pages/Common/Profiles/AlumnoP'
import Equipo from './pages/Common/Equipo/Equipo'

const root = createRoot(document.getElementById('root'))

root.render(
	<AlumnoP />
)
