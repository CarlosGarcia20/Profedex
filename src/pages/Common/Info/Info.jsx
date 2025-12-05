import Header from "../../../components/header/HeaderGeneral";

const teachers = [
    {
        id: 1,
        name: "María González",
        popularity: 100,
        subjects: "Matemáticas, Álgebra, Habilidades lógico-matemáticas",
        image: null,
    },
    {
        id: 2,
        name: "Carlos López",
        popularity: 95,
        subjects: "Programación, JavaScript, Desarrollo Web",
        image: null,
    },
    {
        id: 3,
        name: "Ana Martínez",
        popularity: 98,
        subjects: "Inglés, Lectura y comprensión, Gramática",
        image: null,
    }
];


const InfoMaestros = () => {
    return (
        <div className="min-h-screen bg-[#dfe3ea] flex flex-col">
            <Header titulo="Información de los profesores" />

            <div className="p-8 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

                    {teachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            className="
                            bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.15)]
                            border border-yellow-400
                            hover:shadow-[0_6px_30px_rgba(0,0,0,0.25)]
                            transition-all duration-300
                            overflow-hidden
                            "
                        >

                            {/* Top stripe */}
                            <div className="bg-yellow-300/70 p-3 text-right pr-5">
                                <span className="font-semibold text-gray-800">
                                    Popularity: <span className="text-black">{teacher.popularity}</span>
                                </span>
                            </div>

                            <div className="p-6 flex flex-col items-center">

                                {/* Imagen */}
                                <div className="
                                    w-44 h-40 mb-4 rounded-lg bg-gray-300 border-2 border-[#1c2833]
                                    flex items-center justify-center text-gray-700
                                ">
                                    {teacher.image ? (
                                        <img
                                            src={teacher.image}
                                            alt={teacher.name}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        "Sin foto"
                                    )}
                                </div>

                                {/* Nombre */}
                                <p className="font-extrabold text-lg text-gray-900 text-center">
                                    {teacher.name}
                                </p>

                                {/* Separador glow */}
                                <div className="h-[2px] w-3/4 bg-[#1c2833] mt-2 mb-3 shadow-[0_0_6px_#1c2833]"></div>

                                {/* Materias */}
                                <p className="text-sm text-center text-gray-700 leading-tight">
                                    <strong>Materias que imparte / habilidades:</strong><br />
                                    {teacher.subjects}
                                </p>

                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default InfoMaestros;