import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'

const root = createRoot(document.getElementById('root'))

root.render(
	<Register/>
)
