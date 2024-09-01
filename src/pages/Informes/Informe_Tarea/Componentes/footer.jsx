import React from 'react'
import foto2 from '../../../../assets/logo-removebg-preview (1).png'
import { RiHashtag } from "react-icons/ri";

const footer = () => {
  return (
    <div>
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
    </div>
  )
}

export default footer
