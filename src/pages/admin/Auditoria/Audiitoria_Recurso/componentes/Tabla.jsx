import React, { useState, useEffect } from 'react';

const Tabla = () => {
  const [searchTermMenuRecursos, setSearchTermMenuRecursos] = useState('');
  const [searchTermRecursos, setSearchTermRecursos] = useState('');
  const [menuRecursosData, setMenuRecursosData] = useState([]);
  const [recursosData, setRecursosData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    // Fetch data from the API with authentication token
    const fetchData = async () => {
      const authToken = localStorage.getItem('authToken'); // Get the token from localStorage
      
      // Fetch data for "Tipos de Recursos"
      const responseMenuRecursos = await fetch('http://localhost:1337/api/auditoria-menu-recursos', {
        headers: {
          'Authorization': `Bearer ${authToken}` // Include the token in the request header
        }
      });
      const resultMenuRecursos = await responseMenuRecursos.json();
      setMenuRecursosData(resultMenuRecursos.data);

      // Fetch data for "Recursos Creados"
      const responseRecursos = await fetch('http://localhost:1337/api/auditoria-recursos', {
        headers: {
          'Authorization': `Bearer ${authToken}` // Include the token in the request header
        }
      });
      const resultRecursos = await responseRecursos.json();
      setRecursosData(resultRecursos.data);
    };
    fetchData();
  }, []);

  // Filtered data for "Tipos de Recursos"
  const filteredMenuRecursosData = menuRecursosData.filter(item => {
    const nombreRecurso = item.attributes.Nombre_Recurso || '';
    const usuario = item.attributes.Usuario || '';
    const lowerCaseSearchTerm = searchTermMenuRecursos.toLowerCase();
    
    return (
      nombreRecurso.toLowerCase().includes(lowerCaseSearchTerm) ||
      usuario.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  // Filtered data for "Recursos Creados"
  const filteredRecursosData = recursosData.filter(item => {
    const nombreRecurso = item.attributes.Nombre_Recurso || '';
    const accion = item.attributes.Accion || '';
    const usuario = item.attributes.Usuario || '';
    const lowerCaseSearchTerm = searchTermRecursos.toLowerCase();
    
    return (
      nombreRecurso.toLowerCase().includes(lowerCaseSearchTerm) ||
      accion.toLowerCase().includes(lowerCaseSearchTerm) ||
      usuario.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMenuRecursosItems = filteredMenuRecursosData.slice(indexOfFirstItem, indexOfLastItem);
  const currentRecursosItems = filteredRecursosData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="w-full bg-[#0d30a1]/20 pb-9">
        {/* Tabla Tipos de Recursos */}
        <section className="mt-10 px-4 py-8 text-black antialiased">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Tipos de Recursos</h2>
              <input
                type="text"
                className="w-1/4 text-blue-900 placeholder-blue-900 backdrop-blur-sm bg-[#0d30a1]/20 py-2 pl-10 pr-4 rounded-lg focus:outline-none border-2 border-[#0d30a1] focus:border-blue-500 transition-colors duration-300"
                placeholder="Buscar por nombre de recurso o usuario..."
                value={searchTermMenuRecursos}
                onChange={(e) => setSearchTermMenuRecursos(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-800">
                <thead className="bg-blue-700 text-white text-base font-semibold uppercase">
                  <tr>
                    <th className="p-4 text-center">Fecha</th>
                    <th className="p-4 text-center">Usuario</th>
                    <th className="p-4 text-center">Nombre Recurso</th>
                    <th className="p-4 text-center">Acción</th>
                    <th className="p-4 text-center">Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-lg">
                  {currentMenuRecursosItems.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center">No se encontraron resultados.</td>
                    </tr>
                  ) : (
                    currentMenuRecursosItems.map(item => {
                      const fecha = new Date(item.attributes.Fecha || '');
                      const fechaStr = fecha.toLocaleDateString();
                      const horaStr = fecha.toLocaleTimeString(); // Solo la hora

                      return (
                        <tr key={item.id}>
                          <td className="p-4 text-center">{fechaStr}</td>
                          <td className="p-4 text-center">{item.attributes.Usuario || 'N/A'}</td>
                          <td className="p-4 text-center">{item.attributes.Nombre_Recurso || 'N/A'}</td>
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

        {/* Tabla Recursos Creados */}
        <section className="mt-10 px-4 py-8 text-black antialiased">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Recursos Creados</h2>
              <input
                type="text"
                className="w-1/4 text-blue-900 placeholder-blue-900 backdrop-blur-sm bg-[#0d30a1]/20 py-2 pl-10 pr-4 rounded-lg focus:outline-none border-2 border-[#0d30a1] focus:border-blue-500 transition-colors duration-300"
                placeholder="Buscar por nombre de recurso, usuario o acción..."
                value={searchTermRecursos}
                onChange={(e) => setSearchTermRecursos(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-800">
                <thead className="bg-blue-700 text-white text-base font-semibold uppercase">
                  <tr>
                    <th className="p-4 text-center">Fecha</th>
                    <th className="p-4 text-center">Usuario</th>
                    <th className="p-4 text-center">Nombre Recurso</th>
                    <th className="p-4 text-center">Acción</th>
                    <th className="p-4 text-center">Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-lg">
                  {currentRecursosItems.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center">No se encontraron resultados.</td>
                    </tr>
                  ) : (
                    currentRecursosItems.map(item => {
                      const fecha = new Date(item.attributes.Fecha || '');
                      const fechaStr = fecha.toLocaleDateString();
                      const horaStr = fecha.toLocaleTimeString(); // Solo la hora

                      return (
                        <tr key={item.id}>
                          <td className="p-4 text-center">{fechaStr}</td>
                          <td className="p-4 text-center">{item.attributes.Usuario || 'N/A'}</td>
                          <td className="p-4 text-center">{item.attributes.Nombre_Recurso || 'N/A'}</td>
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

        {/* Pagination buttons */}
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
            ${currentRecursosItems.length < itemsPerPage ? 'invisible' : ''}`}
            onClick={() => paginate(currentPage + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tabla;
