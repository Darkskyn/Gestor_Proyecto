import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { CiEdit } from 'react-icons/ci';
import { FaPauseCircle } from 'react-icons/fa';

const Tabla = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usuariosPerPage] = useState(10); // Número de usuarios por página

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setAuthToken(authToken);
    }

    fetch('http://localhost:1337/api/users-permissions/roles')
      .then(response => response.json())
      .then(data => {
        if (data && data.roles) {
          const filteredRoles = data.roles.filter(role => role.type !== 'authenticated' && role.type !== 'public');
          setRoles(filteredRoles);
        }
      })
      .catch(error => console.error('Error al obtener roles:', error));

    fetchUsuarios();
  }, []);

  const fetchUsuarios = () => {
    fetch('http://localhost:1337/api/users?populate=role')
      .then(response => response.json())
      .then(data => {
        if (data) {
          const usuariosFormatted = data.map(usuario => ({
            ...usuario,
            username: usuario.username ? usuario.username.toUpperCase() : '',
            email: usuario.email ? usuario.email.toUpperCase() : '',
          }));
          setUsuarios(usuariosFormatted);
        }
      })
      .catch(error => console.error('Error al obtener usuarios:', error));
  };

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const roleId = event.target.role.value;
    const estatus = event.target.estatus.value === 'true'; // Convertir a booleano

    try {
      const response = await fetch(`http://localhost:1337/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: roleId,
          Estatus: estatus
        })
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          text: 'El rol y el estatus del usuario han sido actualizados correctamente.'
        }).then(() => {
          fetchUsuarios();
          setEditingUser(null);
        });
      } else {
        throw new Error('Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al intentar actualizar el rol y el estatus del usuario. Por favor, intenta nuevamente.'
      });
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Resetea la página cuando cambia la búsqueda
  };

  const getRecursoLabel = (estado) => {
    return estado ? 'Disponible' : 'No disponible';
  };

  const getEstatusLabel = (estatus) => {
    return estatus ? 'Activo' : 'Suspendido';
  };

  const getEstatusClass = (estatus) => {
    return estatus
      ? 'bg-green-500 text-white rounded-lg px-4 py-2'
      : 'bg-orange-500 text-white rounded-lg px-4 py-2';
  };

  const closeModal = () => {
    setEditingUser(null);
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getRecursoLabel(usuario.Estado).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getEstatusLabel(usuario.Estatus).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (usuario.role && usuario.role.name ? usuario.role.name.toLowerCase().includes(searchTerm.toLowerCase()) : false)
  );

  // Calcular los índices de los usuarios a mostrar
  const indexOfLastUser = currentPage * usuariosPerPage;
  const indexOfFirstUser = indexOfLastUser - usuariosPerPage;
  const currentUsers = filteredUsuarios.slice(indexOfFirstUser, indexOfLastUser);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredUsuarios.length / usuariosPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      {/* Barra de búsqueda */}
      <div className="w-full pl-[800px]">
        <div className="relative mt-16 w-full">
          <input
            type="text"
            className="w-11/12 text-blue-900 placeholder-blue-900 backdrop-blur-sm bg-[#0d30a1]/20 py-2 pl-10 pr-4 rounded-lg focus:outline-none border-2 border-[#0d30a1] focus:border-blue-500 transition-colors duration-300"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-blue-900 dark:text-blue-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabla con fondo azul */}
      <section className="mt-10 px-4 py-8 text-black antialiased bg-[#0d30a1]/20">
        <div className="container mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-800">
              <thead className="bg-blue-700 text-white text-lg font-semibold uppercase">
                <tr>
                  <th className="p-4 text-center">Username</th>
                  <th className="p-4 text-center">Email</th>
                  <th className="p-4 text-center">Recurso</th>
                  <th className="p-4 text-center">Rol</th>
                  <th className="p-4 text-center">Estatus</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-lg">
                {currentUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-4 text-center">No se encontraron resultados.</td>
                  </tr>
                )}
                {currentUsers.map(usuario => (
                  <tr key={usuario.id}>
                    <td className="p-4 text-center">{usuario.username}</td>
                    <td className="p-4 text-center">{usuario.email}</td>
                    <td className="p-4 text-center">{getRecursoLabel(usuario.Estado)}</td>
                    <td className="p-4 text-center">{usuario.role ? (usuario.role.name ? usuario.role.name.toUpperCase() : 'SIN ROL') : 'SIN ROL'}</td>
                    <td className={`p-4 text-center ${getEstatusClass(usuario.Estatus)}`}>
                      {getEstatusLabel(usuario.Estatus)}
                    </td>
                    <td className="p-4 flex justify-center space-x-4">
                      <CiEdit
                        onClick={() => handleEdit(usuario)}
                        className="h-8 w-8 rounded-full p-1 hover:bg-gray-900 hover:text-white cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      {/* Modal de edición */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Editar Usuario</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Rol</label>
                <select
                  name="role"
                  defaultValue={editingUser.role ? editingUser.role.id : ''}
                  className="mt-1 block w-full bg-gray-200 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Estatus</label>
                <select
                  name="estatus"
                  defaultValue={editingUser.Estatus ? 'true' : 'false'}
                  className="mt-1 block w-full bg-gray-200 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Activo</option>
                  <option value="false">Suspendido</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Controles de Paginación */}
      <div className="flex justify-between mt-4 px-4">
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none 
          ${currentPage === 1 ? 'invisible' : ''}`}
          onClick={handlePreviousPage}
        >
          Anterior
        </button>
        <span className="self-center">Página {currentPage} de {totalPages}</span>
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none 
          ${currentPage === totalPages ? 'invisible' : ''}`}
          onClick={handleNextPage}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Tabla;
