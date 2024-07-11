import React, { useState, useEffect } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';

const Formulario = ({ idproyect, proyecto }) => {
    const [nombre_proyecto, set_proyecto] = useState(proyecto);
    const [departamento_proyecto, set_departamento] = useState("");
    const [prioridad_proyecto, set_prioridad] = useState("Baja");
    const [descripcion_proyecto, set_descripcion] = useState("");
    const [fechai_proyecto, set_fechai] = useState("");
    const [fechaf_proyecto, set_fechaf] = useState("");
    const [gerente_proyecto, set_gerente] = useState("");
    const [estado_proyecto, set_estado] = useState("Pendiente de Aprobación");
    const [objetivo_proyecto, set_objetivo] = useState("");
    const [usuariosAdmin, setUsuariosAdmin] = useState([]);

    useEffect(() => {
        set_proyecto(proyecto);

        // Llamada a la API para obtener usuarios con rol 'admin'
        async function fetchUsuariosAdmin() {
            try {
                const response = await axios.get('http://localhost:1337/api/users?populate=role');
                const usuarios = response.data;

                // Filtrar usuarios con rol 'admin'
                const adminUsers = usuarios.filter(user => user.role.name === 'Admin');

                // Obtener solo los nombres de los usuarios administradores
                const nombresAdmin = adminUsers.map(user => user.username);

                // Actualizar el estado con los nombres de los administradores
                setUsuariosAdmin(nombresAdmin);
            } catch (error) {
                console.error('Error al obtener usuarios administradores:', error);
                // Mostrar mensaje de error con SweetAlert2
                Swal.fire({
                    icon: 'error',
                    title: 'Error al obtener usuarios',
                    text: 'Hubo un problema al cargar los usuarios administradores. Por favor, inténtelo de nuevo más tarde.',
                });
            }
        }

        fetchUsuariosAdmin();
    }, [proyecto]);

    useEffect(() => {
        // Obtener la fecha actual en formato YYYY-MM-DD para el campo de fecha de inicio
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();

        // Asegurarse de que el mes y el día tengan dos dígitos
        if (month < 10) {
            month = `0${month}`;
        }
        if (day < 10) {
            day = `0${day}`;
        }

        const formattedToday = `${year}-${month}-${day}`;
        set_fechai(formattedToday);
    }, []);

    // Función para actualizar la fecha de finalización máxima según la prioridad seleccionada
    useEffect(() => {
        if (prioridad_proyecto === "Baja") {
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 6); // 6 meses a partir de la fecha actual
            set_fechaf(maxDate.toISOString().split('T')[0]);
        } else if (prioridad_proyecto === "Media") {
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 3); // 3 meses a partir de la fecha actual
            set_fechaf(maxDate.toISOString().split('T')[0]);
        } else if (prioridad_proyecto === "Alta") {
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 1); // 1 mes a partir de la fecha actual
            set_fechaf(maxDate.toISOString().split('T')[0]);
        }
    }, [prioridad_proyecto]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Hacer la llamada a la API para crear o actualizar el proyecto
            const response = await axios.put(`http://localhost:1337/api/proyectos/${idproyect}`, {
               data:{ 
                Nombre_Proyecto: nombre_proyecto,
                Descripcion: descripcion_proyecto,
                Fecha_Inicio: fechai_proyecto,
                Fecha_Fin: fechaf_proyecto,
                Estado_Proyecto: estado_proyecto,
                Departamento: departamento_proyecto,
                Objetivo_Proyecto: objetivo_proyecto,
                Prioridad: prioridad_proyecto,
                Gerente_Proyecto: gerente_proyecto,
                }
            });

            // Verificar si el servidor devuelve un error específico
            if (response.data.message === "Missing 'data' payload in the request body") {
                // Mostrar alerta de error con SweetAlert2
                Swal.fire({
                    icon: 'error',
                    title: 'Error al guardar el proyecto',
                    text: 'Falta el payload \'data\' en el cuerpo de la solicitud.',
                });
                return;
            }

            // Limpiar el formulario después de enviar
            document.getElementById('new-project-form').reset();

            // Mostrar alerta de éxito con SweetAlert2
            Swal.fire({
                icon: 'success',
                title: 'Proyecto Registrado Exitosamente',
                text: 'El proyecto se ha creado de manera correcta.',
                showConfirmButton: false,
                timer: 2000 // Ocultar automáticamente después de 2 segundos
            });

            // Redirigir al usuario a la página de tareas después de 2 segundos
            setTimeout(() => {
                window.location.href = `/menu_tarea/crear_tarea?idproyect=${idproyect}`;
            }, 2000);

        } catch (error) {
            if (error.response && error.response.status === 403) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Permiso',
                    text: 'No tienes permisos para realizar esta acción. Ponte en contacto con un administrador.',
                });
            } else {
                console.error('Error al guardar el proyecto:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al Guardar Proyecto',
                    text: 'Hubo un error al guardar el proyecto. Por favor, inténtelo de nuevo.',
                });
            }
        }
    };

    return (
        <div>
            <form id="new-project-form" className="bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-4">
                        <label htmlFor="name" className="block font-medium text-black mb-2">Nombre del Proyecto</label>
                        <input type="text" className="w-full px-4 py-2 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" id="name" name="name" value={nombre_proyecto} onChange={(e) => set_proyecto(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block font-medium text-black mb-2">Departamento del Proyecto</label>
                        <select className="w-full px-4 py-2 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" id="category" name="category" value={departamento_proyecto} onChange={(e) => set_departamento(e.target.value)} required>
                            <option value="">Selecciona un departamento</option>
                            <option value="Requerimiento">Requerimiento</option>
                            <option value="Proyecto">Proyecto</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="priority" className="block font-medium text-black mb-2">Prioridad del Proyecto</label>
                        <select className="w-full px-4 py-2 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" id="priority" name="priority" value={prioridad_proyecto} onChange={(e) => set_prioridad(e.target.value)} required>
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block font-medium text-black mb-2">Descripción del Proyecto</label>
                        <textarea className="w-full px-4 py-2 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" id="description" name="description" rows="3" value={descripcion_proyecto} onChange={(e) => set_descripcion(e.target.value)} required></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="start_date" className="block font-medium text-black mb-2">Fecha de Inicio Estimada</label>
                        <input type="date" className="w-full px-4 py-2 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" id="start_date" name="start_date" value={fechai_proyecto} onChange={(e) => set_fechai(e.target.value)} min={fechai_proyecto} required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="end_date" className="block font-medium text-black mb-2">Fecha de Finalización Estimada</label>
                        <input type="date" className="w-full px-4 py-2 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" id="end_date" name="end_date" value={fechaf_proyecto} onChange={(e) => set_fechaf(e.target.value)} min={fechai_proyecto} max={fechaf_proyecto} required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="manager_id" className="block font-medium text-black mb-2">Gerente de Proyecto</label>
                        <select className="w-full px-4 py-2 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" id="manager_id" name="manager_id" value={gerente_proyecto} onChange={(e) => set_gerente(e.target.value)} required>
                            <option value="">Selecciona un gerente de proyecto</option>
                            {usuariosAdmin.map((usuario, index) => (
                                <option key={index} value={usuario}>{usuario}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="objective" className="block font-medium text-black mb-2">Objetivo del Proyecto</label>
                        <textarea className="w-full px-4 py-2 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" id="objective" name="objective" rows="3" value={objetivo_proyecto} onChange={(e) => set_objetivo(e.target.value)} required></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="status" className="block font-medium text-black mb-2">Estado del Proyecto</label>
                        <select className="w-full px-4 py-2 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" id="status" name="status" value={estado_proyecto} onChange={(e) => set_estado(e.target.value)} required>
                            <option value="Pendiente de Aprobación">Pendiente de Aprobación</option>
                            <option value="Aprobado">Aprobado</option>
                            <option value="En Progreso">En Progreso</option>
                            <option value="Completado">Completado</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md">Guardar Proyecto</button>
            </form>
        </div>
    );
};

export default Formulario;

