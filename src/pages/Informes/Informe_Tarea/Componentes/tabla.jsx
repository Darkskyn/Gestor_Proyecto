import React, { useState, useEffect } from 'react';
import { AiFillFilePdf } from 'react-icons/ai';
import { FcPlus } from 'react-icons/fc';

// Función para asignar clases de color basadas en el estado
const getColorClass = (estado) => {
  switch (estado) {
    case 'Finalizado':
      return 'bg-green-500 text-white';
    case 'Ejecucion':
      return 'bg-yellow-500 text-white';
    case 'Suspendido':
      return 'bg-orange-500 text-white';
    case 'Cancelado':
      return 'bg-red-500 text-white';
    case 'Pendiente':
      return 'bg-purple-500 text-white';
    default:
      return '';
  }
};

// Función para convertir SLA en horas a días
const convertSLAInHoursToDays = (slaHours) => {
  if (slaHours === null || slaHours === undefined) return 'N/A';
  const days = Math.floor(slaHours / 24);
  const hours = slaHours % 24;
  return hours > 0 ? `${days} días y ${hours} horas` : `${days} días`;
};

const Tabla = () => {
  const [tareas, setTareas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [newSLA, setNewSLA] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedTask, setSelectedTask] = useState(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    fetch('http://localhost:1337/api/tareas?populate=Adjunto', {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Fetched tasks:', data.data); // Mostrar las tareas obtenidas
        setTareas(data.data);
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, [authToken]);

  const handleEditClick = (task) => {
    setEditingTask(task);
    setNewSLA(task.attributes.SLA || '');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Aquí deberías agregar lógica para guardar el SLA editado
    setEditingTask(null);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(tareas.length / itemsPerPage);
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handleTaskSelection = (task) => {
    setSelectedTask(task);
    handleUploadClick(); // Llama a la función de carga
  };

  const filteredTareas = tareas.filter(task =>
    task.attributes.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTareas = filteredTareas.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredTareas.length / itemsPerPage);

  const handlePdfButtonClick = (task) => {
    if (!task || !task.id) {
      console.error('Task or task.id is missing.');
      return;
    }
    setSelectedTask(task);
    setPdfModalOpen(true);
  };

  const handleUploadClick = () => {
    if (!selectedTask) {
      console.error('No task selected for upload.');
      return;
    }
    setUploadModalOpen(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type === 'application/pdf');
    if (validFiles.length < files.length) {
      setUploadError('Algunos archivos no son PDFs y han sido ignorados.');
    } else {
      setUploadError('');
    }
    setPdfFiles(validFiles);
  };

  const uploadFiles = () => {
    if (pdfFiles.length === 0) {
      setUploadError('No se han seleccionado archivos para subir.');
      return;
    }

    const formData = new FormData();
    pdfFiles.forEach(file => formData.append('files.files', file)); // Nota: Usa 'files.files' para que coincida con el backend

    fetch('http://localhost:1337/api/upload', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          console.log('Archivos subidos exitosamente:', data); // Mostrar en consola
          setUploadSuccess('Archivos subidos exitosamente.');
          setUploadError('');
          const fileIds = data.map(file => file.id);
          updateTaskWithFiles(fileIds);
        } else {
          console.error('Formato de respuesta inesperado:', data); // Mostrar en consola
          throw new Error('Formato de respuesta inesperado.');
        }
      })
      .catch(error => {
        console.error('Error al subir archivos:', error); // Mostrar en consola
        setUploadError('Error al subir archivos. Inténtelo de nuevo.');
      });
  };

  const updateTaskWithFiles = (fileIds) => {
    if (!selectedTask) {
      console.error('No task selected.');
      return;
    }
  
    const taskId = selectedTask.id;
  
    fetch(`http://localhost:1337/api/tareas/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        data: {
          Adjunto: fileIds.map(id => ({ id })) 
        }
      })
    })
      .then(response => response.json())
      .then(updatedTask => {
        console.log('Tarea actualizada exitosamente:', updatedTask);
        setTareas(prevTareas =>
          prevTareas.map(task =>
            task.id === taskId ? updatedTask.data : task
          )
        );
        setUploadModalOpen(false);
        setUploadSuccess('Tarea actualizada exitosamente.');
      })
      .catch(error => {
        console.error('Error al actualizar la tarea:', error);
        setUploadError('Error al actualizar la tarea. Inténtelo de nuevo.');
      });
  };

  return (
    <div className="bg-transparent">
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
                    <th className="p-2 text-center">Nombre</th>
                    <th className="p-2 text-center">Fecha Inicio</th>
                    <th className="p-2 text-center">Fecha Fin</th>
                    <th className="p-2 text-center">Estado</th>
                    <th className="p-2 text-center">SLA</th>
                    <th className="p-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTareas.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-4 text-center">No se encontraron resultados.</td>
                    </tr>
                  ) : (
                    currentTareas.map(task => (
                      <tr key={task.id}>
                        <td className="p-2 text-center">{task.attributes.Nombre}</td>
                        <td className="p-2 text-center">{task.attributes.Fecha_Inicio}</td>
                        <td className="p-2 text-center">{task.attributes.Fecha_Fin}</td>
                        <td className={`p-2 text-center ${getColorClass(task.attributes.Estado)}`}>
                          {task.attributes.Estado}
                        </td>
                        <td className="p-2 text-center">
                          {convertSLAInHoursToDays(task.attributes.SLA)}
                        </td>
                        <td className="p-2 text-center">
                          {task.attributes.Adjunto?.data?.length ? (
                            <>
                              <button
                                onClick={() => handlePdfButtonClick(task)}
                                className="bg-white border-2 border-red-500 p-2 rounded-full hover:bg-gray-100"
                                aria-label="Ver archivos PDF"
                              >
                                <AiFillFilePdf className="text-red-500 h-6 w-6" />
                              </button>
                              <button
                                onClick={() => handleTaskSelection(task)}
                                className="p-2 rounded-full hover:bg-gray-100"
                                aria-label="Agregar PDF"
                              >
                                <FcPlus className="h-6 w-6" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="bg-white border-2 border-red-500 p-2 rounded-full hover:bg-gray-100"
                                aria-label="No hay archivos PDF"
                              >
                                <AiFillFilePdf className="text-red-500 h-6 w-6" />
                              </button>
                              <button
                                onClick={() => handleTaskSelection(task)}
                                className="p-2 rounded-full hover:bg-gray-100"
                                aria-label="Agregar PDF"
                              >
                                <FcPlus className="h-6 w-6" />
                              </button>
                            </>
                          )}
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

      {editingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Editar SLA de la Tarea</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">SLA</label>
                <input
                  type="text"
                  value={newSLA}
                  onChange={(e) => setNewSLA(e.target.value)}
                  className="mt-1 block w-full bg-gray-200 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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

      {pdfModalOpen && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-4/12 max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Archivos PDF</h2>
            <ul className="space-y-3">
              {selectedTask.attributes.Adjunto?.data?.length ? (
                selectedTask.attributes.Adjunto.data.map((file) => (
                  <li key={file.id} className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg shadow-sm">
                    <AiFillFilePdf className="text-red-500 h-6 w-6" />
                    <a
                      href={`http://localhost:1337${file.attributes.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-lg font-medium"
                    >
                      {file.attributes.name}
                    </a>
                  </li>
                ))
              ) : (
                <li className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg shadow-sm">
                  <AiFillFilePdf className="text-red-500 h-6 w-6" />
                  <span className="text-red-500 text-lg font-medium">No hay archivos PDF disponibles.</span>
                </li>
              )}
            </ul>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setPdfModalOpen(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {uploadModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Agregar Archivos PDF</h2>
            <form onSubmit={(e) => { e.preventDefault(); uploadFiles(); }}>
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleFileChange}
                className="mb-4 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              {uploadError && <p className="text-red-500 mb-4">{uploadError}</p>}
              {uploadSuccess && <p className="text-green-500 mb-4">{uploadSuccess}</p>}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Subir
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
