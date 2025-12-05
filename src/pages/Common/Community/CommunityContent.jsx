import { useState, useEffect } from "react";
import HeaderGeneral from "../../../components/header/HeaderGeneral"
import UploadFiles from "../../../components/upload/UploadFiles";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { showRejectedImage } from "../../../utils/alerts";
import { CommunityCard } from "../../../components/community/CommunityCard";

export default function CommunityContent() {
	const [isUploading, setIsUploading] = useState(false);
	const [myFiles, setMyFiles] = useState([]);
	const [communityImages, setCommunityImages] = useState([]);
	const [loadingImages, setLoadingImages] = useState(true);

	const fetchCommunity = async () => {
		setLoadingImages(true);
		try {
			const response = await api.get('/posts/feed');
			// Asumiendo que tu backend devuelve { data: [...] }
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

	const handleUpload = async (file) => {
		if (!file) return;

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
		<div>
			<div className="h-full bg-gray-300 flex flex-col min-h-screen">
				<HeaderGeneral titulo="Comunidad" />
				<div className="p-6 space-y-8">

					<UploadFiles onFileUpload={handleUpload} isUploading={isUploading} />

					{myFiles.length > 0 && (
						<>
							<h2 className="text-2xl font-bold text-blue-700 animate-fade-in">
								Tus archivos subidos recientes
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
								{myFiles.map((file) => (
									<FileCard key={file.id} name={file.name} size={file.size} />
								))}
							</div>
						</>
					)}

					{/* SECCIÓN: FEED COMUNIDAD */}
					<div className="flex items-center justify-between border-b border-gray-400 pb-2">
						<h2 className="text-2xl font-bold text-blue-700">
							Galería de la Comunidad
						</h2>
						{/* Botón manual de refrescar */}
						<button
							onClick={fetchCommunity}
							className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
							disabled={loadingImages}
						>
							<i className={`fas fa-sync-alt ${loadingImages ? 'animate-spin' : ''}`}></i>
							Actualizar
						</button>
					</div>

					{loadingImages ? (
						<div className="flex justify-center items-center py-20">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{communityImages.length > 0 ? (
								communityImages.map((file) => (
									<CommunityCard key={file.id} file={file} />
								))
							) : (
								<div className="col-span-full py-10 flex flex-col items-center justify-center text-gray-500 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
									<i className="fas fa-images text-4xl mb-3 text-gray-400"></i>
									<p>Aún no hay imágenes en la comunidad.</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
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