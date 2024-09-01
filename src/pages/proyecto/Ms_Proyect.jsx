import React from 'react';
import Sidebar from '../../componentes/Sidebar';
import Header from './componentes/Header';
import Proyectos from './componentes/proyectos';
import Footer_Proyect from './componentes/footer_Proyect';

const Ms_Proyect = () => {
  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      <Sidebar />
      <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 h-[100vh] overflow-y-scroll">
        <Header />
        <div className="flex-grow pt-5">
          <Proyectos />
        </div>
        <div className="mt-8">
        <Footer_Proyect />
        </div>
      </main>
    </div>
  );
};

export default Ms_Proyect;