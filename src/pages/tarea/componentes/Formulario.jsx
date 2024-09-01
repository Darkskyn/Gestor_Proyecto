import React, { useState, useEffect } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';

const Formulario = ({ idproyect, estado }) => {
    const [nombreTarea, setNombreTarea] = useState("");
    const [descripcionTarea, setDescripcionTarea] = useState("");
    const [fechaInicioTarea, setFechaInicioTarea] = useState("");
    const [fechaFinTarea, setFechaFinTarea] = useState("");
    const [prioridadTarea, setPrioridadTarea] = useState("Baja");
    const [adjuntoTarea, setAdjuntoTarea] = useState(null);
    const [esHitoTarea, setEsHitoTarea] = useState(false);
    const [estadoTarea, setEstadoTarea] = useState("");
    const [proyecto, setProyecto] = useState(null);
    const [descripcionLength, setDescripcionLength] = useState(0);
    const [slaHoras, setSlaHoras] = useState(0);

    useEffect(() => {
        const fetchProyecto = async () => {
            try {
                const response = await axios.get(`http://localhost:1337/api/proyectos/${idproyect}`);
                if (response.data && response.data.data && response.data.data.attributes) {
                    setProyecto(response.data.data);
                    setFechaInicioTarea(response.data.data.attributes.Fecha_Inicio);
                    setFechaFinTarea(response.data.data.attributes.Fecha_Fin);
                    calcularYMostrarMeses(response.data.data.attributes.Fecha_Inicio, response.data.data.attributes.Fecha_Fin);
                }
            } catch (error) {
                console.error('Error al obtener el proyecto:', error);
            }
        };

        fetchProyecto();
    }, [idproyect]);

    useEffect(() => {
        if (estado === 'Pendiente de Aprobación') {
            Swal.fire({
                icon: 'warning',
                title: 'Acción no permitida',
                text: 'El proyecto está pendiente de aprobación. No puede modificar las fechas ni cambiar el estado.',
            });

            setFechaInicioTarea('');
            setFechaFinTarea('');
            setEstadoTarea('Pendiente de Aprobación');
            setSlaHoras(0); // Resetea el SLA a 0 cuando el estado es Pendiente de Aprobación
        } else {
            setEstadoTarea(''); // Opcional: Limpiar el estado si no es Pendiente de Aprobación
        }
    }, [estado]);

    const calcularYMostrarMeses = (fechaInicio, fechaFin) => {
        const start = new Date(fechaInicio);
        const end = new Date(fechaFin);
        const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        console.log(`La diferencia en meses entre las fechas de inicio y fin del proyecto es: ${diffMonths} meses.`);
    };

    const calcularSLAHoras = (fechaInicio, fechaFin) => {
        const start = new Date(fechaInicio);
        const end = new Date(fechaFin);
        const diffMs = end - start;
        const diffHoras = Math.round(diffMs / (1000 * 60 * 60));
        setSlaHoras(diffHoras);
        console.log(`La diferencia en horas entre las fechas de inicio y fin es: ${diffHoras} horas.`);
    };

    useEffect(() => {
        if (fechaInicioTarea && fechaFinTarea && estadoTarea === 'Ejecucion') {
            calcularSLAHoras(fechaInicioTarea, fechaFinTarea);
        } else if (estadoTarea === 'Pendiente de Aprobación') {
            setSlaHoras(0); // Resetea el SLA a 0 cuando el estado es Pendiente de Aprobación
        }
    }, [fechaInicioTarea, fechaFinTarea, estadoTarea]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombreTarea || !descripcionTarea || !fechaInicioTarea || !fechaFinTarea || !estadoTarea || !prioridadTarea) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Validación',
                text: 'Por favor complete todos los campos obligatorios.',
            });
            return;
        }

        if (descripcionTarea.length < 5 || descripcionTarea.length > 250) {
            Swal.fire({
                icon: 'error',
                title: 'Error en la Descripción',
                text: 'La descripción debe tener entre 5 y 250 caracteres.',
            });
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const dataToSend = {
                Id_proyecto: idproyect,
                Nombre: nombreTarea,
                Descripcion: descripcionTarea,
                Fecha_Inicio: fechaInicioTarea,
                Fecha_Fin: fechaFinTarea,
                Prioridad: prioridadTarea,
                Adjunto: adjuntoTarea,
                Hitos: esHitoTarea.toString(),
                Estado: estadoTarea
            };

            if (estadoTarea === 'Ejecucion') {
                dataToSend.SLA_Horas = slaHoras;
            }

            const response = await axios.post(`http://localhost:1337/api/tareas`, { data: dataToSend }, config);

            document.getElementById('create-task-form').reset();
            Swal.fire({
                icon: 'success',
                title: 'Tarea creada exitosamente',
                text: ''
            }).then(() => {
                window.location.href = '/dash';
            });
        } catch (error) {
            console.error('Error al crear la tarea:', error);
            Swal.fire('Error', 'Hubo un error al crear la tarea. Por favor, inténtelo de nuevo.', 'error');
        }
    };

    return (
        <div className="flex justify-center">
            <form id="create-task-form" className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <div className="mb-4 flex items-center">
                            <input 
                                type="checkbox" 
                                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded" 
                                id="task-milestone" 
                                checked={esHitoTarea} 
                                onChange={(e) => setEsHitoTarea(e.target.checked)} 
                            />
                            <label htmlFor="task-milestone" className="text-gray-700">¿Es un hito importante en el proyecto?</label>
                        </div>
                        <div className="mb-4 relative">
                            <label htmlFor="task-name" className="block text-gray-700 font-semibold mb-2 uppercase">Nombre de la Tarea</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                id="task-name" 
                                value={nombreTarea} 
                                onChange={(e) => setNombreTarea(e.target.value)} 
                                placeholder="Ingrese el nombre de la tarea" 
                                required 
                            />
                        </div>
                        <div className="mb-4 relative">
                            <label htmlFor="task-description" className="block text-gray-700 font-semibold mb-2 uppercase">Descripción</label>
                            <textarea 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                id="task-description" 
                                value={descripcionTarea} 
                                onChange={(e) => {
                                    setDescripcionTarea(e.target.value);
                                    setDescripcionLength(e.target.value.length);
                                }} 
                                rows="3" 
                                placeholder="Ingrese una descripción de la tarea entre 5 y 250 caracteres" 
                                minLength={5}
                                maxLength={250}
                                required 
                            ></textarea>
                            <span className="absolute bottom-2 right-2 text-gray-600">
                                {descripcionLength}/250
                            </span>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="task-status" className="block text-gray-700 font-semibold mb-2 uppercase">Estado de la Tarea</label>
                        <select 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            id="task-status" 
                            value={estadoTarea} 
                            onChange={(e) => setEstadoTarea(e.target.value)} 
                            required
                            disabled={estado === 'Pendiente de Aprobación'}
                        >
                            <option value="">Seleccionar un Estado</option>
                            <option value="Ejecucion">En Ejecución</option>
                            <option value="Pendiente">Pendiente</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="task-priority" className="block text-gray-700 font-semibold mb-2 uppercase">Prioridad</label>
                        <select 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            id="task-priority" 
                            value={prioridadTarea} 
                            onChange={(e) => setPrioridadTarea(e.target.value)} 
                            required
                        >
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="task-start-date" className="block text-gray-700 font-semibold mb-2 uppercase">Fecha de Inicio</label>
                        <input 
                            type="date" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            id="task-start-date" 
                            value={fechaInicioTarea} 
                            onChange={(e) => setFechaInicioTarea(e.target.value)} 
                            min={proyecto && proyecto.attributes ? proyecto.attributes.Fecha_Inicio : ''} 
                            max={proyecto && proyecto.attributes ? proyecto.attributes.Fecha_Fin : ''} 
                            required 
                            disabled={estado === 'Pendiente de Aprobación'}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="task-end-date" className="block text-gray-700 font-semibold mb-2 uppercase">Fecha de Fin</label>
                        <input 
                            type="date" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            id="task-end-date" 
                            value={fechaFinTarea} 
                            onChange={(e) => setFechaFinTarea(e.target.value)} 
                            min={proyecto && proyecto.attributes ? proyecto.attributes.Fecha_Inicio : ''} 
                            max={proyecto && proyecto.attributes ? proyecto.attributes.Fecha_Fin : ''} 
                            required 
                            disabled={estado === 'Pendiente de Aprobación'}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="task-attachment" className="block text-gray-700 font-semibold mb-2 uppercase">Adjunto</label>
                        <input 
                            type="file" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            id="task-attachment" 
                            accept=".pdf" // Permite solo archivos PDF
                            onChange={(e) => {
                                // Verifica si el archivo es un PDF antes de actualizar el estado
                                const file = e.target.files[0];
                                if (file && file.type === 'application/pdf') {
                                    setAdjuntoTarea(file);
                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Tipo de archivo no válido',
                                        text: 'Por favor, seleccione un archivo PDF.',
                                    });
                                    e.target.value = ''; // Limpia el campo de archivo si el tipo no es válido
                                }
                            }} 
                        />
                    </div>
                </div>
                <div className="text-center mb-4">
                    {estadoTarea === 'Ejecucion' && (
                        <span className="text-gray-700 font-semibold">SLA en Horas: {slaHoras} horas</span>
                    )}
                </div>
                <div className="text-center">
                    <button 
                        type="submit" 
                        className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
                    >
                        Crear Tarea
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Formulario;
