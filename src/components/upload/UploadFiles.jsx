import { useState } from "react";

export default function UploadFiles({ onFileUpload, isUploading }) {
	const [isDragging, setIsDragging] = useState(false);

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragging(false);

		const files = e.dataTransfer.files;
		if (files && files.length > 0) {
			// Tomamos el primer archivo (tu backend espera 'image' singular)
			onFileUpload(files[0]);
		}
	};

	const handleInputChange = (e) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			onFileUpload(files[0]);
		}
	};

	return (
		<div
			className={`border-2 border-dashed p-8 rounded-lg text-center bg-white shadow-sm transition-colors duration-200 
            ${isDragging ? 'border-blue-600 bg-blue-50' : 'border-blue-400'}
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<input
				type="file"
				id="file-upload"
				className="hidden"
				onChange={handleInputChange}
				disabled={isUploading}
			/>

			<label htmlFor="file-upload" className="cursor-pointer w-full h-full block">
				<div className="flex flex-col items-center justify-center space-y-3">
					{/* Icono animado si está subiendo */}
					{isUploading ? (
						<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700"></div>
					) : (
						<svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
						</svg>
					)}

					<p className="text-xl font-semibold text-gray-700">
						{isUploading ? 'Subiendo archivo...' : 'Arrastra y suelta tu archivo aquí'}
					</p>

					{!isUploading && (
						<>
							<p className="text-gray-500">
								o <span className="text-blue-600 font-medium hover:underline">haz clic para seleccionar</span>
							</p>
							<p className="text-sm text-gray-400">
								Imágenes (Max 5MB)
							</p>
						</>
					)}
				</div>
			</label>
		</div>
	);
}