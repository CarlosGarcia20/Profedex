import Profedex from "../../assets/images/Profedex.png"

export default function Header() {
    return (
      <header className="bg-red-600 text-white p-2 flex justify-between items-center shadow-md border border-gray-950">
        <img src={Profedex} className="h-24" />

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
    );
}