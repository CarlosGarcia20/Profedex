import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_URL_API,
	timeout: 10000,
	headers: {'Content-Type': 'application/json'},
	withCredentials: true
});
api.interceptors.response.use(
	(response) => {
		return response;
	},

	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
		
		originalRequest._retry = true;

		try {
			await api.get('/auth/refresh');

			return api(originalRequest);

		} catch (refreshError) {
			console.error("Sesión expirada, cerrando sesión...");
			
			localStorage.clear();
			window.location.href = '/login';
			
			return Promise.reject(refreshError);
		}
		}

		return Promise.reject(error);
	}
);

export default api;