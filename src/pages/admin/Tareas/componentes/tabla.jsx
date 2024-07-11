import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const Tabla = () => {
  const [tareas, setTareas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:1337/api/tareas?populate=Id_proyecto')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Muestra la respuesta en la consola
        if (data.data) {
          // Extraer las tareas de la estructura de respuesta
          const extractedTareas = data.data.map(item => item.attributes);
          setTareas(extractedTareas); // Actualiza el estado de tareas con los datos extraídos
        }
      })
      .catch(error => console.error('Error al obtener tareas:', error));
  }, []); // El efecto se ejecuta una vez al montar el componente

  console.log('Tareas actuales:', tareas); // Verifica el estado actual de las tareas en el componente

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
        const response = await fetch(`http://localhost:1337/api/tareas/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          // Eliminar la tarea de la lista
          const updatedTareas = tareas.filter(tarea => tarea.id !== id);
          setTareas(updatedTareas); // Actualizar el estado de tareas
          Swal.fire('¡Eliminado!', 'La tarea ha sido eliminada.', 'success');
        } else {
          console.error('Error al eliminar la tarea:', response.statusText);
          Swal.fire('Error', 'Hubo un problema al eliminar la tarea.', 'error');
        }
      } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        Swal.fire('Error', 'Hubo un problema al eliminar la tarea.', 'error');
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Actualiza el término de búsqueda
  };

  // Filtrar las tareas cuando cambie el término de búsqueda
  const filteredTareas = tareas.filter(tarea =>
    tarea.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Tareas filtradas:', filteredTareas); // Verifica las tareas después de aplicar el filtro

  return (
    <div className="text-lg">
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

      <section className="mt-10 px-4 py-8 text-black antialiased">
        <div className="container mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-800">
              <thead className="bg-blue-700 text-white text-sm font-semibold uppercase">
                <tr>
                  <th className="p-2 text-center">Nombre</th>
                  <th className="p-2 text-center">Descripción</th>
                  <th className="p-2 text-center">Fecha Inicio</th>
                  <th className="p-2 text-center">Fecha Fin</th>
                  <th className="p-2 text-center">Estado</th>
                  <th className="p-2 text-center">Hitos</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-base">
                {filteredTareas.length > 0 ? (
                  filteredTareas.map(tarea => (
                    <tr key={tarea.id}>
                      <td className="p-2 text-center text-lg">{tarea.Nombre}</td>
                      <td className="p-2 text-center text-lg">{tarea.Descripcion}</td>
                      <td className="p-2 text-center text-lg">{tarea.Fecha_Inicio}</td>
                      <td className="p-2 text-center text-lg">{tarea.Fecha_Fin}</td>
                      <td className="p-2 text-center text-lg">{tarea.Estado}</td>
                      <td className="p-2 text-center text-lg">{tarea.Hitos ? 'Sí' : 'No'}</td>
                      <td className="p-2 flex justify-center space-x-4">
                        <svg
                          onClick={() => handleDelete(tarea.id)}
                          className="h-8 w-8 rounded-full p-1 hover:bg-gray-900 hover:text-white cursor-pointer"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2 text-center text-lg" colSpan="7">No se encontraron resultados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tabla;
