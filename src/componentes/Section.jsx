import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const Seccion = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier,
        password,
      });

      if (response.data.jwt) {
        localStorage.setItem('authToken', response.data.jwt);

        const authToken = response.data.jwt;
        const config = {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        };

        // Buscar al usuario por username (no limitar a 1)
        const userResponse = await axios.get(`http://localhost:1337/api/users?username=${identifier}&populate=*`, config);

        if (userResponse.data.length > 0) {
          const user = userResponse.data.find(u => u.username === identifier);

          if (!user) {
            throw new Error('Usuario no encontrado');
          }

          // Verificar si el usuario tiene el rol de Admin
          if (user.role && user.role.name === 'Admin') {
            // Mostrar mensaje de éxito para Admin
            Swal.fire({
              icon: 'success',
              title: 'Inicio de sesión exitoso',
              text: 'Bienvenido al dashboard de administrador'
            }).then(() => {
              navigate('/Admin_Dash'); // Redirigir al dashboard de administrador
            });
          } else {
            // Mostrar mensaje de éxito para otros usuarios
            Swal.fire({
              icon: 'success',
              title: 'Inicio de sesión exitoso',
              text: 'Bienvenido al dashboard de Proyectos'
            }).then(() => {
              navigate(`/dash?id=${user.id}`); // Redirigir al dashboard de proyectos
            });
          }
        } else {
          throw new Error('Usuario no encontrado');
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Usuario no encontrado'
        });
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al iniciar sesión, por favor intente nuevamente'
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
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:outline-none"
                  onChange={(e) => setPassword(e.target.checked)}
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
    </div>
  );
};

export default Seccion;