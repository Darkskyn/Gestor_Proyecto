import React, { useState, useEffect } from "react";
import foto1 from '../../../assets/logo.png'
import {
  RiHome3Line,
  RiFileCopyLine,
  RiPieChartLine,
  RiMore2Fill,
  RiCloseFill,
  RiLogoutCircleLine,
} from "react-icons/ri";
import { FiFileText, FiCalendar } from "react-icons/fi";
import { ImMail2 } from "react-icons/im";
import axios from 'axios';

const API_URL = typeof process !== 'undefined' && process.env.API_URL ? process.env.API_URL : 'http://localhost:1337';

const Sidebar = () => {
  const [usuario, setUsuario] = useState(null);
  const [rolDeUsuario, setRolDeUsuario] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
    window.location.href = '/'; 
  };
  



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
      setShowInformeSubmenu(false); // Oculta el submenu de informe
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
      setShowInformeSubmenu(false); // Oculta el submenu de informe
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
      setShowInformeSubmenu(false); // Oculta el submenu de informe
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
      <div className={`bg-[#0d30a1d0] h-full fixed lg:static w-[80%] md:w-[40%] lg:w-full transition-all z-50 duration-300 ${showMenu ? "left-0" : "-left-full"}`}>
        {/* Perfil */}
        <div className="flex flex-col items-center justify-center p-8 gap-2 h-[30vh]">
          <img src={foto1} className="w-20 h-20 object-cover rounded-full ring-2 ring-gray-300" />
          <h1 className="text-xl text-white font-bold">Hola, {usuario?.username || ''}</h1>
          {rolDeUsuario && (
            <p className="bg-[#0d30a1d0] py-2 px-4 rounded-full text-white">
              {rolDeUsuario.name}
            </p>
          )}
        </div>
        {/* Navegación */}
        <div className="bg-[#0d30a1] p-8 rounded-tr-[100px] h-[70vh] flex flex-col justify-between gap-8">
          <nav className="flex flex-col gap-8">
            <a
              href="/Admin_Dash"
              className="flex items-center gap-4 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors"
            >
              <RiHome3Line /> Inicio
            </a>
            {/* Más elementos de navegación aquí */}
            <div className="relative">
              <a
                href="/Admin_Proyecto"
                className="flex items-center gap-4 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors"
              >
                <RiFileCopyLine />Proyectos
              </a>
            </div>
            <div className="relative">
              <a
                href="/Admin_Usuario"
                className="flex items-center gap-2 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors data-dropdown"
                onClick={toggleTasksSubmenu}
              >
                <RiFileCopyLine />
                <span>Usuario</span>
              </a>
            </div>
            <div className="relative">
              <a
                href="/Admin_Tarea"
                className="flex items-center gap-2 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors data-dropdown"
                onClick={toggleTasksSubmenu}
              >
                <RiFileCopyLine />
                <span>Tareas</span>
              </a>
            </div>
            <div className="relative">
              <a
                href="/Admin_Recurso"
                className="flex items-center gap-2 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors data-dropdown"
                onClick={toggleCalendarSubmenu}
              >
                <FiCalendar />
                <span>Recursos</span>
              </a>
            </div>
            <div className="relative">
            <a
                href="/Auditoria"
                className="flex items-center gap-2 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors data-dropdown"
                onClick={toggleInformeSubmenu}
              >
                <FiFileText />
                <span>Auditoria</span>
              </a>
            </div>
          </nav>

          <button
            className="flex items-center gap-4 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors"
            onClick={handleLogout}
          >
            <RiLogoutCircleLine />
            <span>Cerrar sesión</span>
        </button>

          <div className="bg-[#00ff0491] text-white p-4 rounded-xl">
            <center>
              <p className="text-white">¿Tienes Problemas?</p>
              <a href="#">Contactame</a><ImMail2 />
            </center>
          </div>
         
        </div>
      </div>
      {/* Botón para móviles */}
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
