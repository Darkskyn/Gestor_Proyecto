import React from 'react'
import Sidebar from '../componentes/Sidebar'
import foto1 from '../../../assets/tecnologia3.jpg'
import Header from './componentes/Header'
import Dash from './componentes/dash'

const Auditoria = () => {
  return (
    <>
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      <Sidebar/>
      <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 h-screen overflow-y-scroll" style={{ backgroundImage: `url(${foto1})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="flex justify-between items-center mb-4">
      <Header />
      </div>
      <Dash />
      </main>
    </div>
    </>
  )
}

export default Auditoria
