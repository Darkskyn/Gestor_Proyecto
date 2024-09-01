import React, { useState, useEffect } from 'react';

const Tabla = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [auditoriaData, setAuditoriaData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    // Fetch data from the API with authentication token
    const fetchData = async () => {
      const authToken = localStorage.getItem('authToken'); // Get the token from localStorage
      const response = await fetch('http://localhost:1337/api/audotira-tareas', {
        headers: {
          'Authorization': `Bearer ${authToken}` // Include the token in the request header
        }
      });
      const result = await response.json();
      setAuditoriaData(result.data);
    };
    fetchData();
  }, []);

  const filteredData = auditoriaData.filter(item => {
    const nombreTarea = item.attributes.Nombre_Tarea || '';
    const usuario = item.attributes.Usuario || '';
    const accion = item.attributes.Accion || '';
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    return (
      nombreTarea.toLowerCase().includes(lowerCaseSearchTerm) ||
      usuario.toLowerCase().includes(lowerCaseSearchTerm) ||
      accion.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="w-full pl-[800px]">
        <div className="relative mt-16 w-full">
          <input
            type="text"
            className="w-11/12 text-blue-900 placeholder-blue-900 backdrop-blur-sm bg-[#0d30a1]/20 py-2 pl-10 pr-4 rounded-lg focus:outline-none border-2 border-[#0d30a1] focus:border-blue-500 transition-colors duration-300"
            placeholder="Buscar por nombre de tarea, usuario o acción..."
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
                <thead className="bg-blue-700 text-white text-base font-semibold uppercase">
                  <tr>
                    <th className="p-4 text-center">Fecha</th>
                    <th className="p-4 text-center">Usuario</th>
                    <th className="p-4 text-center">Nombre Tarea</th>
                    <th className="p-4 text-center">Acción</th>
                    <th className="p-4 text-center">Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-lg">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center">No se encontraron resultados.</td>
                    </tr>
                  ) : (
                    currentItems.map(item => {
                      const fecha = new Date(item.attributes.Fecha || '');
                      const fechaStr = fecha.toLocaleDateString();
                      const horaStr = fecha.toLocaleTimeString();

                      return (
                        <tr key={item.id}>
                          <td className="p-4 text-center">{fechaStr}</td>
                          <td className="p-4 text-center">{item.attributes.Usuario || 'N/A'}</td>
                          <td className="p-4 text-center">{item.attributes.Nombre_Tarea || 'N/A'}</td>
                          <td className="p-4 text-center">{item.attributes.Accion || 'N/A'}</td>
                          <td className="p-4 text-center">{horaStr}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-center mt-4">
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none 
          ${currentPage === 1 ? 'invisible' : ''}`}
          onClick={() => paginate(currentPage - 1)}
        >
          Anterior
        </button>
        <button
          className={`ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none 
          ${currentItems.length < itemsPerPage ? 'invisible' : ''}`}
          onClick={() => paginate(currentPage + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Tabla;
