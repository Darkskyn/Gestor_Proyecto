import React, { useState, useEffect } from 'react';

const Tabla = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem('authToken'); // Get the token from localStorage
      
      // Fetch data from the new API
      const response = await fetch('http://localhost:1337/api/auditoria-inicio-sesions?populate=Id_usuario', {
        headers: {
          'Authorization': `Bearer ${authToken}` // Include the token in the request header
        }
      });
      const result = await response.json();
      setData(result.data);
    };
    fetchData();
  }, []);

  // Filtered data
  const filteredData = data.filter(item => {
    const nombreRecurso = item.attributes.Nombre_Recurso || '';
    const usuario = item.attributes.Id_usuario?.data?.attributes?.username || ''; // Access username
    const accion = item.attributes.Accion || '';
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    return (
      nombreRecurso.toLowerCase().includes(lowerCaseSearchTerm) ||
      usuario.toLowerCase().includes(lowerCaseSearchTerm) ||
      accion.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to map action names to their full descriptions
  const mapAccion = (accion) => {
    switch (accion.toLowerCase()) {
      case 'inicio':
        return 'Inicio de Sesión';
      case 'cierre':
        return 'Cierre de Sesión';
      default:
        return accion;
    }
  };

  return (
    <div>
      <div className="w-full bg-[#0d30a1]/20 pb-9">
        {/* Tabla Auditorio de Inicio de Sesiones */}
        <section className="mt-10 px-4 py-8 text-black antialiased">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Auditorio de Inicio de Sesiones</h2>
              <input
                type="text"
                className="w-1/4 text-blue-900 placeholder-blue-900 backdrop-blur-sm bg-[#0d30a1]/20 py-2 pl-10 pr-4 rounded-lg focus:outline-none border-2 border-[#0d30a1] focus:border-blue-500 transition-colors duration-300"
                placeholder="Buscar por Usuario, Accion..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-800">
                <thead className="bg-blue-700 text-white text-base font-semibold uppercase">
                  <tr>
                    <th className="p-4 text-center">Fecha</th>
                    <th className="p-4 text-center">Usuario</th>
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
                      const horaStr = fecha.toLocaleTimeString(); // Solo la hora
                      const usuario = item.attributes.Id_usuario?.data?.attributes?.username || 'N/A'; // Access username
                      const accion = mapAccion(item.attributes.Accion || ''); // Map action to full description

                      return (
                        <tr key={item.id}>
                          <td className="p-4 text-center">{fechaStr}</td>
                          <td className="p-4 text-center">{usuario}</td>
                          <td className="p-4 text-center">{accion}</td>
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
            ${currentItems.length < itemsPerPage ? 'invisible' : ''}`}
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

