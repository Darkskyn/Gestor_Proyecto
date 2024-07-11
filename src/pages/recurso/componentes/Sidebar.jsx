import React, { useState,useEffect } from "react";
import foto1 from '../../../assets/logo.png'
// Icons
import {
  RiHome3Line,
  RiFileCopyLine,
  RiPieChartLine,
  RiMore2Fill,
  RiCloseFill,
} from "react-icons/ri";
import { FiFileText,FiCalendar} from "react-icons/fi";
import { ImMail2 } from "react-icons/im";
import axios from 'axios';

const API_URL = typeof process !== 'undefined' && process.env.API_URL ? process.env.API_URL : 'http://localhost:1337';

const fetchData = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const config = {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    };
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const Sidebar = () => {
  const [data, setData] = useState([]);
const [usuario, setUsuario] = useState(null);
const [roles, setRoles] = useState([]);
const [rolDeUsuario, setRolDeUsuario] = useState(null);

useEffect(() => {
  const getData = async () => {
    try {
      const tokenDeAutenticacion = localStorage.getItem('authToken');
      const configuracion = {
        headers: {
          'Authorization': `Bearer ${tokenDeAutenticacion}`
        }
      };

const respuestaDeUsuario = await axios.get(`${API_URL}/api/users/me`, configuracion);
const datosDeUsuario = respuestaDeUsuario.data;
setUsuario(datosDeUsuario);
console.log('Usuario:', datosDeUsuario);

// Verificar si el usuario tiene un rol asignado
if (datosDeUsuario.role) {
  // Obtener información de los roles disponibles
  const respuestaDeRoles = await axios.get(`${API_URL}/api/users-permissions/roles`, configuracion);
  const rolesDisponibles = respuestaDeRoles.data.roles;

  // Buscar el rol del usuario
  const rolDeUsuarioEncontrado = rolesDisponibles.find((rol) => rol.id === datosDeUsuario.role);
  setRolDeUsuario(rolDeUsuarioEncontrado);
  console.log('Rol de usuario:', rolDeUsuarioEncontrado);
} else {
  // Si el usuario no tiene un rol asignado, puedes establecer un valor predeterminado o manejar el caso de otra manera
  setRolDeUsuario(null);
}
} catch (error) {
console.error('Error al obtener los datos:', error);
}
  };

  getData();
}, []);


    
  const [showMenu, setShowMenu] = useState(false);
  const [showProjectsSubmenu, setShowProjectsSubmenu] = useState(false);
  const [showTasksSubmenu, setShowTasksSubmenu] = useState(false);
  const [showCalendarSubmenu, setShowCalendarSubmenu] = useState(false);
  const [showInformeSubmenu, setShowInformeSubmenu] = useState(false);
  
  const toggleProjectsSubmenu = (e) => {
    const currentElement = e.target;
    if (currentElement.matches('.data-dropdown, .data-dropdown *')) {
      setShowProjectsSubmenu(!showProjectsSubmenu);
      setShowTasksSubmenu(false); // Oculta el submenu de Tareas
      setShowCalendarSubmenu(false); // Oculta el submenu de Calendario
      setShowInformeSubmenu(false);//Oculta el submenu de informe
      const subMenu = document.querySelector('.projects-link-child');
      subMenu.classList.toggle('hidden');
      document.querySelector('.projects-submenu-icon').classList.toggle('rotate-180');
    }
  };
  
  const toggleTasksSubmenu = (e) => {
    const currentElement = e.target;
    if (currentElement.matches('.data-dropdown, .data-dropdown *')) {
      setShowTasksSubmenu(!showTasksSubmenu);
      setShowProjectsSubmenu(false); // Oculta el submenu de Proyectos
      setShowCalendarSubmenu(false); // Oculta el submenu de Calendario
      setShowInformeSubmenu(false);//Oculta el submenu de informe
      const subMenu = document.querySelector('.tasks-link-child');
      subMenu.classList.toggle('hidden');
      document.querySelector('.tasks-submenu-icon').classList.toggle('rotate-180');
    }
  };

  const toggleCalendarSubmenu = (e) => {
    const currentElement = e.target;
    if (currentElement.matches('.data-dropdown, .data-dropdown *')) {
      setShowCalendarSubmenu(!showCalendarSubmenu);
      setShowProjectsSubmenu(false); // Oculta el submenu de Proyectos
      setShowTasksSubmenu(false); // Oculta el submenu de Tareas
      setShowInformeSubmenu(false);//Oculta el submenu de informe
      const subMenu = document.querySelector('.calendar-link-child');
      subMenu.classList.toggle('hidden');
      document.querySelector('.calendar-submenu-icon').classList.toggle('rotate-180');
    }
  };

  const toggleInformeSubmenu = (e) => {
    const currentElement = e.target;
    if (currentElement.matches('.data-dropdown, .data-dropdown *')) {
      setShowInformeSubmenu(!showInformeSubmenu);
      setShowProjectsSubmenu(false); // Oculta el submenu de Proyectos
      setShowTasksSubmenu(false); // Oculta el submenu de Tareas
      setShowCalendarSubmenu(false); // Oculta el submenu de Calendario
      const subMenu = document.querySelector('.informe-link-child');
      subMenu.classList.toggle('hidden');
      document.querySelector('.informe-submenu-icon').classList.toggle('rotate-180');
    }
  };


  return (
    <>
      <div
        className={`bg-[#0d30a1d0] h-[100vh] fixed lg:static w-[80%] md:w-[40%] lg:w-full transition-all z-50 duration-300 ${
          showMenu ? "left-0" : "-left-full"
        }`}
      >
        {/* Profile */}
        <div className=" flex flex-col items-center justify-center p-8 gap-2 h-[30vh]">
      <img src={foto1} className="w-20 h-20 object-cover rounded-full ring-2 ring-gray-300" />
      <h1 className="text-xl text-white font-bold">Hola, {usuario?.username || ''}</h1>
      {rolDeUsuario && (
      <p className="bg-[#0d30a1d0] py-2 px-4 rounded-full text-white">
        {rolDeUsuario.name}
      </p>
    )}
    </div>
        {/* Nav */}
        <div className="bg-[#0d30a1] p-8 rounded-tr-[100px] h-[70vh] flex flex-col justify-between gap-8">
          <nav className="flex flex-col gap-8">
            <a
              href="#"
              className="flex items-center gap-4 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors"
            >
              <RiHome3Line /> Inicio
            </a>
            

       <div className="relative">
    <button
      className="flex items-center gap-2 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors data-dropdown"
      onClick={toggleProjectsSubmenu}
    >
      <RiFileCopyLine />
      <span>Proyectos</span>
      <svg
        className={`w-4 h-4 ml-2 transition-transform projects-submenu-icon ${showProjectsSubmenu ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
    <ul
      className={`projects-link-child overflow-hidden ml-4 border-l border-green-500 ${showProjectsSubmenu ? '' : 'hidden'}`}
    >
      <li className="p-4 hover:bg-hover-elements text-white">
          <a href="#">Todos los Proyectos</a>
        </li>
        <li className="p-4 hover:bg-hover-elements text-white">
          <a href="#">Mis Proyectos</a>
        </li>
        
    </ul>
  </div>

  <div className="relative">
    <button
      className="flex items-center gap-2 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors data-dropdown"
      onClick={toggleTasksSubmenu}
    >
      <RiFileCopyLine />
      <span>Tareas</span>
      <svg
        className={`w-4 h-4 ml-2 transition-transform tasks-submenu-icon ${showTasksSubmenu ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
    <ul
      className={`tasks-link-child overflow-hidden ml-4 border-l border-green-500 ${showTasksSubmenu ? '' : 'hidden'}`}
    >
      <li className="p-4 hover:bg-hover-elements text-white">
      <a href="#">Todas las Tareas</a>
    </li>
    <li className="p-4 hover:bg-hover-elements text-white">
      <a href="#">Mis Tareas</a>
    </li>
    </ul>
  </div>

  <div className="relative">
  <button
    className="flex items-center gap-2 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors data-dropdown"
    onClick={toggleCalendarSubmenu}
  >
    <FiCalendar />
    <span>Calendario</span>
    <svg
      className={`w-4 h-4 ml-2 transition-transform calendar-submenu-icon ${showCalendarSubmenu ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  </button>
  <ul
    className={`calendar-link-child overflow-hidden ml-4 border-l border-green-500 ${showCalendarSubmenu ? '' : 'hidden'}`}
  >
    <li className="p-4 hover:bg-hover-elements text-white">
      <a href="#">Todos los Eventos</a>
    </li>
  </ul>
</div>

<div className="relative">
  <button
    className="flex items-center gap-2 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors data-dropdown"
    onClick={toggleInformeSubmenu}
  >
    <FiFileText />
    <span>Informe</span>
    <svg
      className={`w-4 h-4 ml-2 transition-transform informe-submenu-icon ${showInformeSubmenu ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  </button>
  <ul
    className={`informe-link-child overflow-hidden ml-4 border-l border-green-500 ${showInformeSubmenu ? '' : 'hidden'}`}
  >
    <li className="p-4 hover:bg-hover-elements text-white">
      <a href="#">Informe Generales</a>
    </li>
    <li className="p-4 hover:bg-hover-elements text-white">
    <a href="#">Informes de Proyectos</a>
    </li>
    <li className="p-4 hover:bg-hover-elements text-white">
    <a href="#">Informes Personalizados</a>
    </li>
  </ul>
</div>

          </nav>
          <div className="bg-[#00ff0491] text-white p-4 rounded-xl">
          <center>
            <p className="text-white">¿Tienes Problemas?</p>
            <a href="#">Contactame</a><ImMail2 />

            </center>
          </div>
        </div>
      </div>
      {/* Button mobile */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="lg:hidden fixed right-4 bottom-4 text-2xl bg-primary-900 p-2.5 rounded-full text-white z-50"
      >
        {showMenu ? <RiCloseFill /> : <RiMore2Fill />}
      </button>
    </>
  );
};

export default Sidebar;
