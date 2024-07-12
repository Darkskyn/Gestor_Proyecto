import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6; // Número máximo de proyectos por página

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/proyectos');
        setProyectos(response.data.data); // Asignamos los proyectos obtenidos del API
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProyectos();
  }, []);

  // Filtrar y paginar proyectos según el término de búsqueda
  const filteredProyectos = proyectos.filter(proyecto =>
    proyecto.attributes.Nombre_Proyecto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular índices de proyectos por página
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;

  // Proyectos a mostrar en la página actual
  const currentProjects = filteredProyectos.slice(startIndex, endIndex);

  // Función para manejar cambios en el input de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Actualiza el término de búsqueda
    setCurrentPage(1); // Reinicia a la primera página al cambiar el término de búsqueda
  };

  // Funciones para cambiar de página
  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  // Función para redireccionar al detalle del proyecto
  const redirectToProjectDetail = (projectId) => {
    // Construye la URL con el ID del proyecto
    window.location.href = `/Info_Proyect?projectId=${projectId}`;
  };

  // Función para obtener la clase CSS según el estado del proyecto
  const getStatusClass = (estado) => {
    switch (estado) {
      case 'Completado':
        return 'text-green-500';
      case 'En Progreso':
        return 'text-yellow-500';
      case 'Cancelado':
        return 'text-red-500';
      case 'Pendiente de Aprobación':
        return 'text-blue-500'
      default:
        return 'text-gray-700';
    }
  };

  return (
    <>
      <div className="w-full flex justify-center p-1 mb-4">
        <div className="relative w-full">
          <input
            type="text"
            className="w-full text-blue-900 placeholder-blue-900 backdrop-blur-sm bg-[#0d30a1]/20 py-2 pl-10 pr-4 rounded-lg focus:outline-none border-2 border-[#0d30a1] focus:border-blue-500 transition-colors duration-300"
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

      {filteredProyectos.length === 0 ? (
        <p className="text-center text-gray-800">No se encontraron proyectos con ese nombre.</p>
      ) : (
        <>
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {currentProjects.map((proyecto) => (
              <div
                key={proyecto.id}
                onClick={() => redirectToProjectDetail(proyecto.id)}
                className="backdrop-blur-sm bg-white/20 p-6 rounded-md shadow-sm cursor-pointer border-2 hover:border-green-500 border-blue-800 transition-colors duration-300"
              >
                <h2 className="text-xl font-semibold mb-4 uppercase">
                  {proyecto.attributes.Nombre_Proyecto}
                </h2>
                <p className="text-gray-700">{proyecto.attributes.Descripcion}</p>
                <div className="col-start-2 row-start-1 row-end-3 sm:mt-4 lg:mt-4 xl:mt-4">
                  <dl className="flex justify-end sm:justify-start lg:justify-end xl:justify-start -space-x-1.5">
                    <dt className="text-gray-500">Estado:</dt>
                    <dd className={`pl-2 ${getStatusClass(proyecto.attributes.Estado_Proyecto)}`}>
                      {proyecto.attributes.Estado_Proyecto || 'Sin estado'}
                    </dd>
                  </dl>
                </div>
              </div>
            ))}
          </div>

          {/* Navegación de páginas */}
          <div className="flex justify-center mt-4">
            {currentPage > 1 && (
              <button
                onClick={handlePrevPage}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l focus:outline-none mr-2"
              >
                Anterior
              </button>
            )}
            {currentProjects.length >= projectsPerPage && endIndex < filteredProyectos.length && (
              <button
                onClick={handleNextPage}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none"
              >
                Siguiente
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Proyectos;

