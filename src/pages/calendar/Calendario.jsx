import React, { useState, useEffect } from 'react';
import Sidebar from '../../componentes/Sidebar'
import Header from './componentes/Head'
import Calendar from './componentes/calendar'
import Footer_calendar from './componentes/footer_Calendar'

const Calendario = () => {

    const [idproyect, setidproyect] = useState("");
    useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setidproyect(urlParams.get('idproyect'))
    
    
  }, []);

    return (
        <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
          <Sidebar />
          <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 h-[100vh] overflow-y-scroll">
           <Header idproyect={idproyect}/>
           <div className="pt-5">  
            <Calendar idproyect={idproyect}/>
           </div>
           <div className="mt-48">
            <Footer_calendar />
            </div>
          </main>
        </div>
      )
    }

export default Calendario
