export function CommunityCard({ file }) {
    const formattedDate = new Date(file.created_at).toLocaleDateString("es-ES", {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            {/* 1. La Imagen (Preview) */}
            <div className="h-48 overflow-hidden bg-gray-100 relative group">
                <img
                    src={file.image_url}
                    alt={`Subido por ${file.nickname}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
            </div>

            {/* 2. Información del Usuario */}
            <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            @{file.nickname}
                        </span>
                        <span className="text-xs text-gray-400">
                            {formattedDate}
                        </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm truncate" title={file.name}>
                        {file.name}
                    </h3>
                </div>

                {/* Botones de acción (ejemplo) */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                    <a
                        href={file.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
                    >
                        Ver completo <i className="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>
        </div>
    );
}