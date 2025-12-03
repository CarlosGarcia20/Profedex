import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { IoPeople, IoSchool, IoBook, IoTrendingUp } from "react-icons/io5";
import { motion } from "framer-motion";
import { APP_NAME } from '../../config/constants';

// Datos de ejemplo
const dataCarreras = [
    { name: 'Sistemas', maestros: 12 },
    { name: 'Industrial', maestros: 8 },
    { name: 'Gestión', maestros: 5 },
    { name: 'Mecatrónica', maestros: 10 },
];
const dataStatus = [
    { name: 'Activos', value: 400 },
    { name: 'Inactivos', value: 30 },
];

const COLORS = ['#f43f5e', '#fbbf24', '#3b82f6', '#10b981'];

export default function AdminDashboard() {
    return (
        <div className="space-y-6 text-gray-700 dark:text-gray-200">

            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-rose-400 dark:text-yellow-400">Dashboard General</h2>
                    <p className="opacity-70">Resumen de actividad de {APP_NAME} </p>
                </div>
                <div className="text-sm bg-rose-100 text-rose-500 dark:bg-yellow-500/10 dark:text-yellow-400 px-3 py-1 rounded-full border border-rose-200 dark:border-yellow-500/20">
                    Última actualización: Hoy
                </div>
            </div>

            {/* TARJETAS (KPIS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Maestros" value="42" icon={<IoPeople />} trend="+4 este mes"
                    color="bg-purple-500"
                />
                <StatCard
                    title="Alumnos" value="1,240" icon={<IoSchool />} trend="+12% vs ayer"
                    color="bg-blue-500"
                />
                <StatCard
                    title="Materias" value="86" icon={<IoBook />} trend="3 nuevas"
                    color="bg-green-500"
                />
                <StatCard
                    title="Visitas" value="15.3k" icon={<IoTrendingUp />} trend="Récord"
                    color="bg-rose-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 bg-white dark:bg-[#29314a] p-6 rounded-xl shadow-md border border-gray-100 dark:border-white/5 transition-colors duration-300">
                    <h3 className="text-lg font-bold mb-4">Maestros por Carrera</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataCarreras}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                <XAxis dataKey="name" stroke="#888" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee' }}
                                />
                                <Bar dataKey="maestros" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#29314a] p-6 rounded-xl shadow-md border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center transition-colors duration-300">
                    <h3 className="text-lg font-bold mb-4 self-start">Estatus de Usuarios</h3>
                    <div className="h-48 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataStatus} cx="50%" cy="50%"
                                    innerRadius={60} outerRadius={80}
                                    paddingAngle={5} dataKey="value"
                                >
                                    {dataStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold dark:text-white">96%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend, color }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-[#29314a] p-6 rounded-xl shadow-md border border-gray-100 dark:border-white/5 relative overflow-hidden group transition-colors duration-300"
        >
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <p className="text-sm opacity-70 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg text-white shadow-lg ${color} bg-opacity-90`}>
                    <span className="text-xl">{icon}</span>
                </div>
            </div>

            <div className="mt-4 flex items-center text-xs font-medium">
                <span className="text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded flex items-center gap-1">
                    {trend}
                </span>
                <span className="opacity-60 ml-2">vs mes anterior</span>
            </div>
        </motion.div>
    );
}