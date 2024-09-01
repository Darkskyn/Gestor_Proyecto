import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { HiOutlineTrash } from 'react-icons/hi2';
import { AiOutlinePlus } from 'react-icons/ai';

const MenuRecurso = ({ idrecurso, rescurso }) => {
  const [recursos, setRecursos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('Todos');
  const [recursoActual, setRecursoActual] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nuevoRecurso, setNuevoRecurso] = useState({
    nombre: '',
    descripcion: '',
    usuarioId: '',
    usuarioNombre: ''
  });

  const authToken = localStorage.getItem('authToken');
  const username = localStorage.getItem('username');
  
  const fetchRecursos = async () => {
    try {
      const response = await fetch(`http://localhost:1337/api/recursos?filters[Id_menu_recurso][$eq]=${parseInt(idrecurso)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await response.json();
      if (data.data) setRecursos(data.data);
    } catch (error) {
      console.error('Error al obtener recursos:', error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  useEffect(() => {
    fetchRecursos();
    if (rescurso === 'Humano') {
      fetchUsuarios();
    }
  }, [idrecurso, rescurso, authToken]);

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        // Encuentra el recurso que será eliminado para obtener su nombre
        const recurso = recursos.find(recurso => recurso.id === id);
        if (!recurso) {
          throw new Error('Recurso no encontrado');
        }
        const recursoNombre = recurso.attributes.Nombre;
  
        // Registra la auditoría antes de eliminar el recurso
        await logAuditoria(id, recursoNombre, 'Eliminacion');
  
        // Realiza la solicitud DELETE para eliminar el recurso
        const deleteResponse = await fetch(`http://localhost:1337/api/recursos/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
  
        console.log('Delete Response Status:', deleteResponse.status);
        console.log('Delete Response Status Text:', deleteResponse.statusText);
  
        if (deleteResponse.ok) {
          await fetchRecursos(); // Actualiza la lista de recursos
          await Swal.fire({
            title: '¡Eliminado!',
            text: `El recurso "${recursoNombre}" ha sido eliminado.`,
            icon: 'success',
            confirmButtonText: 'OK'
          });
          window.location.reload(); // Refrescar la página
        } else {
          console.error('Error al eliminar el recurso:', deleteResponse.statusText);
          Swal.fire('Error', 'Hubo un problema al eliminar el recurso.', 'error');
        }
      } catch (error) {
        console.error('Error al eliminar el recurso:', error);
        Swal.fire('Error', 'Hubo un problema al eliminar el recurso.', 'error');
      }
    }
  };
  
  
 
  const logAuditoria = async (idRecurso, nombreRecurso, accion) => {
    try {
      const requestPayload = {
        data: {
          Fecha: new Date().toISOString(),
          id_recursos: parseInt(idRecurso, 10),
          Usuario: username,
          Accion: accion,
          Nombre_Recurso: nombreRecurso,
          Menu_recurso: rescurso 
        }
      };
  
      console.log('Request Payload:', requestPayload);
  
      const response = await fetch('http://localhost:1337/api/auditoria-recursos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(requestPayload)
      });
  
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
  
      const responseBody = await response.json();
      console.log('Response Body:', responseBody);
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      console.log('Auditoría registrada exitosamente.');
    } catch (error) {
      console.error('Error al registrar en la auditoría:', error);
    }
  };
  

  const handleUserStateUpdate = async (recursoNombre) => {
    try {
      const userResponse = await fetch(`http://localhost:1337/api/users?filters[username][$eq]=${encodeURIComponent(recursoNombre)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      const userData = await userResponse.json();
      const usuario = userData[0];

      if (usuario && usuario.id) {
        const updateUserResponse = await fetch(`http://localhost:1337/api/users/${usuario.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ Estado: true })
        });

        if (!updateUserResponse.ok) {
          throw new Error('Error al actualizar el estado del usuario');
        }
      }
    } catch (error) {
      console.error('Error al actualizar el estado del usuario:', error);
      Swal.fire('Error', 'Hubo un problema al actualizar el estado del usuario.', 'error');
    }
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleEstadoFiltroChange = (event) => setEstadoFiltro(event.target.value);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNuevoRecurso({
      nombre: '',
      descripcion: '',
      usuarioId: '',
      usuarioNombre: ''
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNuevoRecurso(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('http://localhost:1337/api/recursos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          data: {
            Nombre: rescurso === 'Humano' ? nuevoRecurso.usuarioNombre : nuevoRecurso.nombre,
            Descripcion: nuevoRecurso.descripcion,
            Estado: true,
            Usuario: rescurso === 'Humano' ? nuevoRecurso.usuarioId : null,
            Id_menu_recurso: parseInt(idrecurso, 10),
          }
        })
      });
  
      if (response.ok) {
        const createdResource = await response.json(); // Captura la respuesta
        const createdResourceId = createdResource.data.id; // Captura el ID del recurso recién creado
        const createdResourceName = createdResource.data.attributes.Nombre; // Captura el Nombre del recurso recién creado
  
        // Registra la creación del recurso en la auditoría
        await logAuditoria(createdResourceId, createdResourceName, 'Creacion');
  
        handleCloseModal();
        await Swal.fire({
          title: '¡Éxito!',
          text: 'El recurso ha sido creado.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        window.location.reload(); // Refrescar la página
      } else {
        console.error('Error al crear el recurso:', response.statusText);
        Swal.fire('Error', 'Hubo un problema al crear el recurso.', 'error');
      }
    } catch (error) {
      console.error('Error al crear el recurso:', error);
      Swal.fire('Error', 'Hubo un problema al crear el recurso.', 'error');
    }
  };
  

  const findRecursoById = (id) => recursos.find(recurso => recurso.id === id);

  useEffect(() => {
    if (idrecurso) {
      const foundRecurso = findRecursoById(parseInt(idrecurso));
      setRecursoActual(foundRecurso);
    } else {
      setRecursoActual(null);
    }
  }, [idrecurso, recursos]);

  const filteredRecursos = recursos.filter(recurso =>
    recurso.attributes.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (estadoFiltro === 'Todos' || (estadoFiltro === 'Disponible' && recurso.attributes.Estado) || (estadoFiltro === 'No disponible' && !recurso.attributes.Estado))
  );

  const getDisponibilidad = (estado) => estado ? 'Disponible' : 'No disponible';

  const getRecursoName = (recurso) => {
    if (rescurso === "Humano") {
      return getUsernameById(recurso.attributes.Usuario);
    }
    return rescurso;
  };

  const getUsernameById = (id) => {
    const usuario = usuarios.find(user => user.id === id);
    return usuario ? usuario.username : 'Humano';
  };

  const availableUsuarios = (usuarios || [])
    .filter(usuario => usuario.Estado)
    .filter(usuario => !recursos.some(recurso => recurso.attributes.Usuario === usuario.id));

  const handleUsuarioChange = async (e) => {
    const selectedId = e.target.value;
    const selectedUser = availableUsuarios.find(user => user.id === parseInt(selectedId));

    setNuevoRecurso(prevState => ({
      ...prevState,
      usuarioId: selectedId,
      usuarioNombre: selectedUser ? selectedUser.username : ''
    }));

    if (selectedId) {
      try {
        const updateUserResponse = await fetch(`http://localhost:1337/api/users/${selectedId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ Estado: false })
        });

        if (!updateUserResponse.ok) {
          throw new Error('Error al actualizar el estado del usuario');
        }
      } catch (error) {
        console.error('Error al actualizar el estado del usuario:', error);
        Swal.fire('Error', 'Hubo un problema al actualizar el estado del usuario.', 'error');
      }
    }
  };

  return (
    <div className="py-8">
      <div className="pl-5 flex items-center mb-4 space-x-4">
        <button
          onClick={handleOpenModal}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition-colors"
        >
          <AiOutlinePlus className="w-5 h-5" />
          <span>Agregar Recurso</span>
        </button>
        <div className="pl-[650px] relative flex-grow">
          <input
            type="text"
            className="block w-full text-blue-900 placeholder-blue-900 backdrop-blur-sm bg-[#0d30a1]/20 py-2 pl-10 pr-4 rounded-lg focus:outline-none border-2 border-[#0d30a1] focus:border-blue-500 transition-colors duration-300"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="pl-[663px] absolute inset-y-0 left-0 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-blue-900"
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
                d="M19 19l-4-4m1.5-3.5A7 7 0 1 1 5.5 5.5a7 7 0 0 1 11 11z"
              />
            </svg>
          </div>
        </div>
        <select
          value={estadoFiltro}
          onChange={handleEstadoFiltroChange}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          <option value="Todos">Todos</option>
          <option value="Disponible">Disponible</option>
          <option value="No disponible">No disponible</option>
        </select>
      </div>

      <div className="text-lg bg-[#0d30a1]/10">
        <section className="mt-10 px-4 py-8 text-white antialiased">
          <div className="container mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-800">
                <thead className="bg-blue-700 text-white text-sm font-semibold uppercase">
                  <tr>
                    <th className="p-2 text-center uppercase">Nombre</th>
                    <th className="p-2 text-center uppercase">Descripción</th>
                    <th className="p-2 text-center uppercase">Recurso</th>
                    <th className="p-2 text-center uppercase">Estado</th>
                    <th className="p-2 text-center uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-base bg-transparent divide-y divide-gray-700">
                  {filteredRecursos.length > 0 ? (
                    filteredRecursos.map(recurso => (
                      <tr key={recurso.id} className="text-black bg-transparent hover:bg-[#d6d6d6]/20">
                        <td className="p-2 text-center uppercase">{recurso.attributes.Nombre}</td>
                        <td className="p-2 text-center uppercase">{recurso.attributes.Descripcion}</td>
                        <td className="p-2 text-center uppercase">{getRecursoName(recurso)}</td>
                        <td className="p-2 text-center uppercase">{getDisponibilidad(recurso.attributes.Estado)}</td>
                        <td className="p-2 flex justify-center space-x-4">
                          <HiOutlineTrash
                            onClick={() => handleDelete(recurso.id)}
                            className="h-8 w-8 rounded-full p-1 hover:bg-gray-900 hover:text-white cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-2 text-center text-lg uppercase text-black bg-white" colSpan="5">No se encontraron resultados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {recursoActual && (
          <section className="mt-10 px-4 py-8 text-white antialiased">
            <h2 className="text-2xl font-semibold mb-4 uppercase">Detalles del Recurso Seleccionado</h2>
            <div className="container mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-800">
                  <thead className="bg-blue-700 text-white text-sm font-semibold uppercase">
                    <tr>
                      <th className="p-2 text-center uppercase">Nombre</th>
                      <th className="p-2 text-center uppercase">Descripción</th>
                      <th className="p-2 text-center uppercase">Recurso</th>
                      <th className="p-2 text-center uppercase">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="text-base bg-transparent">
                    <tr className="text-black bg-transparent">
                      <td className="p-2 text-center uppercase">{recursoActual.attributes.Nombre}</td>
                      <td className="p-2 text-center uppercase">{recursoActual.attributes.Descripcion}</td>
                      <td className="p-2 text-center uppercase">{getRecursoName(recursoActual)}</td>
                      <td className="p-2 text-center uppercase">{getDisponibilidad(recursoActual.attributes.Estado)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>

      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Crear Nuevo Recurso</h2>
      <form onSubmit={handleSubmit}>
        {rescurso === 'Humano' ? (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Seleccionar Usuario:</label>
            <select
              name="usuarioId"
              value={nuevoRecurso.usuarioId}
              onChange={handleUsuarioChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
            >
              <option value="">Seleccionar usuario</option>
              {availableUsuarios.map(usuario => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.username}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={nuevoRecurso.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>
          </>
        )}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Descripción:</label>
          <textarea
            name="descripcion"
            value={nuevoRecurso.descripcion}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCloseModal}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Crear Recurso
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default MenuRecurso;
