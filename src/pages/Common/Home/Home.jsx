import profedex from "../../../assets/images/Profedex.png";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-red-600 text-white p-2 flex justify-between items-center shadow-md border border-gray-950">
        <img src={profedex} className="h-24" />

        <div className="flex items-center space-x-10">
          <div className="text-right">
            <div className="text-2xl font-semibold text-yellow-400">
              @Nombre de usuario
            </div>
            <div className="font-semibold text-gray-200">Rol del usuario</div>
          </div>
          <a
            href="#"
            className="p-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg
              className="w-14 h-14"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
          </a>
        </div>
      </header>
      
      <div className="flex flex-1">
        
        <aside className="w-20 bg-red-600 text-white flex flex-col justify-between items-center py-4 shadow-lg border border-gray-950">
          
          <nav className="flex flex-col items-center space-y-6">
            <a
              href="#"
              className="p-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </a>
            <a
              href="#"
              className="p-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
            </a>
            <a
              href="#"
              className="p-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
            </a>
            <a
              href="#"
              className="p-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </a>
          </nav>

          {/* Imagen inferior */}
          <div className="mb-4">
            <img
              src="https://via.placeholder.com/48x48.png?text=User"
              alt="Avatar de usuario"
              className="w-18 h-18 rounded-full border-2 border-white"
            />
          </div>
        </aside>

        {/* Aquí puedes poner el contenido principal */}
        <main className="flex-1 bg-gray-900 p-4">
          <h1 className="text-3xl font-bold text-white">Contenido principal</h1>
        </main>
      </div>
    </div>
  );
}
