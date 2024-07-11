import React, { useState, useEffect } from "react";
import Sidebar from "../recurso/componentes/Sidebar";
import Formulario from './componentes/Formulario';
import Footer_tarea from './componentes/footer_recurso';
import { FiServer } from "react-icons/fi";

const Dash = () => {
  const [idproyect, setidproyect] = useState("");
  const [nombre_proyecto, setnombre_proyecto] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setidproyect(urlParams.get('projectId'))
    setnombre_proyecto(urlParams.get('projectName'))
  }, []);

  return (
    <div className="main-content grid grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 min-h-screen bg-[#0d30a1]">
      <Sidebar />

      <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 overflow-hidden">
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <h1 className="text-black text-2xl md:text-3xl font-bold flex items-center">
            <FiServer className="mr-2" />
            Crear Recursos del Proyecto: {nombre_proyecto}
          </h1>
          {/* Add more header content if needed */}
        </header>

        <section className="mb-8 overflow-auto">
          <Formulario idproyect={idproyect} proyecto={nombre_proyecto} />
        </section>

        {/* Add more sections or content here as necessary */}

      </main>

      <footer className="bg-gray-100 text-center py-3 col-span-full">
        <Footer_tarea />
      </footer>
    </div>
  )
}

export default Dash;
