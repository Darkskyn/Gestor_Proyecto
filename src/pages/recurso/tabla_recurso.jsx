import React, { useState, useEffect } from 'react';
import Sidebar from "../recurso/componentes/Sidebar";
import { FiServer } from "react-icons/fi";
import Tabla from "./componentes/tabla"
import Footer_tarea from './componentes/footer_recurso'
import { Link } from 'react-router-dom';

const Dash = () => {
  const [idproyect, setidproyect] = useState("");
  const [nombre_proyecto, setnombre_proyecto] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idproyectFromUrl = urlParams.get('idproyecto');
    setidproyect(parseInt(idproyectFromUrl));
    setnombre_proyecto(urlParams.get('proyecto'));
  }, []);

  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      <Sidebar />

      <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 h-[100vh] overflow-y-scroll">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center text-black">
            <FiServer className="mr-2" />
            Tus Recursos Creados
          </h1>
          <Link to={`/recurso?projectId=${idproyect}&projectName=${encodeURIComponent(nombre_proyecto)}`} className="flex items-center bg-gradient-to-r from-[#0d17a1] to-[#00ff04d7] border border-fuchsia-00 hover:border-violet-100 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300">
            <svg className="w-5 h-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="text-white">Crear Nuevo Recurso</p>
          </Link>
        </header>

        <div className="mt-6">
          <Tabla nombre_proyecto={nombre_proyecto} idproyect={idproyect} />
        </div>

        
        <div className="mt-8">
        <Footer_tarea />
        </div>
      </main>    
    </div>
  );
}

export default Dash;
