import React from 'react'
import Header from "../componentes/Header"
import Sidebar from "../componentes/Sidebar";
import { RiLineChartLine, RiHashtag } from "react-icons/ri";
import '../index.css';
import foto2 from '../assets/logo-removebg-preview (1).png'
/* import { Outlet } from 'react-router-dom' */

const dash = () => {
  return (
    
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
    <Sidebar />
    <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 h-[100vh] overflow-y-scroll">
      <Header />
      {/* Section 1 */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mt-10 gap-8">
        {/* Card 1 */}
        <div className="bg-[#0d30a1] p-8 rounded-xl text-gray-300 flex flex-col gap-6">
          <RiLineChartLine className="text-5xl" />
          <h4 className="text-2xl">Proyectos Culminados</h4>
          <span className="text-5xl text-white">&euro; 8,350</span>
          <span className="py-1 px-3 bg-primary-300/80 rounded-full">
            + 10% since last month
          </span>
        </div>
        {/* Card 2 */}
        <div className="p-4 bg-white rounded-xl flex flex-col justify-between gap-4 drop-shadow-2xl">
        <div className="flex items-center gap-4 bg-primary-100/10 rounded-xl p-4">
          <span className="bg-[#0d30a1] text-white text-2xl font-bold p-4 rounded-xl">
            98
          </span>
          <div>
            <h3 className="font-bold">Proy - Cursos</h3>
            <p className="text-gray-500">In top 30%</p>
          </div>
        </div>
        <div className="border-t border-gray-600 pt-4"></div>
        <div className="bg-primary-100/10 rounded-xl p-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-[#0d30a1] text-white text-2xl font-bold p-4 rounded-xl">
              32
            </span>
            <div>
              <h3 className="font-bold">Proy - Detenidos</h3>
              <p className="text-gray-500">8 this month</p>
            </div>
          </div>
        </div>
      </div>
        {/* Card 3 */}
        <div className="col-span-1 md:col-span-2 flex flex-col justify-between">
          <h1 className="text-2xl font-bold mb-8">Tus Proyectos</h1>
          <div className="bg-white p-8 rounded-xl shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <img
                src="https://img.freepik.com/foto-gratis/retrato-mujer-mayor-cerca_23-2149207185.jpg"
                className="w-14 h-14 object-cover rounded-full"
              />
              <div>
                <h3 className="font-bold">Logo design for Bakery</h3>
                <p className="text-gray-500">1 day remaining</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://img.freepik.com/foto-gratis/retrato-mujer-mayor-cerca_23-2149207185.jpg"
                className="w-14 h-14 object-cover rounded-full"
              />
              <div>
                <h3 className="font-bold">Logo design for Bakery</h3>
                <p className="text-gray-500">1 day remaining</p>
              </div>
            </div>
            <div className="flex justify-end">
              <a
                href="#"
                className="hover:text-primary-100 transition-colors hover:underline"
              >
                Ver todo los Proyectos
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Section 2 */}
      <section className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-8">
        <div>
          <h1 className="text-2xl font-bold mb-8">Eventos Agendados</h1>
          <div className="bg-white p-8 rounded-xl shadow-2xl mb-8 flex flex-col gap-8">
            {/* Card 1 */}
            <div className="grid grid-cols-1 xl:grid-cols-4 items-center gap-4 mb-4">
              <div className="col-span-2 flex items-center gap-4">
                <img
                  src="https://img.freepik.com/foto-gratis/hombre-joven-hermoso-contento-camiseta-azul-que-senala-lado_1262-17845.jpg"
                  className="w-14 h-14 object-cover rounded-xl"
                />
                <div>
                  <h3 className="font-bold">Alexander Williams</h3>
                  <p className="text-gray-500">JQ Holdings</p>
                </div>
              </div>
              <div>
                <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full font-medium">
                  Paid
                </span>
              </div>
              <div>
                <span className="font-bold">&euro; 1,200.87</span>
              </div>
            </div>
            {/* Card 2 */}
            <div className="grid grid-cols-1 xl:grid-cols-4 items-center gap-4 mb-4">
              <div className="col-span-2 flex items-center gap-4">
                <img
                  src="https://img.freepik.com/foto-gratis/alegre-joven-deportista-posando-mostrando-pulgares-arriba-gesto_171337-8194.jpg"
                  className="w-14 h-14 object-cover rounded-xl"
                />
                <div>
                  <h3 className="font-bold">Jhon Philips</h3>
                  <p className="text-gray-500">Inchor Techs</p>
                </div>
              </div>
              <div>
                <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full font-medium">
                  Late
                </span>
              </div>
              <div>
                <span className="font-bold">&euro; 12,998.88</span>
              </div>
            </div>
          </div>
        
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-8">Recomendaciones Proyectos</h1>
          <div className="bg-white p-8 rounded-xl shadow-2xl mb-8 flex flex-col gap-8 h-60">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src="https://img.freepik.com/foto-gratis/retrato-mujer-mayor-cerca_23-2149207185.jpg"
                  className="w-14 h-14 object-cover rounded-full"
                />
                <div>
                  <h3 className="font-bold">Thomas Martin</h3>
                  <p className="text-gray-500">Updated 10m ago</p>
                </div>
              </div>
              <div>
                <span className="bg-[#0d30a1] py-2 px-4 rounded-full text-white">
                  Design
                </span>
              </div>
            </div>
            <div>
              <h5 className="text-lg font-bold">
                Need a designer to form branding essentials for my business.
              </h5>
              <p className="text-gray-500">
                Looking for a talented brand designer to create all the
                branding materials my new startup.
              </p>
            </div>
            
          </div>
        </div>
      </section>
          {/*Div footer */}
          <div className="bg-[#0d30a1] text-gray-300 p-8 rounded-xl shadow-2xl flex items-center justify-between flex-wrap xl:flex-nowrap gap-8">
              <div className="flex items-center gap-4">
                <div>
                  <RiHashtag className="text-4xl -rotate-12" />
                </div>
                <img className="w-64" src={foto2} alt="Foto_Bancamiga" />
              </div>
                <div>
                  <h5 className="font-bold text-white">Cada segundo,Cuenta</h5>
                </div>
              </div>
    </main>
  </div>

  )
}

export default dash
