import React, { useState,useEffect } from "react";
import Sidebar from '../../componentes/Sidebar'
import { FiServer } from "react-icons/fi";
import Formulario from './componentes/formulario';
import Footer_Proyect from './componentes/footer_Proyect'
import Header from './componentes/Header2'
import Informacion from './componentes/informacion'
const Info_Proyect = () => {
  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      <Sidebar />

      <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 h-[100vh] overflow-y-scroll">
        <Header/>
        <div className="pt-5">      
        <Informacion />
        <div className="mt-24">
        <Footer_Proyect />
        </div>
        </div>
        
        
      </main>
    </div>
  )
}

export default Info_Proyect
