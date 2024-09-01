import React, { useState, useEffect } from "react";
import { FiServer } from "react-icons/fi";

const Header = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("username");

    fetch("http://localhost:1337/api/proyectos")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error al obtener proyectos");
        }
      })
      .then((data) => {
        // Verificar el formato de los datos recibidos
        if (data && data.data) {
          const filteredProjects = data.data.filter(
            (project) => project.attributes.usuario_proyecto === currentUser
          );
          setProjects(filteredProjects);
        } else {
          throw new Error("Datos de proyectos no están en el formato esperado");
        }
      })
      .catch((error) => {
        console.error("Error al obtener proyectos:", error);
      });
  }, []);

  function openModal() {
    document.getElementById("myModal").classList.remove("hidden");
  }

  function closeModal() {
    document.getElementById("myModal").classList.add("hidden");
  }

  async function createProject() {
    if (selectedProjectId) {
      try {
        const authToken = localStorage.getItem("authToken");
        const username = localStorage.getItem("username");

        // Datos para enviar
        const auditData = {
          Fecha: new Date().toISOString(),
          id_proyectos: selectedProjectId,
          Id_tareas: null, // Valor predeterminado si no se tiene ID aún
          Nombre_Tarea: 'Nueva Tarea',
          Accion: 'Creacion',
          Usuario: username
        };

        console.log('Datos de auditoría:', auditData);

        // Registrar en auditoría
        const auditResponse = await fetch('http://localhost:1337/api/audotira-tareas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ data: auditData }) // Asegúrate de que los datos están envueltos en 'data'
        });

        // Verificar si la respuesta es ok
        if (!auditResponse.ok) {
          const errorText = await auditResponse.text();
          console.error('Error al enviar la auditoría:', errorText);
          throw new Error(errorText || 'Error al enviar la auditoría');
        }

        // Leer la respuesta del servidor
        const auditResponseJson = await auditResponse.json();
        console.log('Respuesta del backend:', auditResponseJson);

        // Redirigir a la página Crear_tarea2
        window.location.href = `/Crear_tarea2?idproyect=${selectedProjectId}`;
        closeModal();

      } catch (error) {
        console.error('Error al crear la tarea o enviar la auditoría:', error);
        alert(`Error al crear la tarea o registrar la auditoría: ${error.message}`);
      }
    } else {
      alert("Seleccione un proyecto antes de continuar.");
    }
  }

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-black text-2xl md:text-3xl font-bold flex items-center">
        <FiServer className="mr-2" />
        Mis Tareas
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
        <p className="text-white">Nueva Tarea</p>
      </button>

      <div
        id="myModal"
        className="fixed inset-0 z-10 overflow-hidden backdrop-blur-lg hidden flex items-center justify-center transition-transform duration-300"
      >
        <div className="modal-container p-6 backdrop-blur-sm bg-white/90 w-11/12 sm:w-11/12 md:w-8/12 lg:w-6/12 rounded-md shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Crear Nueva Tarea</h2>
          
          <label
            htmlFor="projectSelect"
            className="block text-sm font-medium text-black mb-2"
          >
            Seleccione Proyecto
          </label>
          <select
            id="projectSelect"
            className="w-full p-2 mb-4 rounded-lg focus:outline-none border-2 border-[#0d30a1d0] focus:border-green-500 transition-colors duration-300"
            onChange={(e) => setSelectedProjectId(e.target.value)} // Actualizar estado del ID del proyecto seleccionado
          >
            <option value="" disabled selected>
              Seleccionar proyecto
            </option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.attributes.Nombre_Proyecto}
              </option>
            ))}
          </select>

          <div className="flex justify-end">
            <button
              className="bg-gradient-to-r bg-[#0d30a1d0] border border-fuchsia-00 hover:border-violet-100 text-white font-semibold py-2 px-4 rounded-md mr-2"
              onClick={createProject}
            >
              Crear
            </button>
            <button
              className="bg-gradient-to-r bg-[#0d30a1d0] border border-fuchsia-00 hover:border-violet-100 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
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
