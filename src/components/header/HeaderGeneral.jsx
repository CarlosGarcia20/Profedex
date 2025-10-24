import React from "react";

const HeaderGeneral = ({ titulo }) => {
  return (
    <header className="bg-yellow-300 h-22 flex items-center pl-6" style={{ boxShadow: '0 5px 10px -3px rgba(0,0,0,0.5)' }}>
        <h1
            className="text-5xl font-bold text-white"
            style={{ WebkitTextStroke: '1px black' }}
        >
            {titulo}
        </h1>
    </header>
  );
};

export default HeaderGeneral;