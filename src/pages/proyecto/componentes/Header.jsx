import React, { useState } from "react";
import { FiServer } from "react-icons/fi";

const Header = () => {
  const [projectName, setProjectName] = useState(""); // Estado para almacenar el nombre del proyecto

  // Función para abrir el modal
  function openModal() {
    document.getElementById("myModal").classList.remove("hidden");
  }

  // Función para cerrar el modal
  function closeModal() {
    document.getElementById("myModal").classList.add("hidden");
  }

  // Función para manejar la creación del proyecto y el recurso
  function createProject() {
    // Construir el objeto con la información del proyecto
    const projectData = {
      Nombre_Proyecto: projectName
    };

    // Enviar solicitud POST a la API para crear el proyecto
    fetch('http://localhost:1337/api/proyectos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: projectData }), // Enviar la información del proyecto dentro de 'data'
    })
    .then(response => response.json())
    .then(data => {
      const projectId = data.data.id; // Obtener el ID del proyecto creado
      
      window.location.href = `/recurso?projectId=${projectId}&projectName=${projectName}`;
    })
    .catch(error => {
      console.error('Error al enviar la solicitud para crear el proyecto:', error);
    });

    closeModal();
  }

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-Black text-2xl md:text-3xl font-bold flex items-center">
        <FiServer className="mr-2" />
        Mis Proyectos <span className="text-primary-100"></span>
      </h1>
      <button
        id="openModalBtn"
        className="flex mt-5 items-center bg-gradient-to-r from-[#0d17a1] to-[#00ff04d7] border border-fuchsia-00 hover:border-violet-100 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300"
        onClick={openModal}
      >
        <svg
          className="w-5 h-5 mr-2 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <p className="text-white">Nuevo Proyecto</p>
      </button>

      <div
        id="myModal"
        className="fixed inset-0 z-10 overflow-hidden backdrop-blur-lg hidden flex items-center justify-center transition-transform duration-300"
      >
        <div className="modal-container p-6 backdrop-blur-sm bg-white/90 w-11/12 sm:w-11/12 md:w-8/12 lg:w-6/12 rounded-md shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Crear Nuevo Proyecto</h2>
          <label
            htmlFor="projectName"
            className="block text-sm font-medium text-black mb-2"
          >
            Nombre Proyecto
          </label>
          <input
            type="text"
            id="projectName"
            className="w-full p-2 mb-4 rounded-lg focus:outline-none border-2 border-[#0d30a1d0] focus:border-green-500 transition-colors duration-300"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)} // Actualizar el estado cuando cambia el valor del input
          />

          <div className="flex justify-end">
            <button
              className="bg-gradient-to-r bg-[#0d30a1d0]  border border-fuchsia-00 hover:border-violet-100 text-white font-semibold py-2 px-4 rounded-md mr-2"
              onClick={createProject}
            >
              Crear
            </button>
            <button
              className="bg-gradient-to-r bg-[#0d30a1d0]  border border-fuchsia-00 hover:border-violet-100 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
              onClick={closeModal}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
