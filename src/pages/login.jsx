import React from 'react'
import Navbar from '../componentes/navbar'
import Seccion from '../componentes/Section'
import Footer from '../componentes/footer';
import foto1 from '../assets/programa.jpeg'

const login = () => {
  return (
    <div className="bg-[#0d47a1] min-h-screen flex flex-col bg-cover bg-center"
    style={{backgroundImage: `url(${foto1})`,}}>
       <Navbar />
          <div className='mt-[-150px]'>
          <Seccion/>
          </div>
          <div className=''>
          <Footer/>
          </div>
    </div>
  )
}

export default login
