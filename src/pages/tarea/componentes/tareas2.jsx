import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faInfoCircle, faCheckCircle, faWrench } from '@fortawesome/free-solid-svg-icons';

const Tareas = () => {
  const [tareas, setTareas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6;
  const usuarioActual = localStorage.getItem('username')?.trim().toLowerCase() || '';

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        let url = `http://localhost:1337/api/tareas?populate=Id_proyecto`;

        const response = await fetch(url);
        const data = await response.json();

        console.log('Datos obtenidos:', data);
        console.log('Usuario actual:', usuarioActual);

        // Filtrar las tareas según el usuario actual
        const filteredTareas = data.data.filter(tarea => 
          tarea.attributes.Id_proyecto.data?.attributes.usuario_proyecto?.trim().toLowerCase() === usuarioActual
        );

        // Aplicar búsqueda por título y estado
        if (searchTerm) {
          const lowercasedTerm = searchTerm.toLowerCase();
          setTareas(filteredTareas.filter(tarea => 
            tarea.attributes.Nombre.toLowerCase().includes(lowercasedTerm) ||
            tarea.attributes.Estado.toLowerCase().includes(lowercasedTerm)
          ));
        } else {
          setTareas(filteredTareas);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTareas();
  }, [searchTerm, usuarioActual]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const currentTasks = tareas.slice(startIndex, endIndex);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(tareas.length / tasksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getIconoPrioridad = (prioridad) => {
    switch (prioridad) {
      case 'Alta':
        return <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />;
      case 'Media':
        return <FontAwesomeIcon icon={faInfoCircle} className="text-yellow-500" />;
      case 'Baja':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
      default:
        return null;
    }
  };

  const getColorEstadoProyecto = (estado) => {
    switch (estado) {
      case 'Completado':
        return 'text-green-500';
      case 'Cancelado':
        return 'text-red-500';
      case 'En Progreso':
        return 'text-yellow-500';
      default:
        return 'text-gray-600';
    }
  };

  const redirigirATarea = (id) => {
    window.location.href = `/Info_tarea?tareaId=${id}`;
  };

  return (
    <>
      <div className="w-full flex justify-center p-1 mb-4">
        <div className="relative w-full">
          <input
            type="text"
            className="w-full text-blue-900 placeholder-blue-900 backdrop-blur-sm bg-[#0d30a1]/20 py-2 pl-10 pr-4 rounded-lg focus:outline-none border-2 border-[#0d30a1] focus:border-blue-500 transition-colors duration-300"
            placeholder="Buscar por título o estado..."
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

      {tareas.length === 0 ? (
        <p className="text-center text-gray-800">No hay Tareas Disponibles</p>
      ) : (
        <>
          {currentTasks.length === 0 && searchTerm && (
            <p className="text-center text-gray-800">No se encontraron tareas con ese título o estado.</p>
          )}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {currentTasks.map(tarea => (
              <div
                key={tarea.id}
                className="transition-all duration-1000 bg-white hover:shadow-xl m-2 p-4 relative z-40 group rounded-md shadow-sm cursor-pointer overflow-hidden"
                style={{ position: 'relative', zIndex: 1 }}
                onClick={() => redirigirATarea(tarea.id)}
              >
                <div
                  className="absolute bg-blue-500/50 top-0 left-0 w-24 h-1 z-30 transition-all duration-200 group-hover:bg-green-500 group-hover:w-1/2"
                  style={{ zIndex: 1 }}
                ></div>
                <div className="py-2 px-9 relative group-hover:text-white">
                  {tarea.attributes.Hitos && (
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faWrench} className="text-green-500 mr-2" />
                      <span className="font-bold text-blue-500">Es un hito</span>
                    </div>
                  )}
                  <h2 className="mt-4 text-2xl font-semibold text-black">{tarea.attributes.Nombre.toUpperCase()}</h2>
                  <p className="mt-2 text-sm text-gray-600">Fecha de inicio: {tarea.attributes.Fecha_Inicio}</p>
                  <p className="text-sm text-gray-600">Fecha de fin: {tarea.attributes.Fecha_Fin}</p>
                  <p className="mt-2 text-sm text-gray-600">Estado: {tarea.attributes.Estado}</p>
                  <div className="mt-2 text-sm flex items-center text-gray-600">
                    {getIconoPrioridad(tarea.attributes.Prioridad)}
                    <span className="ml-2">{tarea.attributes.Prioridad}</span>
                  </div>
                  <div className="mt-4 text-gray-600">
                    <p className={`text-sm font-bold ${getColorEstadoProyecto(tarea.attributes.Id_proyecto.data.attributes.Estado_Proyecto)}`}>
                      Proyecto: {tarea.attributes.Id_proyecto.data.attributes.Nombre_Proyecto.toUpperCase()}
                    </p>
                    <p className="text-xs">Gerente del Proyecto: {tarea.attributes.Id_proyecto.data.attributes.Gerente_Proyecto}</p>
                    <p className="text-xs">
                      Estado del Proyecto: <span className={getColorEstadoProyecto(tarea.attributes.Id_proyecto.data.attributes.Estado_Proyecto)}>
                        {tarea.attributes.Id_proyecto.data.attributes.Estado_Proyecto}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controles de paginación */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800'} rounded-lg`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-1 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Tareas;
