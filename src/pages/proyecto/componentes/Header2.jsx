import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiServer, FiEdit } from "react-icons/fi";

const Header = ({ idproyect }) => {
  const [projectData, setProjectData] = useState({
    Nombre_Proyecto: "",
    Descripcion: "",
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
        data: projectData // Enviar projectData dentro de un objeto 'data'
      });
      console.log('Proyecto actualizado correctamente');
      setModalOpen(false);
      window.location.reload(); // Recargar la página después de guardar los cambios
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleEditClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-black text-2xl md:text-3xl font-bold flex items-center">
        <FiServer className="mr-2" />
        Previsualización del Proyecto: {" "}
        {projectData.Nombre_Proyecto && (
          <span className="bg-green-500 text-white p-1 rounded">{projectData.Nombre_Proyecto.toUpperCase()}</span>
        )}
      </h1>

      <button
        id="openModalBtn"
        className="flex mt-5 items-center bg-gradient-to-r from-blue-700 to-green-500 border border-green-500 hover:border-violet-500 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300"
        onClick={handleEditClick}
      >
        <FiEdit className="mr-2" />
        Editar Proyecto
      </button>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-zinc-400 bg-opacity-90 fixed inset-0"></div>
          <div className="modal-container p-6 backdrop-blur-sm bg-white/90 w-11/12 sm:w-11/12 md:w-8/12 lg:w-6/12 rounded-md shadow-sm relative z-10">
            <h2 className="text-2xl font-semibold mb-6">Editar Proyecto</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="Nombre_Proyecto" className="block text-sm font-medium text-black mb-2">
                Nombre Proyecto
              </label>
              <input
                type="text"
                id="Nombre_Proyecto"
                name="Nombre_Proyecto"
                className="w-full p-2 mb-4 rounded-lg focus:outline-none border-2 border-green-500 focus:border-blue-500 transition-colors duration-300"
                value={projectData.Nombre_Proyecto}
                onChange={handleInputChange}
              />

              <label htmlFor="Descripcion" className="block text-sm font-medium text-black mb-2">
                Descripción
              </label>
              <textarea
                id="Descripcion"
                name="Descripcion"
                className="w-full p-2 mb-4 rounded-lg focus:outline-none border-2 border-green-500 focus:border-blue-500 transition-colors duration-300"
                value={projectData.Descripcion}
                onChange={handleInputChange}
              />

              <label htmlFor="Estado_Proyecto" className="block text-sm font-medium text-black mb-2">
                Estado Proyecto
              </label>
              <select
                id="Estado_Proyecto"
                name="Estado_Proyecto"
                className="w-full p-2 mb-4 rounded-lg focus:outline-none border-2 border-green-500 focus:border-blue-500 transition-colors duration-300"
                value={projectData.Estado_Proyecto}
                onChange={handleInputChange}
              >
                <option value="Pendiente de Aprobación">Pendiente de Aprobación</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Completado">Completado</option>
                <option value="Cancelado">Cancelado</option>
              </select>

              <label htmlFor="Departamento" className="block text-sm font-medium text-black mb-2">
                Departamento
              </label>
              <select
                id="Departamento"
                name="Departamento"
                className="w-full p-2 mb-4 rounded-lg focus:outline-none border-2 border-green-500 focus:border-blue-500 transition-colors duration-300"
                value={projectData.Departamento}
                onChange={handleInputChange}
              >
                <option value="Requerimiento">Requerimiento</option>
                <option value="Proyecto">Proyecto</option>
              </select>

              <label htmlFor="Objetivo_Proyecto" className="block text-sm font-medium text-black mb-2">
                Objetivo Proyecto
              </label>
              <textarea
                id="Objetivo_Proyecto"
                name="Objetivo_Proyecto"
                className="w-full p-2 mb-4 rounded-lg focus:outline-none border-2 border-green-500 focus:border-blue-500 transition-colors duration-300"
                value={projectData.Objetivo_Proyecto}
                onChange={handleInputChange}
              />

              <label htmlFor="Prioridad" className="block text-sm font-medium text-black mb-2">
                Prioridad
              </label>
              <select
                id="Prioridad"
                name="Prioridad"
                className="w-full p-2 mb-4 rounded-lg focus:outline-none border-2 border-green-500 focus:border-blue-500 transition-colors duration-300"
                value={projectData.Prioridad}
                onChange={handleInputChange}
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>

              <label htmlFor="Gerente_Proyecto" className="block text-sm font-medium text-black mb-2">
                Gerente Proyecto
              </label>
              <select
                id="Gerente_Proyecto"
                name="Gerente_Proyecto"
                className="w-full p-2 mb-4 rounded-lg focus:outline-none border-2 border-green-500 focus:border-blue-500 transition-colors duration-300"
                value={projectData.Gerente_Proyecto}
                onChange={handleInputChange}
              >
                {usuariosAdmin.map((usuario, index) => (
                  <option key={index} value={usuario}>
                    {usuario}
                  </option>
                ))}
              </select>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-blue-700 border border-green-500 hover:border-violet-500 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 mr-2"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  className="bg-gradient-to-r from-green-500 to-blue-700 border border-green-500 hover:border-violet-500 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
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

