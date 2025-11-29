export default function AdminSubjects() {
    return (
        <div
            className="rounded-xl shadow-lg border border-white/5 overflow-hidden transition-colors duration-300"
        >
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-lg dark:text-white">Materias</h3>
                <button
                    className="text-gray-900 text-sm px-4 py-2 rounded-lg shadow-md transition-all hover:opacity-90 font-bold dark:text-white hover:dark:opacity-65"
                >
                    + Agregar Nueva
                </button>
            </div>
            <table className="w-full text-left text-sm dark:text-white">
                <thead className="bg-black/20  uppercase text-xs font-semibold opacity-70">
                    <tr>
                        <th className="px-6 py-4">Carrera</th>
                        <th className="px-6 py-4">Año del plan</th>
                        <th className="px-6 py-4">Materia</th>
                        <th className="px-6 py-4">Código</th>
                        <th className="px-6 py-4">Estatus</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    <tr className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium">Ing</td>
                        <td className="px-6 py-4 font-medium">Ing</td>
                        <td className="px-6 py-4 font-medium">Ing</td>
                        <td className="px-6 py-4 font-medium">Ing</td>
                        <td className="px-6 py-4 font-medium">Ing</td>
                        <td className="px-6 py-4 font-medium text-right">Ing</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}