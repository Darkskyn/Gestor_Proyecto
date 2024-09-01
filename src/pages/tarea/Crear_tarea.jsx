import React, { useState, useEffect } from "react";
import Sidebar from '../../componentes/Sidebar';
import { FiServer } from "react-icons/fi";
import Formulario from './componentes/Formulario';
import Footer_tarea from './componentes/footer_tarea';

const Crear_tarea = () => {
  const [idproyect, setidproyect] = useState("");
  const [estado, setestado_proyecto] = useState("");
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setidproyect(urlParams.get('idproyect'));
    setestado_proyecto(urlParams.get('estado_proyecto'));
  }, []);

  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      <Sidebar />
      <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 h-[100vh] overflow-y-scroll">
        <header className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-black text-2xl md:text-3xl font-bold flex items-center uppercase">
            <FiServer className="mr-2" />
            Crear Nueva Tarea
          </h1>
        </header>
        <div className="mt-8">
          <Formulario idproyect={idproyect} estado={estado} />
        </div>
        <div className="mt-24">
          <Footer_tarea />
        </div>
      </main>
    </div>
  );
}

export default Crear_tarea;
