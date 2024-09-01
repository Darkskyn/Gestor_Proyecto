import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Seccion = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Enviar solicitud de autenticación
      const authResponse = await axios.post('http://localhost:1337/api/auth/local', {
        identifier,
        password,
      });
  
      if (authResponse.data.jwt) {
        const authToken = authResponse.data.jwt;
        localStorage.setItem('authToken', authToken);
  
        // Obtener el ID del usuario
        const userConfig = {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        };
  
        // Buscar al usuario por username para obtener el ID
        const userResponse = await axios.get(`http://localhost:1337/api/users?username=${identifier}&populate=*`, userConfig);
  
        if (userResponse.data.length > 0) {
          const user = userResponse.data.find(u => u.username === identifier);
  
          if (!user) {
            throw new Error('Usuario no encontrado');
          }
  
          const userId = user.id; // Obtener el ID del usuario
          const userEmail = user.email;
          
          localStorage.setItem('username', user.username);
          localStorage.setItem('email', userEmail);
          
          // Preparar los datos para el POST de auditoría
          const auditData = {
            data: {
              Fecha: new Date().toISOString(), // La fecha actual en formato ISO
              Id_usuario: userId, // Usar el ID del usuario
              Accion: "Inicio"
            }
          };
  
          // Imprimir el ID del usuario y los datos a enviar
          console.log('User ID:', userId);
          console.log('Audit data to post:', auditData);
  
          // Hacer la solicitud POST a la API de auditoría
          await axios.post('http://localhost:1337/api/auditoria-inicio-sesions', auditData, {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
  
          // Verificar si el usuario tiene el rol de Admin
          if (user.role && user.role.name === 'Admin') {
            setIsAdmin(true);
            setShowModal(true); // Mostrar el modal para que el admin elija el dashboard
          } else {
            // Notificación de éxito para usuarios normales
            Swal.fire({
              icon: 'success',
              title: 'Inicio de sesión exitoso',
              text: 'Bienvenido al Dashboard de Proyectos'
            }).then(() => {
              navigate('/dash'); // Redirigir al dashboard de proyectos
            });
          }
        } else {
          throw new Error('Usuario no encontrado');
        }
      } else {
        // Enviar un mensaje de error si el JWT no está presente
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Usuario no encontrado'
        });
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      // Muestra un mensaje de error específico basado en el contenido de la respuesta de error
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Error al iniciar sesión, por favor intente nuevamente.';

      if (errorMessage.toLowerCase().includes('invalid password')) {
        // Mensaje específico para contraseña incorrecta
        Swal.fire({
          icon: 'error',
          title: 'Contraseña Incorrecta',
          text: 'La contraseña ingresada es incorrecta. Por favor, intente de nuevo.'
        });
      } else {
        // Mensaje genérico para otros errores
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage
        });
      }
    }
  };

  const handleDashboardChoice = (dashboard) => {
    setShowModal(false);
    if (dashboard === 'admin') {
      // Notificación de éxito para usuarios admins
      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: 'Bienvenido al Dashboard Admin'
      }).then(() => {
        navigate('/Admin_Dash'); // Redirigir al dashboard de administrador
      });
    } else {
      // Notificación de éxito para usuarios normales
      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: 'Bienvenido al Dashboard de Proyectos'
      }).then(() => {
        navigate('/dash'); // Redirigir al dashboard de proyectos
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-[rgba(13,72,161,0.87)] shadow-md rounded-lg px-10 py-8 w-1/3 flex">
        <div className="w-full">
          <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">BANCAMIGA</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="identifier" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                Usuario
              </label>
              <input
                type="text"
                id="identifier"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Ingrese su usuario"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                Contraseña
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10" // Ajuste para permitir espacio para el icono
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pt-7 px-3 cursor-pointer"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-gray-500" />
              </button>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:outline-none"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Recordar Contraseña
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60">
          <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Selecciona el dashboard</h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleDashboardChoice('admin')}
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Dashboard Admin
              </button>
              <button
                onClick={() => handleDashboardChoice('normal')}
                className="bg-green-500 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Dashboard de Proyectos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seccion;
