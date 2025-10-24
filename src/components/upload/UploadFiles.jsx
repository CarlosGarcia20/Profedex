export default function UploadFiles() {
    return (
      <div className="border-2 border-dashed border-blue-400 p-8 rounded-lg text-center bg-white shadow-sm">
        <input type="file" id="file-upload" multiple className="hidden" />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center space-y-3">
            <svg
              className="w-16 h-16 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="text-xl font-semibold text-gray-700">
              Arrastra y suelta tus archivos aquí
            </p>
            <p className="text-gray-500">
              o{" "}
              <span className="text-blue-600 font-medium hover:underline">
                haz clic para seleccionar
              </span>
            </p>
            <p className="text-sm text-gray-400">
              Imágenes, Videos, Audios, Documentos (Max 10MB)
            </p>
          </div>
        </label>
      </div>
    );
}