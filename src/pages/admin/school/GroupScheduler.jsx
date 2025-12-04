import BaseModal from "../../../components/ui/BaseModal";
import { useState, useEffect } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import GroupScheduleCards from "../../../components/admin/GroupSchedulerCard";

export default function AdminGroupScheduler() {
    const [groups, setGroups] = useState([]);

    const [selectedGroup, setSelectedGroup] = useState("-1");
    
    const fetchGroups = async() => {
        try {
            const response = await api.get('admin/groups');
            setGroups(response.data.data || response.data);
        } catch (error) {
            console.error();
        }
    }

    useEffect(() => {
        fetchGroups();
    }, [])

    return (
        <div className="text-black dark:text-white">
            <div className="text-black dark:text-white">
                <div className="rounded-xl shadow-lg border border-white/5 overflow-hidden transition-colors duration-300 bg-white dark:bg-[#313141]">

                    <div className="p-6 border-b border-white/10 flex flex-col lg:flex-row justify-between items-center bg-gray-50 dark:bg-[#3e3e50] gap-4">

                        <div className="w-full lg:w-1/3 flex justify-start">
                            <h3 className="font-bold text-lg text-gray-600 dark:text-white whitespace-nowrap">
                                Horarios de Grupo
                            </h3>
                        </div>

                        <div className="w-full lg:w-1/3 flex justify-center items-center gap-3">
                            <label className="text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap hidden md:block">
                                Grupo:
                            </label>
                            <div className="relative w-full md:w-64">
                                <select
                                    value={selectedGroup}
                                    onChange={(e) => setSelectedGroup(e.target.value)}
                                    className='w-full appearance-none bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm pl-4 pr-8 py-2 rounded-lg shadow-md transition-all cursor-pointer border-none outline-none focus:ring-2 focus:ring-yellow-600 text-center text-ellipsis overflow-hidden'
                                >
                                    <option value="-1">Todos</option>
                                    {groups.map(group => (
                                        <option key={group.id} value={group.id} className="bg-white text-gray-700 dark:bg-gray-700 dark:text-white">
                                            {group.major} - {group.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="p-6 min-h-[400px]">
                        <GroupScheduleCards groupId={1} />
                        {/* {selectedGroup !== "-1" ? (
                        <GroupScheduleCards groupId={selectedGroup} />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                            <IoCalendar className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-lg font-medium">Selecciona un grupo para ver sus horarios</p>
                            <p className="text-sm opacity-60">Usa el filtro de arriba para comenzar</p>
                        </div>
                    )} */}
                    </div>

                </div>
            </div>

            <BaseModal
                isOpen={false}
                onClose={false}
                // title={ editingSubject ? 'Editar Materia': 'Nueva Materia' }
                title={'Modal'}
                // subtitle={ editingSubject ? `Editando: ${editingSubject.name}` : 'Ingresa los datos de la materia.' }
                subtitle={'Si'}
            >
                <form className="space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Código / Clave</label>
                            <input
                                type="text"
                                name="code"
                                // value={formData.code}
                                // onChange={handleInputChange}
                                className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Ej: 1210"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Año del Plan</label>
                            <input
                                type="number"
                                name="plan_year"
                                // value={formData.plan_year}
                                // onChange={handleInputChange}
                                className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Ej: 2024"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre de la Materia</label>
                        <input
                            type="text"
                            name="name"
                            // value={formData.name}
                            // onChange={handleInputChange}
                            className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Ej: Cálculo Diferencial"
                            autoComplete='off'
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-1'>Descripción</label>
                        <textarea
                            typeof='text'
                            name='description'
                            // value={formData.description}
                            // onChange={handleInputChange}
                            className='w-full resize-none bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                            placeholder="Descripción de la materia (opcional)"
                            rows={3}
                        >
                        </textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Carrera / Especialidad</label>
                        <select
                            name='major_id'
                            // value={formData.major_id}
                            // onChange={handleInputChange}
                            className='w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white'
                            required
                        >
                            <option value="-1">Selecciona una carrera</option>
                            {/* {careers.map((career) => (
                                <option key={career.major_id} value={career.major_id}>
                                    {career.name}
                                </option>
                            ))} */}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Créditos</label>
                            <input
                                type="number"
                                name="credits"
                                // value={formData.credits}
                                // onChange={handleInputChange}
                                className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Ej: 8"
                                min={1}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Horas</label>
                            <input
                                type="number"
                                name="hours"
                                // value={formData.hours}
                                // onChange={handleInputChange}
                                className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Ej: 40"
                                min={1}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">N° Semestre al que pertenece</label>
                        <input
                            type="number"
                            name="semester"
                            // value={formData.semester}
                            // onChange={handleInputChange}
                            className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            min={1}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Estatus</label>
                        <select
                            name="active"
                            // value={formData.active}
                            // onChange={handleInputChange}
                            className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            <option value={'S'}>Activa</option>
                            <option value={'N'}>Inactiva (Baja Temporal)</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-white/10">
                        <button
                            type="button"
                            // onClick={closeModal}
                            className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors shadow-lg"
                        >
                            {/* {editingSubject ? 'Actualizar Materia' : 'Guardar Materia'} */}
                        </button>
                    </div>
                </form>
            </BaseModal>
        </div>
    );
}