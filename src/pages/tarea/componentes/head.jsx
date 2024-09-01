import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import Swal from 'sweetalert2';

const HeaderTarea = ({ idtarea }) => {
  const tareaId = parseInt(idtarea);
  const [taskData, setTaskData] = useState({
    Nombre: "",
    Fecha_Inicio: "",
    Fecha_Fin: "",
    Estado: "",
    Prioridad: "",
    Hitos: false,
  });
  
  const [fechaFinProyecto, setFechaFinProyecto] = useState("");
  const [usuariosAdmin, setUsuariosAdmin] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!isNaN(tareaId)) {
      fetchTaskData();
      fetchUsuariosAdmin();
    }
  }, [tareaId]);

  const fetchTaskData = async () => {
    try {
      const response = await axios.get(`http://localhost:1337/api/tareas/${tareaId}?populate=*`);
      const tarea = response.data.data;

      if (tarea && tarea.attributes) {
        setTaskData(tarea.attributes);
        if (tarea.attributes.Id_proyecto && tarea.attributes.Id_proyecto.data) {
          const fechaFinProyecto = tarea.attributes.Id_proyecto.data.attributes.Fecha_Fin;
          setFechaFinProyecto(fechaFinProyecto);
        }
      } else {
        console.error('Data or attributes not found in API response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching task data:', error);
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
    setTaskData({ ...taskData, [name]: value });
  };

  const handleCheckboxChange = () => {
    setTaskData({ ...taskData, Hitos: !taskData.Hitos });
    // Resetear el campo Estado si se marca/desmarca Hitos
    setTaskData({ ...taskData, Estado: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar la fecha de fin
    if (new Date(taskData.Fecha_Fin) > new Date(fechaFinProyecto)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `La fecha de fin no puede ser posterior a la fecha de fin del proyecto (${fechaFinProyecto}).`,
      });
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('No se encontró el token de autorización en localStorage');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.put(`http://localhost:1337/api/tareas/${tareaId}`, {
        data: {
          ...taskData,
          Hitos: taskData.Hitos
        }
      }, config);

      if (response.data && response.data.attributes) {
        setTaskData(response.data.attributes);
      }

      Swal.fire({
        icon: 'success',
        title: 'Tarea actualizada',
        text: 'La tarea se actualizó correctamente.',
      }).then(() => {
        window.location.reload(); // Recargar la página después de mostrar el mensaje de éxito
      });

      setModalOpen(false);
    } catch (error) {
      console.error('Error updating task:', error.response ? error.response.data : error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Hubo un problema al actualizar la tarea. Detalles: ${error.response ? error.response.data.message : error.message}`,
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
    <header className="flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-black text-2xl md:text-3xl font-bold flex items-center ml-8">
        <FiEdit className="mr-2" />
        Previsualización de la Tarea {" "}
        {taskData.Nombre && (
          <span className="bg-green-500 text-white p-1 rounded">{taskData.Nombre.toUpperCase()}</span>
        )}
      </h1>

      <button
        id="openModalBtn"
        className="flex mt-5 mr-5 items-center bg-gradient-to-r from-blue-700 to-green-500 border border-green-500 hover:border-violet-500 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300"
        onClick={handleEditClick}
      >
        <FiEdit className="mr-2" />
        EDITAR TAREA
      </button>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-zinc-400 bg-opacity-90 fixed inset-0"></div>
          <div className="modal-container p-6 backdrop-blur-sm bg-white/90 w-11/12 sm:w-11/12 md:w-8/12 lg:w-6/12 rounded-md shadow-sm relative z-10">
            <h2 className="text-2xl font-semibold mb-6">Editar Tarea</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="Nombre" className="block text-sm font-medium text-black mb-2">
                Nombre Tarea
              </label>
              <input
                type="text"
                id="Nombre"
                name="Nombre"
                className="w-full p-2 mb-4 rounded-lg focus:outline-none border-2 border-green-500 focus:border-blue-500 transition-colors duration-300"
                value={taskData.Nombre}
                onChange={handleInputChange}
              />

              <label htmlFor="Fecha_Fin" className="block text-sm font-medium text-black mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                id="Fecha_Fin"
                name="Fecha_Fin"
                className="w-full p-2 mb-4 rounded-lg focus:outline-none border-2 border-green-500 focus:border-blue-500 transition-colors duration-300"
                value={taskData.Fecha_Fin}
                onChange={handleInputChange}
                min={taskData.Fecha_Inicio}
                max={fechaFinProyecto}
              />

              <label htmlFor="Prioridad" className="block text-sm font-medium text-black mb-2">
                Prioridad
              </label>
              <select
                id="Prioridad"
                name="Prioridad"
                className="w-full p-2 mb-4 rounded-lg focus:outline-none border-2 border-green-500 focus:border-blue-500 transition-colors duration-300"
                value={taskData.Prioridad}
                onChange={handleInputChange}
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
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
                  className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
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

export default HeaderTarea;


