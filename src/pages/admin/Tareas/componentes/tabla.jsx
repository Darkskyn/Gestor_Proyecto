import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { CiEdit } from 'react-icons/ci'; // Importa el ícono de lápiz

const ITEMS_PER_PAGE = 10; // Número de elementos por página

const Tabla = () => {
  const [tareas, setTareas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [newEstado, setNewEstado] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('http://localhost:1337/api/tareas?populate=Id_proyecto')
      .then(response => response.json())
      .then(data => {
        if (data.data) {
          const extractedTareas = data.data.map(item => {
            const attributes = item.attributes || {};
            const proyectoData = attributes.Id_proyecto && attributes.Id_proyecto.data ? attributes.Id_proyecto.data : {};
            const Nombre_Proyecto = proyectoData.attributes ? proyectoData.attributes.Nombre_Proyecto : 'Desconocido';
            const Id_proyecto = proyectoData.id || 'Desconocido';
            const id_tareas = item.id || 'Desconocido';

            return {
              id: id_tareas, // ID de la tarea
              ...attributes,
              Nombre_Proyecto,
              Id_proyecto,
              id_tareas
            };
          });

          setTareas(extractedTareas);
        }
      })
      .catch(error => console.error('Error al obtener tareas:', error));
  }, []);

  const handleEditClick = (tarea) => {
    setEditingTask(tarea);
    setNewEstado(tarea.Estado || 'Pendiente');
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editingTask) return;

    try {
      const authToken = localStorage.getItem('authToken');
      const username = localStorage.getItem('username');

      if (!authToken) {
        console.error('Token de autenticación no encontrado');
        throw new Error('Token de autenticación no encontrado');
      }

      const wasSuspended = editingTask.Estado === 'Suspendido';
      const isReactivating = wasSuspended && newEstado !== 'Suspendido';

      const updateResponse = await fetch(`http://localhost:1337/api/tareas/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          data: {
            Estado: newEstado
          }
        })
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error('Error al actualizar la tarea:', errorText);
        throw new Error(errorText || 'Error al actualizar la tarea');
      }

      console.log('Tarea actualizada correctamente');

      const auditData = {
        Fecha: new Date().toISOString(),
        id_proyectos: editingTask.Id_proyecto || 'Desconocido',
        Id_tareas: editingTask.id_tareas || 'Desconocido',
        Nombre_Tarea: editingTask.Nombre || 'Desconocido',
        Accion: isReactivating ? 'Reactivacion' : 'Modificacion',
        Usuario: username || 'Desconocido'
      };

      const auditResponse = await fetch('http://localhost:1337/api/audotira-tareas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ data: auditData })
      });

      const auditResponseText = await auditResponse.text();
      console.log('Respuesta de auditoría (texto):', auditResponseText);

      if (!auditResponse.ok) {
        console.error('Error al enviar la auditoría:', auditResponseText);
        throw new Error(auditResponseText || 'Error al enviar la auditoría');
      }

      const updatedTareas = tareas.map(tarea =>
        tarea.id === editingTask.id
          ? { ...tarea, Estado: newEstado }
          : tarea
      );
      setTareas(updatedTareas);
      setEditingTask(null);
      Swal.fire('¡Actualizado!', 'El estado de la tarea ha sido actualizado y se ha registrado la auditoría.', 'success');
    } catch (error) {
      console.error('Error al actualizar la tarea o enviar la auditoría:', error);
      Swal.fire('Error', error.message, 'error');
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTareas = tareas.filter(tarea =>
    (tarea.Nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tarea.Estado || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredTareas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageTareas = filteredTareas.slice(startIndex, endIndex);

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

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Cancelado':
        return 'bg-red-400';
      case 'Pendiente':
        return 'bg-yellow-400';
      case 'Ejecucion':
        return 'bg-blue-400';
      case 'Finalizado':
        return 'bg-green-400';
      case 'Suspendido':
        return 'bg-orange-500';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div>
      <div className="w-full pl-[800px]">
        <div className="relative mt-16 w-full">
          <input
            type="text"
            className="w-11/12 text-blue-900 placeholder-blue-900 backdrop-blur-sm bg-[#0d30a1]/20 py-2 pl-10 pr-4 rounded-lg focus:outline-none border-2 border-[#0d30a1] focus:border-blue-500 transition-colors duration-300 text-lg"
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

      <section className="mt-10 px-4 py-8 text-black antialiased bg-[#0d30a1]/20">
        <div className="container mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-800">
              <thead className="bg-blue-700 text-white text-sm font-semibold uppercase">
                <tr>
                  <th className="p-2 text-center uppercase">Nombre</th>
                  <th className="p-2 text-center uppercase">Proyecto</th>
                  <th className="p-2 text-center uppercase">Fecha Inicio</th>
                  <th className="p-2 text-center uppercase">Fecha Fin</th>
                  <th className="p-2 text-center uppercase">Estado</th>
                  <th className="p-2 text-center uppercase">Hitos</th>
                  <th className="p-2 text-center uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-base">
                {currentPageTareas.length > 0 ? (
                  currentPageTareas.map(tarea => (
                    <tr key={tarea.id} className="text-black">
                      <td className="p-2 text-center text-lg uppercase">{tarea.Nombre || 'Desconocido'}</td>
                      <td className="p-2 text-center text-lg uppercase">{tarea.Nombre_Proyecto || 'Desconocido'}</td>
                      <td className="p-2 text-center text-lg uppercase">{tarea.Fecha_Inicio || 'Desconocido'}</td>
                      <td className="p-2 text-center text-lg uppercase">{tarea.Fecha_Fin || 'Desconocido'}</td>
                      <td className={`p-2 text-center text-lg ${getEstadoColor(tarea.Estado || '')} rounded-lg uppercase`}>
                        {tarea.Estado || 'Desconocido'}
                      </td>
                      <td className="p-2 text-center text-lg uppercase">{tarea.Hitos ? 'Sí' : 'No'}</td>
                      <td className="p-2 flex justify-center space-x-4">
                        <CiEdit
                          onClick={() => handleEditClick(tarea)}
                          className="h-8 w-8 rounded-full p-1 hover:bg-gray-900 hover:text-white cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2 text-center" colSpan="7">No se encontraron resultados.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
              {currentPage > 1 && (
                <button
                  onClick={handlePreviousPage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Anterior
                </button>
              )}
              <span>Página {currentPage} de {totalPages}</span>
              {currentPage < totalPages && (
                <button
                  onClick={handleNextPage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Siguiente
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {editingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Editar Estado de Tarea</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Estado</label>
                <select
                  value={newEstado}
                  onChange={(e) => setNewEstado(e.target.value)}
                  className="w-full bg-gray-200 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Ejecucion">En Ejecucion</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Cancelado">Cancelado</option>
                  <option value="Suspendido">Suspendido</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
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
    </div>
  );
};

export default Tabla;
