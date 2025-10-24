import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Home from './pages/Common/Home/Home'
import Equipo from './pages/Common/Equipo/Equipo'
import HomeTeacher from './pages/Common/Home/Home-Teacher'

const root = createRoot(document.getElementById('root'))

root.render(
	<HomeTeacher/>
)
