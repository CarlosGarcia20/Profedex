import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { Toaster } from 'react-hot-toast';

import { ProtectedRoute } from './components/protectedRoutes/protected';

import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Auth/Login'
// import Register from './pages/Auth/Register'
import Home from './pages/Common/Home/Home'
import AlumnoP from './pages/Common/Profiles/AlumnoP'
import MaestroP from './pages/Common/Profiles/MaestroP'
import Info from './pages/Common/Info/Info';
import InfoP from './pages/Common/Info/Info-Teacher';
import Equipo from './pages/Common/Equipo/Equipo'
import HomeTeacher from './pages/Common/Home/Home-Teacher'
import CommunityContent from './pages/Common/Community/CommunityContent'
import AdminLayout from './layouts/AdminLayout';
import AdminUsers from './pages/admin/Users';
import AdminSubjects from './pages/admin/school/Subjects';
import AdminMajors from './pages/admin/school/Major';
import AdminDashboard from './pages/admin/Dashboard';
import AdminGroups from './pages/admin/school/Group';
import AdminUnits from './pages/admin/school/Units';
import AdminTopics from './pages/admin/school/Topics';
import AdminGroupScheduler from './pages/admin/school/GroupScheduler';
import { AuthProvider } from './context/AuthContext';
import { PublicRoute } from './components/protectedRoutes/PublicRoute';

import 'leaflet/dist/leaflet.css';
import EventsTeacher from './pages/Common/events/EventsTeacher';

const root = createRoot(document.getElementById('root'))

root.render(
	<AuthProvider>
		
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
		</StrictMode>

		<BrowserRouter>
			<Routes>
				{/* Public Routes */}
				<Route element={<PublicRoute />}>
					<Route path="/login" element={<Login />} />
					{/* <Route path="/register" element={<Register />} /> */}
				</Route>

				<Route path="/" element={<Navigate to="/login" />} />
				
				{/* Admin Route */}
				<Route element={<ProtectedRoute allowedRoles={['admin']} />}>
					<Route path='/admin' element={<AdminLayout />}>

						{/* <Route index element= /> */}
						<Route path='' element={<AdminDashboard />} />

						{/* Rutas para la gestión de usuarios */}
						<Route path='users' element={<AdminUsers />} />
						<Route path='users/students' element={<AdminUsers />} />

						{/* Rutas para la gestión escolar */}
						<Route path='majors' element={<AdminMajors />} />
						<Route path='groups' element={<AdminGroups />} />
						<Route path='subjects' element={<AdminSubjects />} />
						<Route path='units' element={<AdminUnits />} />
						<Route path='topics' element={<AdminTopics />} />
						<Route path='groupscheduler' element={<AdminGroupScheduler />} />
					</Route>
				</Route>

				{/* Rutas con dashboard */}
				<Route path='/' element={<DashboardLayout />}>

					{/* Rutas de estudiante */}
					<Route element={<ProtectedRoute allowedRoles={['student']} />}>
						<Route path="/student" element={<Home />} />
						<Route path="/student/profile" element={<AlumnoP />} />
						<Route path="/student/team" element={<Equipo />} />
						<Route path="/student/info" element={<Info />} />
					</Route>

					{/* Rutas del maestro */}
					<Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
						<Route path="/teacher" element={<HomeTeacher />} />
						<Route path="/teacher/info" element={<InfoP />} />
						<Route path='/teacher/events' element={<EventsTeacher />} />
						<Route path="/teacher/profile" element={<MaestroP />} />
					</Route>

					{/* Rutas compartidas */}
					<Route element={<ProtectedRoute allowedRoles={['student', 'teacher']} />} >
						<Route path="/community" element={<CommunityContent />} />
					</Route>

				</Route>				
			</Routes>
		</BrowserRouter>
	</AuthProvider>
);