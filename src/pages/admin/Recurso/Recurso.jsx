import React from 'react'
import Menu from './componentes/menu'
import Sidebar from './componentes/Sidebar'
import Header from './componentes/Header'
import foto2 from '../../../assets/tecnologia2.png'
const Recurso = () => {
  return (
    <>
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      <Sidebar/>
      <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 h-screen overflow-y-scroll" style={{ backgroundImage: `url(${foto2})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="flex justify-between items-center mb-4">
      <Header />
      </div>
      <div className='pt-20'>
      <Menu/>
      </div>
      </main>
    </div>
    </>
  )
}

export default Recurso
