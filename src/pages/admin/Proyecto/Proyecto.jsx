import React, { useState, useEffect } from 'react';
import Sidebar from './componentes/Sidebar'
import Header from './componentes/Header'
import Tabla from './componentes/tabla'
import foto1 from '../../../assets/tecnologia2.jpg'

const Proyecto = () => {

  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setFiltro(urlParams.get('filtro') || '');
  }, []);

  return (
    <>
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      <Sidebar/>
      <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 h-screen overflow-y-scroll" style={{ backgroundImage: `url(${foto1})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="flex justify-between items-center mb-4">
      <Header />
      </div>
      <Tabla filtro={filtro}/>
      </main>
    </div>
  </>
  )
}

export default Proyecto
