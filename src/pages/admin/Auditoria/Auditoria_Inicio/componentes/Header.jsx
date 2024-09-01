import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para la navegación
import { FcNews } from 'react-icons/fc';
import { AiOutlineArrowLeft } from 'react-icons/ai'; // Importar el ícono de flecha

const Header = () => {
  const navigate = useNavigate(); // Hook para manejar la navegación

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 pt-10">
      <button
        onClick={() => navigate(-1)} // Navegar a la página anterior
        className="flex items-center p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
      >
        <AiOutlineArrowLeft className="text-3xl" />
      </button>
      <h1 className="text-Black text-3xl md:text-4xl font-bold flex items-center">
        <FcNews className="mr-3 text-4xl md:text-5xl" />
        Auditoria Recursos <span className="text-primary-100"></span>
      </h1>
    </header>
  );
};

export default Header;
