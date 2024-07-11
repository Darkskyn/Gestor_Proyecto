import React, { useState, useEffect } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';

const Formulario = ({ idproyect }) => {
    const [nombreTarea, setNombreTarea] = useState("");
    const [descripcionTarea, setDescripcionTarea] = useState("");
    const [fechaInicioTarea, setFechaInicioTarea] = useState("");
    const [fechaFinTarea, setFechaFinTarea] = useState("");
    const [prioridadTarea, setPrioridadTarea] = useState("Baja");
    const [adjuntoTarea, setAdjuntoTarea] = useState(null);
    const [esHitoTarea, setEsHitoTarea] = useState(false);
    const [estadoTarea, setEstadoTarea] = useState("");
    const [proyecto, setProyecto] = useState(null); // Estado para almacenar los datos del proyecto

    useEffect(() => {
        const fetchProyecto = async () => {
            try {
                const response = await axios.get(`http://localhost:1337/api/proyectos/${idproyect}`);
                if (response.data && response.data.data && response.data.data.attributes) {
                    setProyecto(response.data.data); // Almacenar los datos del proyecto en el estado

                    // Establecer las fechas mínima y máxima para los campos de fecha
                    setFechaInicioTarea(response.data.data.attributes.Fecha_Inicio);
                    setFechaFinTarea(response.data.data.attributes.Fecha_Fin);

                    // Calcular y mostrar la diferencia en meses
                    calcularYMostrarMeses(response.data.data.attributes.Fecha_Inicio, response.data.data.attributes.Fecha_Fin);
                } 
            } catch (error) {
                console.error('Error al obtener el proyecto:', error);
            }
        };

        fetchProyecto();
    }, [idproyect]);

    const calcularYMostrarMeses = (fechaInicio, fechaFin) => {
        const start = new Date(fechaInicio);
        const end = new Date(fechaFin);

        // Calcular la diferencia en meses
        const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

        // Mostrar el resultado en la consola
        console.log(`La diferencia en meses entre las fechas de inicio y fin del proyecto es: ${diffMonths} meses.`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de campos
        if (!nombreTarea || !descripcionTarea || !fechaInicioTarea || !fechaFinTarea || !estadoTarea || !prioridadTarea) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Validación',
                text: 'Por favor complete todos los campos obligatorios.',
            });
            return;
        }

        // Validación de longitud de la descripción
        if (descripcionTarea.length < 5 || descripcionTarea.length > 250) {
            Swal.fire({
                icon: 'error',
                title: 'Error en la Descripción',
                text: 'La descripción debe tener entre 5 y 250 caracteres.',
            });
            return;
        }

        try {
            // Obtener el token del localStorage
            const token = localStorage.getItem('authToken'); 

            // Configurar el header de autorización en Axios
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            // Hacer la llamada a la API para crear la tarea con el token en el header
            const response = await axios.post(`http://localhost:1337/api/tareas`, {
                data:{
                Id_proyecto: idproyect,
                Nombre: nombreTarea,
                Descripcion: descripcionTarea,
                Fecha_Inicio: fechaInicioTarea,
                Fecha_Fin: fechaFinTarea,
                Prioridad: prioridadTarea,
                Adjunto: adjuntoTarea,
                Hitos: esHitoTarea.toString(),
                Estado: estadoTarea
            }
            }, config);

            // Limpiar el formulario después de enviar
            document.getElementById('create-task-form').reset();
            
            // Mostrar el mensaje de éxito con SweetAlert2
            Swal.fire({
                icon: 'success',
                title: 'Tarea creada exitosamente',
                text: ''
            }).then(() => {
                // Redirigir a la página de dashboard después de crear la tarea
                window.location.href = '/dash';
            });
        } catch (error) {
            console.error('Error al crear la tarea:', error);
            Swal.fire('Error', 'Hubo un error al crear la tarea. Por favor, inténtelo de nuevo.', 'error');
        }
    };

    return (
        <div className="flex justify-center">
            <form id="create-task-form" className="bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="mb-4 col-span-full">
                                <div className="flex items-center">
                                    <input type="checkbox" className="mr-2" id="task-milestone" checked={esHitoTarea} onChange={(e) => setEsHitoTarea(e.target.checked)} />
                                    <span>¿Es un hito importante en el proyecto?</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="task-name" className="block font-medium text-black mb-2">Nombre de la Tarea</label>
                                <input type="text" className="w-full px-4 py-2 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" id="task-name" value={nombreTarea} onChange={(e) => setNombreTarea(e.target.value)} placeholder="Ingrese el nombre de la tarea" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="task-description" className="block font-medium text-black mb-2">Descripción</label>
                                <textarea className="w-full px-4 py-2 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" id="task-description" value={descripcionTarea} onChange={(e) => setDescripcionTarea(e.target.value)} rows="3" placeholder="Ingrese una descripción de la tarea entre 5 y 250 caracteres" required></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="task-status" className="block font-medium text-black mb-2">Estado de la Tarea</label>
                        <select className="w-full px-4 py-2 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" id="task-status" value={estadoTarea} onChange={(e) => setEstadoTarea(e.target.value)} required>
                            <option value="">Seleccione el estado de la tarea</option>
                            <option value="En Ejecucion">En Ejecución</option>
                            <option value="Pausando">Pausando</option>
                            <option value="Cancelado">Cancelado</option>
                            <option value="Finalizado">Finalizado</option>
                            <option value="Pendiente">Pendiente</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="task-priority" className="block font-medium text-black mb-2">Prioridad</label>
                        <select className="w-full px-4 py-2 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" id="task-priority" value={prioridadTarea} onChange={(e) => setPrioridadTarea(e.target.value)} required>
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="task-start-date" className="block font-medium text-black mb-2">Fecha de Inicio</label>
                        <input type="date" className="w-full px-4 py-2 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" id="task-start-date" value={fechaInicioTarea} onChange={(e) => setFechaInicioTarea(e.target.value)} min={proyecto && proyecto.attributes ? proyecto.attributes.Fecha_Inicio : ''} max={proyecto && proyecto.attributes ? proyecto.attributes.Fecha_Fin : ''} required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="task-end-date" className="block font-medium text-black mb-2">Fecha de Fin</label>
                        <input type="date" className="w-full px-4 py-2 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" id="task-end-date" value={fechaFinTarea} onChange={(e) => setFechaFinTarea(e.target.value)} min={proyecto && proyecto.attributes ? proyecto.attributes.Fecha_Inicio : ''} max={proyecto && proyecto.attributes ? proyecto.attributes.Fecha_Fin : ''} required />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="task-attachment" className="block font-medium text-black mb-2">Adjunto</label>
                        <input type="file" className="px-4 py-2 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" id="task-attachment" onChange={(e) => setAdjuntoTarea(e.target.files[0])} />
                    </div>
                </div>
                <center>
                    <button type="submit" className="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5">Crear Tarea</button>
                </center>
            </form>
        </div>
    );
}

export default Formulario;

