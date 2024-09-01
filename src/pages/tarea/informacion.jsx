import {React,useEffect,useState} from 'react'
import Sidebar from '../../componentes/Sidebar'
import Header from './componentes/head'
import Info_Tarea from './componentes/Info_Tarea'
import Footer_tarea from './componentes/footer_tarea'


const informacion = () => {

    const [idtarea, setidtarea] = useState("");
  
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      setidtarea(urlParams.get('tareaId'))
      
    }, []);

  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      <Sidebar />
      <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 h-[100vh] overflow-y-scroll">
       <Header idtarea={idtarea}/>
       <div className="mt-12">  
       <Info_Tarea idtarea={idtarea}/>
       </div>
       <div className="mt-32">
        <Footer_tarea />
        </div>
      </main>
    </div>
  )
}

export default informacion
