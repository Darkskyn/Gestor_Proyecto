import React, { useState, useEffect } from "react";
// Icons
import { RiSearch2Line } from "react-icons/ri";
import { FcBusinessman } from "react-icons/fc";
import axios from 'axios';

const API_URL = typeof process !== 'undefined' && process.env.API_URL ? process.env.API_URL : 'http://localhost:1337';

const Header = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    let isMounted = true; // Flag to track component mount status

    const getUserData = async () => {
      try {
        const tokenDeAutenticacion = localStorage.getItem('authToken');
        const configuracion = {
          headers: {
            'Authorization': `Bearer ${tokenDeAutenticacion}`
          }
        };

        const respuestaDeUsuario = await axios.get(`${API_URL}/api/users/me`, configuracion);
        const datosDeUsuario = respuestaDeUsuario.data;

        if (isMounted) {
          setUsuario(datosDeUsuario);
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    getUserData();

    return () => {
      isMounted = false; // Cleanup flag when component unmounts
    };
  }, []);

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white shadow-md">
      <h1 className="text-black text-2xl md:text-3xl font-bold flex items-center uppercase font-sans">
        <FcBusinessman className="mr-2 text-3xl" />
        Bienvenido
        <span className="text-blue-500 ml-2 font-bold">{(usuario?.username || 'Usuario').toUpperCase()}</span>
      </h1>
      <form className="w-full md:w-auto">
        <div className="relative">
          <RiSearch2Line className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-600" />
          <input
            type="text"
            className="bg-green-500 outline-none py-2 pl-8 pr-4 rounded-xl w-full md:w-[400px] text-white placeholder-white font-bold font-sans"
            placeholder="Buscar Proyecto"
          />
        </div>
      </form>
    </header>
  );
};

export default Header;

