import React from 'react'
import Header from './Componentes/Header'
import Sidebar from '../../../componentes/Sidebar';
import Footer from './Componentes/footer';
import Tabla from './Componentes/tabla'

const Informe = () => {
  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
    <Sidebar />
    <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 flex flex-col">
      <Header />
      <div className="flex-grow pt-5">
      <Tabla />
      </div>
      <div className="pt-6"> 
        <Footer />
      </div>
    </main>
  </div>
  )
}

export default Informe
