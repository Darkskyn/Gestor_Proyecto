import React, { useState,useEffect } from "react";
import Sidebar from '../../componentes/Sidebar'
import { FiServer } from "react-icons/fi";
import Formulario from './componentes/formulario';
import Footer_Proyect from './componentes/footer_Proyect'

const Crear_Proyect = () => {

  const [idproyect, setidproyect] = useState("");
  const [nombre_proyecto, setnombre_proyecto]=useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setidproyect(urlParams.get('projectId'))
    setnombre_proyecto(urlParams.get('projectName'))
    
  }, []);

  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      <Sidebar />
      <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 h-[100vh] overflow-y-scroll">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-Black text-2xl md:text-3xl font-bold flex items-center">
        <FiServer className="mr-2" />
        Crear Nuevo Proyecto
      </h1>
      </header>
      <div className="mt-6"> 
      <Formulario idproyect={idproyect} proyecto={nombre_proyecto}  />
      </div>
      <div className="mt-8">
        <Footer_Proyect/>
        </div>
      </main>
    </div>
  )
}

export default Crear_Proyect
