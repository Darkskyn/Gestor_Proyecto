import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { CiEdit } from 'react-icons/ci'; // Importa el ícono de lápiz

const Tabla = ({ filtro }) => {
  const [recursos, setRecursos] = useState([]);
  const [searchTerm, setSearchTerm] = useState(filtro || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProject, setEditingProject] = useState(null);
  const [newEstado, setNewEstado] = useState('');

  const projectsPerPage = 10;

  useEffect(() => {
    fetch('http://localhost:1337/api/proyectos')
      .then(response => response.json())
      .then(data => {
        if (data.data) {
          setRecursos(data.data);
        }
      })
      .catch(error => console.error('Error al obtener proyectos:', error));
  }, []);

  useEffect(() => {
    setSearchTerm(filtro || '');
  }, [filtro]);

  const handleEditClick = (proyecto) => {
    setEditingProject(proyecto);
    setNewEstado(proyecto.attributes.Estado_Proyecto);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!editingProject) return;

    try {
      const token = localStorage.getItem('authToken');
      const username = localStorage.getItem('username'); // Asegúrate de almacenar el nombre de usuario en el localStorage

      if (!token || !username) {
        throw new Error('Token de autenticación o nombre de usuario no encontrado');
      }

      const projectResponse = await fetch(`http://localhost:1337/api/proyectos/${editingProject.id}?populate=Id_tareas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!projectResponse.ok) {
        const errorData = await projectResponse.json();
        throw new Error(errorData.message || 'Error al obtener el proyecto');
      }

      const projectData = await projectResponse.json();
      const tareas = projectData.data?.attributes?.Id_tareas?.data;
      if (!tareas) {
        throw new Error('No se encontraron tareas asociadas al proyecto');
      }

      const updateProjectResponse = await fetch(`http://localhost:1337/api/proyectos/${editingProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          data: {
            Estado_Proyecto: newEstado
          }
        })
      });

      if (!updateProjectResponse.ok) {
        const errorData = await updateProjectResponse.json();
        throw new Error(errorData.message || 'Error al actualizar el proyecto');
      }

      const taskUpdates = tareas.map(task => {
        return fetch(`http://localhost:1337/api/tareas/${task.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            data: {
              Estado: newEstado
            }
          })
        });
      });

      const taskResponses = await Promise.all(taskUpdates);

      taskResponses.forEach(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al actualizar la tarea');
        }
      });

      // Actualiza el estado del proyecto en la lista
      const updatedRecursos = recursos.map(proyecto =>
        proyecto.id === editingProject.id
          ? { ...proyecto, attributes: { ...proyecto.attributes, Estado_Proyecto: newEstado } }
          : proyecto
      );
      setRecursos(updatedRecursos);
      setEditingProject(null);
      Swal.fire('¡Actualizado!', 'El estado del proyecto y sus tareas han sido actualizados.', 'success');

      // Determina la acción para la auditoría
      const fecha = new Date().toISOString(); // Formato ISO para la fecha
      const nombreProyecto = editingProject.attributes.Nombre_Proyecto; // Obtén el nombre del proyecto
      const accion = editingProject.attributes.Estado_Proyecto === 'Suspendido' && newEstado !== 'Suspendido'
        ? 'Reactivacion'
        : 'Modificacion';

      const auditResponse = await fetch('http://localhost:1337/api/auditoria-proyectos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          data: {
            Fecha: fecha,
            id_proyectos: editingProject.id,
            Nombre_Proyecto: nombreProyecto, 
            Accion: accion,
            Usuario: username
          }
        })
      });

      if (!auditResponse.ok) {
        const errorData = await auditResponse.json();
        console.error('Error al enviar la auditoría:', errorData);
        throw new Error(errorData.message || 'Error al enviar la auditoría');
      }
      
    } catch (error) {
      console.error('Error al actualizar el proyecto y las tareas:', error);
      Swal.fire('Error', error.message, 'error');
    }
  };

  const filteredRecursos = recursos.filter(proyecto => {
    const term = searchTerm.toLowerCase();
    const attributes = proyecto.attributes;

    return (
      (attributes.Nombre_Proyecto && attributes.Nombre_Proyecto.toLowerCase().includes(term)) ||
      (attributes.Estado_Proyecto && attributes.Estado_Proyecto.toLowerCase().includes(term)) ||
      (attributes.Gerente_Proyecto && attributes.Gerente_Proyecto.toLowerCase().includes(term)) ||
      (attributes.usuario_proyecto && attributes.usuario_proyecto.toLowerCase().includes(term)) ||
      (attributes.Departamento && attributes.Departamento.toLowerCase().includes(term))
    );
  });

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredRecursos.slice(indexOfFirstProject, indexOfLastProject);

  const totalPages = Math.ceil(filteredRecursos.length / projectsPerPage);

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

  const getColorClass = (estado) => {
    const estadoLowerCase = estado ? estado.toLowerCase() : '';

    switch (estadoLowerCase) {
      case 'completado':
        return 'bg-green-500 rounded-md text-white';
      case 'cancelado':
        return 'bg-red-500 rounded-md text-white';
      case 'en progreso':
        return 'bg-yellow-500 rounded-md text-white';
      case 'suspendido':
        return 'bg-orange-500 rounded-md text-white';
      default:
        return 'bg-gray-300 text-black';
    }
  };

  const getDisplayValue = (value) => {
    return value ? value.toUpperCase() : 'N/A';
  };

  return (
    <div>
      <div className="w-full pl-[800px]">
        <div className="relative mt-16 w-full">
          <input
            type="text"
            className="w-11/12 text-blue-900 placeholder-blue-900 backdrop-blur-sm bg-[#0d30a1]/20 py-2 pl-10 pr-4 rounded-lg focus:outline-none border-2 border-[#0d30a1] focus:border-blue-500 transition-colors duration-300"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      <div className="bg-[#0d30a1]/20">
        <section className="mt-10 px-4 py-8 text-black antialiased">
          <div className="container mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-800">
                <thead className="bg-blue-700 text-white text-sm font-semibold uppercase">
                  <tr>
                    <th className="p-2 text-center">Nombre Proyecto</th>
                    <th className="p-2 text-center">Gerente_Proyecto</th>
                    <th className="p-2 text-center">Fecha Inicio</th>
                    <th className="p-2 text-center">Fecha Fin</th>
                    <th className="p-2 text-center">Estado Proyecto</th>
                    <th className="p-2 text-center">Usuario Proyecto</th>
                    <th className="p-2 text-center">Departamento</th>
                    <th className="p-2 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-base">
                  {currentProjects.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-4 text-center">No se encontraron resultados.</td>
                    </tr>
                  ) : (
                    currentProjects.map(proyecto => (
                      <tr key={proyecto.id}>
                        <td className="p-2 text-center">{getDisplayValue(proyecto.attributes.Nombre_Proyecto)}</td>
                        <td className="p-2 text-center">{getDisplayValue(proyecto.attributes.Gerente_Proyecto)}</td>
                        <td className="p-2 text-center">{getDisplayValue(proyecto.attributes.Fecha_Inicio)}</td>
                        <td className="p-2 text-center">{getDisplayValue(proyecto.attributes.Fecha_Fin)}</td>
                        <td className={`p-2 text-center ${getColorClass(proyecto.attributes.Estado_Proyecto)}`}>
                          {getDisplayValue(proyecto.attributes.Estado_Proyecto)}
                        </td>
                        <td className="p-2 text-center">
                          {getDisplayValue(proyecto.attributes.usuario_proyecto)}
                        </td>
                        <td className="p-2 text-center">{getDisplayValue(proyecto.attributes.Departamento)}</td>
                        <td className="p-2 flex justify-center space-x-4">
                          <CiEdit
                            onClick={() => handleEditClick(proyecto)}
                            className="h-8 w-8 rounded-full p-1 hover:bg-gray-900 hover:text-white cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {editingProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Editar Estado del Proyecto</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Estado del Proyecto</label>
                <select
                  value={newEstado}
                  onChange={(e) => setNewEstado(e.target.value)}
                  className="mt-1 block w-full bg-gray-200 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                  <option value="En Progreso">En Progreso</option>
                  <option value="Suspendido">Suspendido</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
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
