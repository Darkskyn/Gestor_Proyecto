import React from 'react'
import Sidebar from '../../componentes/Sidebar'
import Header from './componentes/Header'
import Menu_calendar from './componentes/Menu_calendar'
import Footer_calendar from './componentes/footer_Calendar'

const Calendario = () => {
    return (
        <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
          <Sidebar />
          <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 h-[100vh] overflow-y-scroll">
           <Header />
           <div className="pt-5">  
            <Menu_calendar />
           </div>
           <div className="mt-48">
            <Footer_calendar />
            </div>
          </main>
        </div>
      )
    }

export default Calendario
