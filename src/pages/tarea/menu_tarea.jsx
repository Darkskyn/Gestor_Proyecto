import React from 'react'
import Sidebar from '../../componentes/Sidebar'
import Header from './componentes/Header'
import Tareas from './componentes/tareas'
import Footer_tarea from './componentes/footer_tarea'

const menu_tarea = () => {
  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      <Sidebar />
      <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 h-[100vh] overflow-y-scroll">
       <Header />
       <div className="pt-5">  
        <Tareas />
       </div>
       <div className="mt-48">
        <Footer_tarea />
        </div>
      </main>
    </div>
  )
}

export default menu_tarea
