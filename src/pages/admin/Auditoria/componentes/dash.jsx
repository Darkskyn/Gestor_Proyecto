import React from 'react';
import foto1 from '../../../../assets/logo-removebg-preview (1).png';
import foto3 from '../../../../assets/tareas.png';
import { FcBusinessman } from "react-icons/fc";
import { FcVoicePresentation } from "react-icons/fc";
import { FcLock } from "react-icons/fc";
import { FcTemplate } from "react-icons/fc";
import { FcEngineering } from "react-icons/fc";
import { FcMindMap } from "react-icons/fc";
import foto2 from '../../../../assets/recurso.png'
import { Link } from 'react-router-dom'

const Dash = () => {
  return (
    <div className="py-16">
      <div className="mx-auto px-6 max-w-6xl text-gray-500">
        <div className="relative">
          <div className="grid gap-5 grid-cols-6">
            <div className="col-span-full lg:col-span-2 overflow-hidden flex relative p-8 rounded-xl bg-blue-700  border-green-600 border-separate border-4	 ">
              <div className="size-fit m-auto relative">
                <div className="relative h-24 w-56 flex items-center">
                  <svg className="absolute inset-0 w-full h-full text-gray-400 dark:text-gray-600" viewBox="0 0 254 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                    
                  </svg>
                  <span className="w-fit block mx-auto text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-blue-300 to-pink-600 dark:from-blue-400 dark:to-pink-400"> <img src={foto1} alt="Logo" className="mx-auto mt-10" /></span>
                </div>
                <h2 className="mt-6 text-center font-semibold text-gray-950 dark:text-white text-3xl"></h2>
              </div>
            </div>

           
            <div className="col-span-full sm:col-span-3 lg:col-span-2 overflow-hidden relative p-8 rounded-xl bg-green-600 border border-green-600 dark:border-gray-800">
            <Link to="/Admin_Proyecto">
              <div>
                <div className="relative aspect-square rounded-full size-32 flex border mx-auto bg-white dark:border-blue-700 before:absolute before:-inset-2 before:border dark:before:border-white/5 dark:before:bg-white/5 before:rounded-full">
                <FcMindMap className="text-gray-950 dark:text-white/5 rounded-full size-full"/>
                </div>
                <div className="mt-6 text-center relative z-10 space-y-2">
                  <h2 className="text-lg font-medium text-white transition ">Proyectos</h2>
                  <p className="dark:text-gray-300 text-gray-700">Registro de las modificaciones, aperturas, cierres y reactivaciones de proyectos.
                  </p>
                </div>
              </div>
              </Link>
            </div>
            

            <div className="col-span-full sm:col-span-3 lg:col-span-2 overflow-hidden relative p-8 rounded-xl bg-blue-700 border border-green-600 dark:border-gray-800 ">
            <Link to="/Admin_Tarea">
              <div>
              <div className="relative bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 rounded-lg w-32 h-36 flex items-center justify-center mx-auto">
              <img src={foto3} className="w-full h-full object-cover rounded-lg" alt="Descripción de la imagen" />
                </div>
                <div className="mt-4 text-center relative z-10 space-y-2">
                  <h2 className="text-lg font-medium text-gray-800 transition group-hover:text-purple-950 dark:text-white">Tareas</h2>
                  <p className="dark:text-gray-300 text-gray-700">Historial de los cambios efectuados en las tareas del proyecto.</p>
                </div>
              </div>
            </Link>
            </div>
            <div className="col-span-full lg:col-span-3 overflow-hidden relative p-8 rounded-xl bg-green-600 border border-gray-200 dark:border-gray-800 ">
            <Link to="/Admin_Recurso">
              <div className="grid sm:grid-cols-2">
                <div className="flex flex-col justify-between relative z-10 space-y-12 lg:space-y-6">
                <div className="flex items-left justify-left">
                    <div className="relative aspect-square rounded-full size-20 flex items-center justify-center border bg-white dark:border-white/10 before:absolute before:-inset-2 before:border dark:before:border-white/5 dark:before:bg-white/5 before:rounded-full">
                        <FcEngineering className="text-gray-950 dark:text-white/5 rounded-full size-full" />
                    </div>
                    </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium text-gray-800 transition group-hover:text-purple-950 dark:text-white">Recurso</h2>
                    <p className="text-white "> Documentación de las asignaciones, liberaciones y modificaciones de los recursos</p>
                  </div>
                </div>
                <div className="overflow-hidden relative mt-6 sm:mt-auto h-48 sm:ml-6 py-6 p-6 border rounded-md bg-white dark:border-white/10">
                  <img src={foto2} className="w-full h-full object-cover rounded-tl-lg" alt="Descripción de la imagen" />
              </div>
              </div>
              </Link>
            </div>
            <div className="col-span-full lg:col-span-3 overflow-hidden relative p-8 rounded-xl bg-green-600 border-gray-200 dark:border-gray-800 ">
            <Link to="/Admin_Recurso">
              <div className="h-full grid sm:grid-cols-2">
                <div className="flex flex-col justify-between relative z-10 space-y-12 lg:space-y-6">
                <div className="flex items-left justify-left">
                <div className="relative aspect-square rounded-full size-20 flex items-center justify-center border bg-gradient-to-br from-blue-400 to-blue-600 dark:bg-gradient-to-br dark:from-blue-600 dark:to-blue-800 dark:border-white before:absolute before:-inset-2 before:border dark:before:border-blue-500 before:rounded-full">
                    <FcBusinessman size={64} /> {/* Ajusta el tamaño según necesites */}
                </div>
                </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium text-gray-800 transition group-hover:text-purple-950 dark:text-white">Inicios de Sesion</h2>
                    <p className=" text-white">Seguimiento de los inicios y cierres de sesión de los usuarios.</p>
                  </div>
                </div>
                <div className="mt-6 relative sm:-mr-[--card-padding] sm:-my-8 before:absolute before:w-px before:inset-0 before:mx-auto before:bg-gray-200 dark:before:bg-gray-800">
                  <div className="relative space-y-6 py-6 flex flex-col justify-center h-full">
                    <div className="flex items-center justify-end gap-2 w-[calc(50%+0.875rem)] relative">
                      <span className="h-fit text-xs block px-2 py-1 shadow-sm border rounded-md bg-blue-700 dark:border-white/5 dark:text-white">Ingreso Datos</span>
                      <div className="size-7 ring-4 ring-white dark:ring-[--card-dark-bg] bg-white rounded-xl">
                        <FcVoicePresentation className="rounded-full border border-gray-950/5 dark:border-white/5 size-full" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-[calc(50%-1rem)] relative">
                      <div className="size-8 ring-4 ring-white dark:ring-[--card-dark-bg] ">
                        <FcLock className="rounded-full border border-gray-950/5 dark:border-white/5 size-full" />
                      </div>
                      <span className="h-fit text-xs block px-2 py-1 shadow-sm border rounded-md bg-blue-700 dark:border-white/5 dark:text-white">Validacion</span>
                    </div>
                    <div className="flex items-center justify-end gap-2 w-[calc(50%+0.875rem)] relative">
                      <span className="h-fit text-xs block px-2 py-1 shadow-sm border rounded-md bg-blue-700 dark:border-white/5 dark:text-white">Dashboard</span>
                      <div className="size-7 ring-4 ring-white dark:ring-[--card-dark-bg] bg-white rounded-xl">
                        <FcTemplate className="rounded-full border border-gray-950/5 dark:border-white/5 size-full"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dash;
