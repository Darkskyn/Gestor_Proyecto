import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const MenuRecurso = ({ idrecurso }) => {
  const [recursos, setRecursos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recursoActual, setRecursoActual] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:1337/api/recursos?filters[Id_menu_recurso][$eq]=${parseInt(idrecurso)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data); // Muestra la respuesta en la consola
        if (data.data) {
          setRecursos(data.data); // Actualiza el estado de recursos con los recursos recibidos
        }
      })
      .catch(error => console.error('Error al obtener recursos:', error));
  }, [idrecurso]); // El efecto se ejecuta cuando idrecurso cambia

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
        const response = await fetch(`http://localhost:1337/api/recursos/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          // Eliminar el recurso de la lista
          const updatedRecursos = recursos.filter(recurso => recurso.id !== id);
          setRecursos(updatedRecursos); // Actualizar el estado de recursos
          Swal.fire('¡Eliminado!', 'El recurso ha sido eliminado.', 'success');
        } else {
          console.error('Error al eliminar el recurso:', response.statusText);
          Swal.fire('Error', 'Hubo un problema al eliminar el recurso.', 'error');
        }
      } catch (error) {
        console.error('Error al eliminar el recurso:', error);
        Swal.fire('Error', 'Hubo un problema al eliminar el recurso.', 'error');
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Actualiza el término de búsqueda
  };

  // Función para encontrar y devolver el recurso por su ID
  const findRecursoById = (id) => {
    return recursos.find(recurso => recurso.id === id);
  };

  // Obtener el recurso actual si se proporciona el ID
  useEffect(() => {
    if (idrecurso) {
      const foundRecurso = findRecursoById(parseInt(idrecurso));
      setRecursoActual(foundRecurso);
    } else {
      setRecursoActual(null);
    }
  }, [idrecurso, recursos]);

  // Filtrar recursos basado en el término de búsqueda
  const filteredRecursos = recursos.filter(recurso =>
    recurso.attributes.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
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

      <section className="mt-10 bg-white px-4 py-8 text-black antialiased">
        <div className="container mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-800">
              <thead className="bg-blue-700 text-white text-sm font-semibold uppercase">
                <tr>
                  <th className="p-2 text-center">Nombre</th>
                  <th className="p-2 text-center">Descripcion</th>
                  <th className="p-2 text-center">Id_menu_recurso</th>
                  <th className="p-2 text-center">Estado</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-base">
                {filteredRecursos.map(recurso => (
                  <tr key={recurso.id}>
                    <td className="p-2 text-center">{recurso.attributes.Nombre}</td>
                    <td className="p-2 text-center">{recurso.attributes.Descripcion}</td>
                    <td className="p-2 text-center">{recurso.attributes.Id_menu_recurso}</td>
                    <td className="p-2 text-center">{recurso.attributes.Estado}</td>
                    <td className="p-2 flex justify-center space-x-4">
                      <svg
                        onClick={() => handleDelete(recurso.id)}
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
                          d="M19 7l-4-4m0 0L9 7m4-4v14a2 2 0 01-2 2H7a2 2 0 01-2-2V3a2 2 0 012-2h5m3 0a2 2 0 012 2v14a2 2 0 01-2 2h-5a2 2 0 01-2-2V3a2 2 0 012-2h3z"
                        ></path>
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
                
      {idrecurso && recursoActual && (
        <section className="mt-10 bg-white px-4 py-8 text-black antialiased">
          <h2 className="text-2xl font-semibold mb-4">Detalles del Recurso Seleccionado</h2>
          <div className="container mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-800">
                <thead className="bg-blue-700 text-white text-sm font-semibold uppercase">
                  <tr>
                    <th className="p-2 text-center">Nombre</th>
                    <th className="p-2 text-center">Descripcion</th>
                    <th className="p-2 text-center">Id_menu_recurso</th>
                    <th className="p-2 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="text-base">
                  <tr>
                    <td className="p-2 text-center">{recursoActual.attributes.Nombre}</td>
                    <td className="p-2 text-center">{recursoActual.attributes.Descripcion}</td>
                    <td className="p-2 text-center">{recursoActual.attributes.Id_menu_recurso}</td>
                    <td className="p-2 text-center">{recursoActual.attributes.Estado}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default MenuRecurso;
