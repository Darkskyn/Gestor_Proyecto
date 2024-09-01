import React, { useState, useEffect } from "react";
import Sidebar from "../../componentes/Sidebar";
import Formulario from './componentes/Formulario';
import Footer_tarea from './componentes/footer_recurso';
import { FiServer } from "react-icons/fi";

const Dash = () => {
  const [idproyect, setidproyect] = useState("");
  const [nombre_proyecto, setnombre_proyecto] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setidproyect(urlParams.get('projectId'));
    setnombre_proyecto(urlParams.get('projectName'));
  }, []);

  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      <Sidebar />
      <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 flex flex-col">
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <h1 className="text-black text-2xl md:text-3xl font-bold flex items-center uppercase">
            <FiServer className="mr-2" />
            CREAR RECURSOS DEL PROYECTO:
            <span className="bg-blue-600 text-white px-2 py-1 rounded ml-2">
              {nombre_proyecto}
            </span>
          </h1>
        </header>
          <Formulario idproyect={idproyect} proyecto={nombre_proyecto} />
          <Footer_tarea />
        
      </main>
    </div>
  );
}

export default Dash;

