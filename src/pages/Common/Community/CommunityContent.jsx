import DashboardLayout from "../../../layouts/DashboardLayout"
import HeaderGeneral from "../../../components/header/HeaderGeneral"
import UploadFiles from "../../../components/upload/UploadFiles";

export default function CommunityContent() {
	return (
		<div>
			<div className="h-full bg-gray-300 flex flex-col">
				<HeaderGeneral titulo="Comunidad" />
				<div className="p-6 space-y-8">
					<UploadFiles />

					<h2 className="text-2xl font-bold text-blue-700">Tus archivos</h2>

					<div
						id="uploaded-files-container"
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
					>
						<div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-300">
							<i className="fas fa-image text-4xl text-green-500"></i>{" "}
							<div className="flex-1">
								<p className="font-medium text-gray-800 truncate">
									foto_vacaciones.jpg
								</p>
								<p className="text-sm text-gray-500">2.3 MB</p>
							</div>
							<button className="text-gray-400 hover:text-red-500 transition-colors">
								<i className="fas fa-trash-alt text-lg"></i>
							</button>
						</div>

						<div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-300">
							<i className="fas fa-image text-4xl text-green-500"></i>{" "}
							<div className="flex-1">
								<p className="font-medium text-gray-800 truncate">
									foto_vacaciones.jpg
								</p>
								<p className="text-sm text-gray-500">2.3 MB</p>
							</div>
							<button className="text-gray-400 hover:text-red-500 transition-colors">
								<i className="fas fa-trash-alt text-lg"></i>
							</button>
						</div>

						<div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-300">
							<i className="fas fa-image text-4xl text-green-500"></i>{" "}
							<div className="flex-1">
								<p className="font-medium text-gray-800 truncate">
									foto_vacaciones.jpg
								</p>
								<p className="text-sm text-gray-500">2.3 MB</p>
							</div>
							<button className="text-gray-400 hover:text-red-500 transition-colors">
								<i className="fas fa-trash-alt text-lg"></i>
							</button>
						</div>
					</div>

					<h2 className="text-2xl font-bold text-blue-700">Archivos de la Comunidad</h2>

					<div
						id="uploaded-files-container"
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
					>
						<div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-300">
							<i className="fas fa-image text-4xl text-green-500"></i>{" "}
							<div className="flex-1">
								<p className="font-medium text-gray-800 truncate">
									foto_vacaciones.jpg
								</p>
								<p className="text-sm text-gray-500">2.3 MB</p>
							</div>
							<button className="text-gray-400 hover:text-red-500 transition-colors">
								<i className="fas fa-trash-alt text-lg"></i>
							</button>
						</div>

						<div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-300">
							<i className="fas fa-image text-4xl text-green-500"></i>{" "}
							<div className="flex-1">
								<p className="font-medium text-gray-800 truncate">
									foto_vacaciones.jpg
								</p>
								<p className="text-sm text-gray-500">2.3 MB</p>
							</div>
							<button className="text-gray-400 hover:text-red-500 transition-colors">
								<i className="fas fa-trash-alt text-lg"></i>
							</button>
						</div>

						<div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-300">
							<i className="fas fa-image text-4xl text-green-500"></i>{" "}
							<div className="flex-1">
								<p className="font-medium text-gray-800 truncate">
									foto_vacaciones.jpg
								</p>
								<p className="text-sm text-gray-500">2.3 MB</p>
							</div>
							<button className="text-gray-400 hover:text-red-500 transition-colors">
								<i className="fas fa-trash-alt text-lg"></i>
							</button>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
}