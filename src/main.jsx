import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Auth/Login'

const root = createRoot(document.getElementById('root'))

root.render(
	<Login/>
)
