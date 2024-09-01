import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faInfoCircle, faCheckCircle, faWrench } from '@fortawesome/free-solid-svg-icons';

const Tareas = () => {
  const [tareas, setTareas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6; // Número máximo de tareas por página
  const usuarioActual = localStorage.getItem('username'); // Obtener usuario actual desde localStorage

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        // Construye la URL con el término de búsqueda
        let url = `http://localhost:1337/api/tareas?populate=Id_proyecto`;
        if (searchTerm) {
          url += `&search=${encodeURIComponent(searchTerm)}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setTareas(data.data); // Asignamos las tareas obtenidas del API
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTareas();
  }, [searchTerm]); // Ejecutar efecto cuando cambie searchTerm

  // Filtrar tareas según el término de búsqueda
  const filteredTareas = tareas.filter(tarea => {
    const nombreTarea = tarea.attributes.Nombre.toLowerCase();
    return nombreTarea.includes(searchTerm.toLowerCase());
  });

  // Calcular índices de tareas por página
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;

  // Tareas a mostrar en la página actual
  const currentTasks = filteredTareas.slice(startIndex, endIndex);

  // Función para manejar cambios en el input de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase()); // Actualiza el término de búsqueda en minúsculas
    setCurrentPage(1); // Reinicia a la primera página al cambiar el término de búsqueda
  };

  // Función para obtener el ícono de prioridad
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

  // Función para obtener el color del estado del proyecto
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

  // Función para manejar el clic en una tarea y redireccionar
  const handleClickTarea = (id) => {
    window.location.href = `/Info?tareaId=${id}`; // Redirige al usuario a la página de información con el ID de la tarea
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

      {tareas.length === 0 ? (
        <p className="text-center text-gray-800">Cargando tareas...</p>
      ) : (
        <>
          {filteredTareas.length === 0 && searchTerm && (
            <p className="text-center text-gray-800">No se encontraron tareas con ese nombre.</p>
          )}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {currentTasks.map(tarea => (
              <div
                key={tarea.id}
                className="transition-all duration-1000 bg-white  hover:shadow-xl m-2 p-4 relative z-40 group rounded-md shadow-sm cursor-pointer overflow-hidden"
                style={{ position: 'relative', zIndex: 1 }}
                onClick={() => handleClickTarea(tarea.id)} // Manejar clic en la tarea
              >
                <div
                  className="absolute bg-blue-500/50 top-0 left-0 w-24 h-1 z-30 transition-all duration-200 group-hover:bg-green-500 group-hover:w-1/2"
                  style={{ zIndex: 1 }}
                ></div>
                <div className="py-2 px-9 relative group-hover:text-white">
                  {tarea.attributes.Hitos && (
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faWrench} className="text-green-500 mr-2" />
                      <span className="font-bold text-blue-500 ">Es un hito</span>
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
        </>
      )}
    </>
  );
};

export default Tareas;
