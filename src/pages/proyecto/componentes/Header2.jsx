import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Importa SweetAlert2
import { FiServer, FiEdit } from "react-icons/fi";

const Header = ({ idproyect }) => {
  const [projectData, setProjectData] = useState({
    Nombre_Proyecto: "",
    Estado_Proyecto: "",
    Departamento: "",
    Objetivo_Proyecto: "",
    Prioridad: "",
    Gerente_Proyecto: "",
  });

  const [usuariosAdmin, setUsuariosAdmin] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchProjectData();
    fetchUsuariosAdmin();
  }, [idproyect]);

  const fetchProjectData = async () => {
    try {
      const response = await axios.get(`http://localhost:1337/api/proyectos/${idproyect}`);
      const { data } = response.data;

      if (data && data.attributes) {
        setProjectData(data.attributes);
      } else {
        console.error('Data or attributes not found in API response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };

  const fetchUsuariosAdmin = async () => {
    try {
      const response = await axios.get('http://localhost:1337/api/users?populate=role');
      const usuarios = response.data;

      const adminUsers = usuarios.filter(user => user.role.name === 'Admin');
      const nombresAdmin = adminUsers.map(user => user.username);

      setUsuariosAdmin(nombresAdmin);
    } catch (error) {
      console.error('Error fetching admin users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:1337/api/proyectos/${idproyect}`, {
        data: projectData 
      });

      // Muestra el mensaje de éxito con SweetAlert2
      await Swal.fire({
        title: 'Éxito',
        text: 'El proyecto se actualizó correctamente.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      setModalOpen(false);
      // Recarga la página después de mostrar el mensaje
      window.location.reload();
    } catch (error) {
      console.error('Error updating project:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al actualizar el proyecto.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleEditClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gray-100">
      <h1 className="text-black text-2xl md:text-3xl font-bold flex items-center">
        <FiServer className="mr-2" />
        Previsualización del Proyecto: {" "}
        {projectData.Nombre_Proyecto && (
          <span className="bg-green-500 text-white p-1 rounded-lg font-bold">{projectData.Nombre_Proyecto.toUpperCase()}</span>
        )}
      </h1>

      <button
        id="openModalBtn"
        className="flex items-center bg-gradient-to-r from-blue-700 to-green-500 border border-green-500 hover:border-violet-500 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
        onClick={handleEditClick}
      >
        <FiEdit className="mr-2" />
        EDITAR PROYECTO
      </button>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-900 bg-opacity-50 fixed inset-0"></div>
          <div className="modal-container p-6 bg-white shadow-lg rounded-lg w-11/12 sm:w-11/12 md:w-8/12 lg:w-6/12 relative z-10">
            <h2 className="text-xl font-semibold mb-6 uppercase">Editar Proyecto</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="Nombre_Proyecto" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Proyecto
              </label>
              <input
                type="text"
                id="Nombre_Proyecto"
                name="Nombre_Proyecto"
                className="w-full p-2 mb-4 rounded-lg border border-green-500 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                value={projectData.Nombre_Proyecto}
                onChange={handleInputChange}
              />


              <label htmlFor="Departamento" className="block text-sm font-medium text-gray-700 mb-2">
                Departamento
              </label>
              <select
                id="Departamento"
                name="Departamento"
                className="w-full p-2 mb-4 rounded-lg border border-green-500 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                value={projectData.Departamento}
                onChange={handleInputChange}
              >
                <option value="Requerimiento">Requerimiento</option>
                <option value="Proyecto">Proyecto</option>
              </select>

              <label htmlFor="Objetivo_Proyecto" className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo Proyecto
              </label>
              <textarea
                id="Objetivo_Proyecto"
                name="Objetivo_Proyecto"
                className="w-full p-2 mb-4 rounded-lg border border-green-500 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                value={projectData.Objetivo_Proyecto}
                onChange={handleInputChange}
              />

              

              <label htmlFor="Gerente_Proyecto" className="block text-sm font-medium text-gray-700 mb-2">
                Gerente Proyecto
              </label>
              <select
                id="Gerente_Proyecto"
                name="Gerente_Proyecto"
                className="w-full p-2 mb-4 rounded-lg border border-green-500 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                value={projectData.Gerente_Proyecto}
                onChange={handleInputChange}
              >
                {usuariosAdmin.map((usuario, index) => (
                  <option key={index} value={usuario}>
                    {usuario}
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-blue-700 border border-green-500 hover:border-violet-500 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  className="bg-gradient-to-r from-red-500 to-red-700 border border-red-500 hover:border-red-800 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
