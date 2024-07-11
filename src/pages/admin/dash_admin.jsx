import React from 'react'
import Sidebar from './componentes/Sidebar'
import Estructura from './componentes/Estructura'

const dash_admin = () => {
    return (
      <>
        <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
          <Sidebar/>
        <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 h-[100vh] overflow-y-scroll">
          <Estructura />
        </main>
        </div>
      </>
    );
  }

export default dash_admin
