import React, { useState, useEffect } from "react";
import foto1 from '../../../../assets/logo.png';
import {
  RiHome3Line,
  RiFileCopyLine,
  RiMore2Fill,
  RiCloseFill,
  RiLogoutCircleLine,
} from "react-icons/ri";
import { VscGear } from "react-icons/vsc";
import { FiCalendar } from "react-icons/fi";
import { ImMail2 } from "react-icons/im";
import axios from 'axios';

const API_URL = typeof process !== 'undefined' && process.env.API_URL ? process.env.API_URL : 'http://localhost:1337';

const Sidebar = () => {
  const [usuario, setUsuario] = useState(null);
  const [rolDeUsuario, setRolDeUsuario] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showSettingsSubmenu, setShowSettingsSubmenu] = useState(false);

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

        if (datosDeUsuario.role) {
          const respuestaDeRoles = await axios.get(`${API_URL}/api/users-permissions/roles`, configuracion);
          const rolesDisponibles = respuestaDeRoles.data.roles;
          const rolDeUsuarioEncontrado = rolesDisponibles.find((rol) => rol.id === datosDeUsuario.role);
          setRolDeUsuario(rolDeUsuarioEncontrado);
          console.log('Rol de usuario:', rolDeUsuarioEncontrado);
        } else {
          setRolDeUsuario(null);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const tokenDeAutenticacion = localStorage.getItem('authToken');
  
      // Verificar si el token de autenticación existe
      if (!tokenDeAutenticacion) {
        throw new Error('Token de autenticación no encontrado.');
      }
  
      // Configuración para la solicitud
      const configuracion = {
        headers: {
          'Authorization': `Bearer ${tokenDeAutenticacion}`
        }
      };
  
      // Obtener los datos del usuario para auditar el cierre de sesión
      const respuestaDeUsuario = await axios.get(`${API_URL}/api/users/me`, configuracion);
      const datosDeUsuario = respuestaDeUsuario.data;
      const userId = datosDeUsuario.id; // Obtener el ID del usuario
  
      // Preparar los datos para la auditoría
      const auditData = {
        data: {
          Fecha: new Date().toISOString(), // La fecha actual en formato ISO
          Id_usuario: userId, // Usar el ID del usuario
          Accion: "Cierre"
        }
      };
  
      // Enviar auditoría del cierre de sesión
      await axios.post(`${API_URL}/api/auditoria-inicio-sesions`, auditData, configuracion);
  
      // Limpiar el token de autenticación y otros datos relevantes del almacenamiento local
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId'); // Asegúrate de que el ID del usuario también se elimine si se almacena
  
      // Redirigir al usuario a la página de inicio
      window.location.href = '/';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Opcionalmente, puedes mostrar un mensaje de error al usuario aquí
    }
  };

  const toggleSettingsSubmenu = () => {
    setShowSettingsSubmenu(!showSettingsSubmenu);
  };

  return (
    <>
      {/* Barra lateral */}
      <div className={`fixed inset-y-0 left-0 w-96 sm:w-80 bg-[#0d30a1d0] transition-transform transform lg:static lg:translate-x-0 ${showMenu ? "translate-x-0" : "-translate-x-full"} flex flex-col overflow-y-auto h-full z-50`}>
        {/* Perfil */}
        <div className="flex flex-col items-center justify-center p-8 gap-4 h-1/3 rounded-b-xl">
          <img src={foto1} className="w-24 h-24 object-cover rounded-full ring-4 ring-gray-300 shadow-lg" alt="Perfil" />
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-white">Hola, {usuario?.username || 'Usuario'}</h1>
            {rolDeUsuario && (
              <p className="bg-[#1a2a7e] py-2 px-4 mt-2 rounded-full text-white font-semibold">
                {rolDeUsuario.name}
              </p>
            )}
          </div>
        </div>
        {/* Navegación */}
        <div className="flex-1 bg-[#0d30a1] p-4 rounded-tr-[100px]">
          <nav className="flex flex-col gap-6">
            <a
              href="/Admin_Dash"
              className="flex items-center gap-4 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors text-lg font-medium"
            >
              <RiHome3Line /> Inicio
            </a>

            <div className="relative">
              <button
                className="flex items-center gap-2 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors text-lg font-medium"
                onClick={toggleSettingsSubmenu}
              >
                <VscGear />
                <span>Configuración</span>
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${showSettingsSubmenu ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <ul
                className={`ml-4 border-l border-green-500 ${showSettingsSubmenu ? '' : 'hidden'} flex flex-col gap-2`}
              >
                <li className="p-4 hover:bg-hover-elements text-white text-lg font-medium">
                  <a href="/Admin_Usuario">Usuario</a>
                </li>
                <li className="p-4 hover:bg-hover-elements text-white text-lg font-medium">
                  <a href="/Auditoria">Auditoría</a>
                </li>
                <li className="p-4 hover:bg-hover-elements text-white text-lg font-medium">
                  <a href="/">Respaldo BD</a>
                </li>
              </ul>
            </div>

            <div className="relative">
              <a
                href="/Admin_Proyecto"
                className="flex items-center gap-4 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors text-lg font-medium"
              >
                <RiFileCopyLine /> Proyectos
              </a>
            </div>
            <div className="relative">
              <a
                href="/Admin_Tarea"
                className="flex items-center gap-2 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors text-lg font-medium"
              >
                <RiFileCopyLine />
                <span>Tareas</span>
              </a>
            </div>
            <div className="relative">
              <a
                href="/Admin_Recurso"
                className="flex items-center gap-2 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors text-lg font-medium"
              >
                <FiCalendar />
                <span>Recursos</span>
              </a>
            </div>
          </nav>
        </div>
        {/* Botón de cerrar sesión y contáctame en la parte inferior */}
        <div className="bg-[#0d30a1] flex flex-col mt-auto p-4">
          <button
            className="flex items-center gap-4 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors text-lg font-medium"
            onClick={handleLogout}
          >
            <RiLogoutCircleLine />
            <span>Cerrar sesión</span>
          </button>

          <div className="bg-[#00ff0491] text-white p-4 rounded-xl text-center mt-4">
            <p className="text-white text-lg font-medium">¿Tienes Problemas?</p>
            <a href="#" className="flex items-center justify-center gap-2 text-lg font-medium">
              Contáctame <ImMail2 />
            </a>
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
