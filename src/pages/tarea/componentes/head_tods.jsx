import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit } from "react-icons/fi";

const head_tods = ({ idtarea }) => {
  const tareaId = parseInt(idtarea);
  const [taskData, setTaskData] = useState({
    Nombre: "",
    Fecha_Inicio: "",
    Fecha_Fin: "",
    Estado: "",
    Prioridad: "",
    Hitos: false,
  });

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
      const response = await axios.get(`http://localhost:1337/api/tareas/${tareaId}`);
      const tarea = response.data.data;

      console.log("prueba:", tarea);
      if (tarea && tarea.attributes) {
        setTaskData(tarea.attributes);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          Hitos: taskData.Hitos // Incluir el valor actual de Hitos
        }
      }, config);

      console.log('Tarea actualizada correctamente');

      if (response.data && response.data.attributes) {
        setTaskData(response.data.attributes);
      }

      setModalOpen(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };


  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-black text-2xl md:text-3xl font-bold flex items-center">
        <FiEdit className="mr-2" />
        Previsualización de Tarea: {" "}
        {taskData.Nombre && (
          <span className="bg-green-500 text-white p-1 rounded">{taskData.Nombre.toUpperCase()}</span>
        )}
      </h1>
    </header>
  );
};

export default head_tods;
