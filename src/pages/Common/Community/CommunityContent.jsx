import { useState, useEffect, useRef } from "react";
import HeaderGeneral from "../../../components/header/HeaderGeneral"
import api from "../../../api/axios";
import toast from "react-hot-toast";
import UploadFiles from "../../../components/upload/UploadFiles";
import { showRejectedImage } from "../../../utils/alerts";
import { CommunityCard } from "../../../components/community/CommunityCard";

import { HiCloudUpload, HiFilter } from "react-icons/hi";

export default function CommunityContent() {
	const [events, setEvents] = useState([]);
	const [selectedEventId, setSelectedEventId] = useState("");
	const [galleryImages, setGalleryImages] = useState([]);
	const fileInputRef = useRef(null);

	const [isUploading, setIsUploading] = useState(false);
	const [myFiles, setMyFiles] = useState([]);
	const [communityImages, setCommunityImages] = useState([]);
	const [loadingImages, setLoadingImages] = useState(true);

	const fetchCommunity = async () => {
		setLoadingImages(true);
		try {
			const response = await api.get('/posts/feed');
			setCommunityImages(response.data);
		} catch (error) {
			console.error("Error fetching feed:", error);
			toast.error('No se pudo cargar el feed de la comunidad');
		} finally {
			setLoadingImages(false);
		}
	};

	useEffect(() => {
		fetchCommunity();
	}, []);

	const handleFileUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		if(!selectedEventId) {
			toast.error("Primero selecciona un evento");
			e.target.value = null;
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			toast.error("El archivo es demasiado pesado (Max 5MB)");
			return;
		}

		const formData = new FormData();
		formData.append('image', file);

		setIsUploading(true);
		const loadingToastId = toast.loading('Analizando y subiendo archivo...');

		try {
			const response = await api.post('/posts/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});

			toast.success('¡Archivo aprobado y subido!', { id: loadingToastId });

			const newFile = {
				id: Date.now(),
				name: file.name,
				size: (file.size / 1024 / 1024).toFixed(2) + " MB",
				url: response.data?.url || "#"
			};
			setMyFiles(prev => [newFile, ...prev]);

			fetchCommunity();

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
			setIsUploading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<HeaderGeneral titulo="Comunidad" />

			<div className="p-6 max-w-7xl mx-auto">
				<div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

					<div className="flex items-center gap-2">
						<div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
							<HiFilter size={24} />
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-800">Galería de Eventos</h2>
							<p className="text-xs text-gray-500">Selecciona un evento para ver o subir fotos</p>
						</div>
					</div>

					<div className="flex items-center gap-3 w-full md:w-auto">

						<div className="relative w-full md:w-64">
							<select
								value={selectedEventId}
								onChange={(e) => setSelectedEventId(e.target.value)}
								className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-700 font-medium py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer text-sm"
							>
								<option value="">-- Selecciona un evento --</option>
								{events.map(ev => (
									<option key={ev.event_id} value={ev.event_id}>
										{ev.name}
									</option>
								))}
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
								<svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
							</div>
						</div>

						<button
							onClick={() => {
								if (!selectedEventId) return toast.error("Selecciona un evento primero");
								fileInputRef.current.click();
							}}
							className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm font-bold text-sm transition-all transform active:scale-95 whitespace-nowrap
                                ${selectedEventId
									? "bg-yellow-400 hover:bg-yellow-500 text-gray-900 cursor-pointer"
									: "bg-gray-200 text-gray-400 cursor-not-allowed"}
                            `}
							title={selectedEventId ? "Subir foto a este evento" : "Selecciona un evento primero"}
						>
							<HiCloudUpload size={18} />
							<span className="hidden sm:inline">Subir Foto</span>
						</button>

						<input
							type="file"
							ref={fileInputRef}
							className="hidden"
							accept="image/*"
							// onChange={handleFileUpload}
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{selectedEventId ? (
						galleryImages.length > 0 ? (
							galleryImages.map((img, idx) => (
								<div key={idx} className="bg-white p-2 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
									<div className="h-48 overflow-hidden rounded-md">
										<img
											src={img.url}
											alt="Evento"
											className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
										/>
									</div>
									<div className="mt-2 flex justify-between items-center px-1">
										<span className="text-xs text-gray-500">Subido por: {img.author || "Anon"}</span>
									</div>
								</div>
							))
						) : (
							<div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
								<HiFilter className="text-4xl mb-2 opacity-50" />
								<p>Aún no hay fotos en este evento.</p>
								<p className="text-sm">¡Sé el primero en subir una!</p>
							</div>
						)
					) : (
						<div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-400">
							<i className="fas fa-images text-6xl mb-4 text-gray-300"></i>
							<h3 className="text-xl font-semibold text-gray-500">Selecciona un evento</h3>
							<p>Elige un evento del menú superior para ver la galería.</p>
						</div>
					)}
				</div>
			</div>
		</div>
		// <div>
		// 	<div className="h-full bg-gray-300 flex flex-col min-h-screen">
		// 		<div className="p-6 space-y-8">

		// 			<UploadFiles onFileUpload={handleUpload} isUploading={isUploading} />

		// 			{myFiles.length > 0 && (
		// 				<>
		// 					<h2 className="text-2xl font-bold text-blue-700 animate-fade-in">
		// 						Tus archivos subidos recientes
		// 					</h2>
		// 					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
		// 						{myFiles.map((file) => (
		// 							<FileCard key={file.id} name={file.name} size={file.size} />
		// 						))}
		// 					</div>
		// 				</>
		// 			)}

		// 			{/* SECCIÓN: FEED COMUNIDAD */}
		// 			<div className="flex items-center justify-between border-b border-gray-400 pb-2">
		// 				<h2 className="text-2xl font-bold text-blue-700">
		// 					Galería de la Comunidad
		// 				</h2>
		// 				{/* Botón manual de refrescar */}
		// 				<button
		// 					onClick={fetchCommunity}
		// 					className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
		// 					disabled={loadingImages}
		// 				>
		// 					<i className={`fas fa-sync-alt ${loadingImages ? 'animate-spin' : ''}`}></i>
		// 					Actualizar
		// 				</button>
		// 			</div>

		// 			{loadingImages ? (
		// 				<div className="flex justify-center items-center py-20">
		// 					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
		// 				</div>
		// 			) : (
		// 				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
		// 					{communityImages.length > 0 ? (
		// 						communityImages.map((file) => (
		// 							<CommunityCard key={file.id} file={file} />
		// 						))
		// 					) : (
		// 						<div className="col-span-full py-10 flex flex-col items-center justify-center text-gray-500 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
		// 							<i className="fas fa-images text-4xl mb-3 text-gray-400"></i>
		// 							<p>Aún no hay imágenes en la comunidad.</p>
		// 						</div>
		// 					)}
		// 				</div>
		// 			)}
		// 		</div>
		// 	</div>
		// </div>
	);
}

function FileCard({ name, size }) {
	return (
		<div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-300">
			<i className="fas fa-file text-4xl text-blue-500"></i>
			<div className="flex-1 min-w-0">
				<p className="font-medium text-gray-800 truncate" title={name}>
					{name}
				</p>
				<p className="text-sm text-gray-500">{size}</p>
			</div>

		</div>
	);
}