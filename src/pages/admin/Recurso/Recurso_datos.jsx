import React, { useState, useEffect } from "react";
import Sidebar from './componentes/Sidebar';
import Header_recurso from './componentes/Header_recurso';
import foto1 from '../../../assets/tecnologia.jpg';
import Menu_recurso from "./componentes/menu_recurso";

const Recurso_datos = () => {
  const [idrecurso, setidrecurso] = useState("");
  const [recurso, setnombre_recurso] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setidrecurso(urlParams.get('idrecurso'));
    setnombre_recurso(urlParams.get('recurso'));

  }, []);

  return (
    <>
      <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
        <Sidebar />
        <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 h-screen overflow-y-scroll" style={{ backgroundImage: `url(${foto1})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="flex justify-between items-center mb-4">
            <Header_recurso nombreRecurso={recurso} />
          </div>
          <div className=''>
          <Menu_recurso idrecurso={idrecurso} rescurso={recurso} />
          </div>
        </main>
      </div>
    </>
  );
};

export default Recurso_datos;