import { useState, useEffect, useRef } from "react";
import HeaderGeneral from "../../../components/header/HeaderGeneral"
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { showAlertConfirm, showRejectedImage } from "../../../utils/alerts";
import { HiCloudUpload, HiDownload, HiFilter, HiTrash, HiUser, HiUsers,  } from "react-icons/hi";

export default function CommunityContent() {
	const [communityImages, setCommunityImages] = useState([]);
	const [activeEvents, setActiveEvents] = useState([]);
	const [myPhotos, setMyPhotos] = useState([]);
	
	const [filterEvents, setFilterEvents] = useState("-1");
	const [viewMode, setViewMode] = useState('community');
	const [loadingImages, setLoadingImages] = useState(true);
	const [loading, setLoading] = useState(false);
	
	const fileInputRef = useRef(null);

	const fetchCommunity = async () => {
		setLoadingImages(true);
		try {
			const response = await api.get('/posts/feed');
			setCommunityImages(response.data);
		} catch (error) {
			console.error("Error fetching feed:", error);
			// toast.error('No se pudo cargar el feed de la comunidad');
		} finally {
			setLoadingImages(false);
		}
	};

	const fetchEvents = async() => { 
		try {
			const response = await api.get('/posts/events');
			setActiveEvents(response.data.data);
		} catch (error) {
			console.error(error);
		}
	}

	const fetchMyPhotos = async () => {
		setLoading(true);
		try {
			const response = await api.get('/posts/mine');
			setMyPhotos(response.data.data || response.data);
		} catch (error) {
			if(error.status == 404) return toast.error(error.response.data.message)
			
			toast.error("Error al cargar tus fotos");
		} finally { setLoading(false); }
	};

	useEffect(() => {
		fetchCommunity();
		fetchEvents();
		fetchMyPhotos();
	}, []);

	const imagesToShow = viewMode === 'community' ? communityImages : myPhotos;
	
	const filteredResults = imagesToShow.filter((item) => {
		if (filterEvents === "-1") return true;
		return String(item.event_id) === String(filterEvents);
	});

	const handleFileUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		if (filterEvents === "-1") {
			toast.error("Primero selecciona un evento específico");
			e.target.value = null;
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			toast.error("El archivo es demasiado pesado (Max 5MB)");
			return;
		}

		const formData = new FormData();
		formData.append('image', file);
		formData.append('event_id', filterEvents);

		const loadingToastId = toast.loading('Analizando y subiendo archivo...');
		
		try {
			const response = await api.post('/posts/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});

			toast.success('¡Archivo aprobado y subido!', { id: loadingToastId });
			fetchCommunity();
			fetchMyPhotos();

		} catch (error) {
			toast.dismiss(loadingToastId);
			const responseData = error.response?.data;

			if (responseData?.reasons && Array.isArray(responseData.reasons)) {
				const reasonsHtml = responseData.reasons
					.map(r => `<li class="mb-1 text-left">• ${r}</li>`)
					.join('');
				showRejectedImage("<strong>Imagen rechazada</strong>", reasonsHtml);
			} else {
				toast.error(responseData?.message || 'Error al subir el archivo');
			}
		} finally {
			e.target.value = null;
		}
	};

	const handleDeleteImage = async(id) => {
		showAlertConfirm("¿Esta seguro de eliminar la imagen?").then( async(response) => {
			if(response.isConfirmed) {
				const loadingToast = toast.loading("Eliminando foto...");
				
				try {
					await api.delete(`posts/me/images/${id}`);

					setMyPhotos(prev => prev.filter(img => img.id !== id));
					setCommunityImages(prev => prev.filter(img => img.id !== id));

					toast.success("Foto eliminada", { id: loadingToast });
				} catch (error) {
					console.error(error);
					toast.error("Error al eliminar", { id: loadingToast });
				}
			}
		});
	}

	const handleDownloadImage = async (imageUrl, imageName) => {
		const toastId = toast.loading("Descargando...");

		try {
			const response = await fetch(imageUrl);
			const blob = await response.blob();

			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;

			link.download = imageName || `imagen-comunidad-${Date.now()}.jpg`;

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			toast.success("¡Descarga lista!", { id: toastId });
		} catch (error) {
			console.error("Error descarga:", error);
			toast.error("No se pudo descargar la imagen", { id: toastId });
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<HeaderGeneral titulo="Comunidad" />

			<div className="p-6 max-w-7xl mx-auto">

				<div className="flex justify-center mb-6">
					<div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
						<button
							onClick={() => setViewMode('community')}
							className={`
                                flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all
                                ${viewMode === 'community'
									? 'bg-blue-100 text-blue-700 shadow-sm'
									: 'text-gray-500 hover:bg-gray-50'
								}
                            `}
						>
							<HiUsers size={20} />
							Comunidad
						</button>
						<button
							onClick={() => setViewMode('mine')}
							className={`
                                flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all
                                ${viewMode === 'mine'
									? 'bg-blue-100 text-blue-700 shadow-sm'
									: 'text-gray-500 hover:bg-gray-50'}
                            `}
						>
							<HiUser size={20} />
							Mis Subidas
						</button>
					</div>
				</div>

				<div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

					<div className="flex items-center gap-2">
						<div className={`p-2 rounded-lg ${viewMode === 'mine' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
							{viewMode === 'mine' ? <HiUser size={24} /> : <HiFilter size={24} />}
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-800">
								{viewMode === 'mine' ? "Mis Aportaciones" : "Galería Global"}
							</h2>
							<p className="text-xs text-gray-500">
								{viewMode === 'mine'
									? "Fotos que tú has compartido"
									: "Explora lo que todos han subido"}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3 w-full md:w-auto">

						<div className="relative w-full md:w-64">
							<select
								value={filterEvents}
								onChange={(e) => setFilterEvents(e.target.value)}
								className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-700 font-medium py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
							>
								<option value="-1">Todos los eventos</option>
								{activeEvents.map(event => (
									<option key={event.event_id} value={event.event_id}>
										{event.name}
									</option>
								))}
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
								<svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
							</div>
						</div>

						<button
							onClick={() => {
								if (filterEvents === "-1") return toast.error("Selecciona un evento primero");
								fileInputRef.current.click();
							}}
							className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm font-bold text-sm transition-all whitespace-nowrap
                                ${filterEvents !== "-1"
									? "bg-yellow-400 hover:bg-yellow-500 text-gray-900 cursor-pointer"
									: "bg-gray-200 text-gray-400 cursor-not-allowed"}
                            `}
						>
							<HiCloudUpload size={18} />
							<span className="hidden sm:inline">Subir Foto</span>
						</button>

						<input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
					</div>
				</div>

				{/* GRID DE IMÁGENES */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{loading ? (
						<div className="col-span-full text-center py-20 text-gray-400">Cargando...</div>
					) : filteredResults.length > 0 ? (
						filteredResults.map((img) => {
							const fecha = new Date(img.created_at);

							return (
								<div key={img.id} className="bg-white p-2 rounded-lg shadow hover:shadow-xl transition-all duration-300 group relative">

									<div className="h-48 overflow-hidden rounded-md relative">
										<img
											src={img.image_url}
											alt="Evento"
											className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
										/>
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleDownloadImage(img.image_url, `foto-${img.id}.jpg`);
											}}
											className="absolute top-2 left-2 bg-blue-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-700 transform hover:scale-110 z-10"
											title="Eliminar foto"
										>
											<HiDownload size={16} />
										</button>
										{viewMode === 'mine' && (
											<button
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteImage(img.id);
												}}
												className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 transform hover:scale-110 z-10"
												title="Eliminar foto"
											>
												<HiTrash size={16} />
											</button>
										)}

										{viewMode === 'mine' && (
											<div className="absolute bottom-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full shadow opacity-75">
												Mía
											</div>
										)}
									</div>

									<div className="mt-2 flex justify-between items-center px-1">
										<span className="text-xs text-gray-500 font-medium truncate">
											{viewMode === 'mine' ? "Subido por ti" : `Por: ${img.name || "Anónimo"}`}
										</span>

										<span className="text-[10px] text-gray-400">
											{fecha.toLocaleDateString('es-MX', {
												weekday: 'short',
												day: 'numeric',
												month: 'short'
											})}
										</span>
									</div>
								</div>
							);
						})
					) : (
						<div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-400">
							<i className={`fas ${viewMode === 'mine' ? 'fa-camera' : 'fa-images'} text-6xl mb-4 text-gray-300`}></i>
							<h3 className="text-xl font-semibold text-gray-500">
								{viewMode === 'mine'
									? "No has subido fotos"
									: (filterEvents === "-1" ? "No hay fotos recientes" : "Evento vacío")}
							</h3>
							<p className="text-sm">
								{viewMode === 'mine'
									? "¡Participa subiendo fotos a los eventos!"
									: "¡Sé el primero en subir una!"}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
