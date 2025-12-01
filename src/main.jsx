import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { Toaster } from 'react-hot-toast';

import { ProtectedRoute } from './components/protectedRoutes/protected';

import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Home from './pages/Common/Home/Home'
import AlumnoP from './pages/Common/Profiles/AlumnoP'
import MaestroP from './pages/Common/Profiles/MaestroP'
import Equipo from './pages/Common/Equipo/Equipo'
import HomeTeacher from './pages/Common/Home/Home-Teacher'
import CommunityContent from './pages/Common/Community/CommunityContent'
import AdminLayout from './layouts/AdminLayout';
import AdminUsers from './pages/admin/Users';
import AdminSubjects from './pages/admin/Subjects';
import AdminMajors from './pages/admin/Major';
import AdminDashboard from './pages/admin/Dashboard';
import AdminGroups from './pages/admin/Group';

const root = createRoot(document.getElementById('root'))

root.render(
	<StrictMode>
		<Toaster
			position="top-center"
			toastOptions={{
				style: {
					background: '#313141',
					color: '#e5e7eb',
					border: '1px solid #52525a',
				},
				success: {
					iconTheme: {
						primary: '#0ba600',
						secondary: '#413133',
					},
				},
				error: {
					iconTheme: {
						primary: '#ef4444',
						secondary: '#ffffff',
					},
				},
			}}
		/>

		<BrowserRouter>
			<Routes>
				{/* Public Routes */}
				<Route path="/" element={<Navigate to="/login" />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />

				{/* Admin Route */}
				<Route element={<ProtectedRoute allowedRoles={['admin']} />}>
					<Route path='/admin' element={<AdminLayout />}>
						
						{/* <Route index element= /> */}
						<Route path='' element={<AdminDashboard />} />
						<Route path='users' element={<AdminUsers />} />
						<Route path='majors' element={<AdminMajors />} />
						<Route path='groups' element={<AdminGroups />} />
						<Route path='subjects' element={<AdminSubjects />} />
					</Route>

				</Route>

				{/* Routes With Layout */}
				<Route path='/' element={<DashboardLayout />}>
					{/* Student Routes */}
					<Route path="/student" element={<Home />} />
					<Route path="/student/profile" element={<AlumnoP />} />
					<Route path="/student/team" element={<Equipo />} />
					
					{/* Teacher Routes */}
					<Route path="/teacher" element={<HomeTeacher />} />
					<Route path="/teacher/profile" element={<MaestroP />} />
					
					<Route path="/community" element={<CommunityContent />} />
				</Route>
			</Routes>
		</BrowserRouter>

	</StrictMode>
);