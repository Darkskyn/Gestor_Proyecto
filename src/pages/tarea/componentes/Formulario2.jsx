import React, { useState, useEffect } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import { AiFillFilePdf } from 'react-icons/ai'; // Asegúrate de tener este icono importado


const Formulario = ({ idproyect, estado }) => {
    const [nombreTarea, setNombreTarea] = useState("");
    const [descripcionTarea, setDescripcionTarea] = useState("");
    const [fechaInicioTarea, setFechaInicioTarea] = useState("");
    const [fechaFinTarea, setFechaFinTarea] = useState("");
    const [prioridadTarea, setPrioridadTarea] = useState("Baja");
    const [adjuntoTarea, setAdjuntoTarea] = useState([]);
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

    const handleFileChange = (e) => {
        // Verifica si los archivos son PDFs antes de actualizar el estado
        const files = Array.from(e.target.files);
        const invalidFiles = files.filter(file => file.type !== 'application/pdf');
        if (invalidFiles.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Tipo de archivo no válido',
                text: 'Por favor, seleccione solo archivos PDF.',
            });
            e.target.value = ''; // Limpia el campo de archivo si hay archivos inválidos
        } else {
            setAdjuntoTarea(files); // Actualiza el estado con los archivos válidos
        }
    };
    
    const handleFileRemove = (index) => {
        setAdjuntoTarea(prevFiles => prevFiles.filter((_, i) => i !== index));
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

    const uploadFiles = async (files) => {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
    
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        };
    
        try {
            const response = await axios.post('http://localhost:1337/api/upload', formData, config);
            console.log('Archivos subidos:', response.data); // Asegúrate de que esta línea imprima los IDs de los archivos
            return response.data.map(file => file.id); // Devuelve los IDs de los archivos subidos
        } catch (error) {
            console.error('Error al subir los archivos:', error);
            Swal.fire('Error', 'Hubo un problema al subir los archivos. Por favor, inténtelo de nuevo.', 'error');
            throw error;
        }
    };
    
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
            const formData = new FormData();
            
            // Agrega los archivos PDF al FormData
            adjuntoTarea.forEach(file => {
                formData.append('files.files', file);
            });
    
            // Agrega los datos de la tarea al FormData
            formData.append('data', JSON.stringify({
                Nombre: nombreTarea,
                Descripcion: descripcionTarea,
                Fecha_Inicio: fechaInicioTarea,
                Fecha_Fin: fechaFinTarea,
                Estado: estadoTarea,
                Prioridad: prioridadTarea,
                Hitos: esHitoTarea,
                Id_proyecto: idproyect,
                SLA: slaHoras
            }));
    
            // Configuración de la solicitud
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
    
            // Enviar los datos de la tarea
            const tareaResponse = await axios.post('http://localhost:1337/api/tareas', formData, config);
            console.log('Respuesta completa de la API:', tareaResponse);
            console.log('Datos de la respuesta de la API:', tareaResponse.data);
    
            // Extraer el ID de la tarea
            const tareaId = tareaResponse.data?.id;
    
            if (tareaId) {
                // Mostrar el mensaje de éxito y redirigir después de que se confirme
                Swal.fire({
                    icon: 'success',
                    title: 'Tarea creada exitosamente',
                    text: ''
                }).then(async () => {
                    try {
                        const username = localStorage.getItem('username');
                        const auditData = {
                            Fecha: new Date().toISOString(),
                            id_proyectos: idproyect,
                            Id_tareas: tareaId,
                            Nombre_Tarea: nombreTarea,
                            Accion: 'Creacion',
                            Usuario: username
                        };
    
                        // Enviar los datos de auditoría en el formato correcto
                        const auditResponse = await axios.post('http://localhost:1337/api/audotira-tareas', { data: auditData }, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        console.log('Respuesta de la API de auditoría:', auditResponse);
    
                        // Limpiar el formulario
                        document.getElementById('create-task-form').reset();
                        setAdjuntoTarea([]);
    
                        // Redirigir al dashboard
                        window.location.href = '/dash';
                    } catch (auditError) {
                        console.error('Error al registrar la auditoría:', auditError);
                        Swal.fire('Error', `Hubo un error al registrar la auditoría. Detalles: ${auditError.message}`, 'error');
                    }
                });
            } else {
                throw new Error('ID de tarea no disponible en la respuesta.');
            }
        } catch (error) {
            console.error('Error al crear la tarea:', error);
            Swal.fire('Error', `Hubo un error al crear la tarea. Detalles: ${error.message}`, 'error');
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

                    <div className="relative flex flex-col items-center rounded-[10px] border-[1px] border-gray-200 w-[845px] mx-auto p-4 bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none">
        <h2 className="text-lg font-semibold text-navy-700 dark:text-black mb-4">Adjuntar Archivos</h2>
        <div className="flex h-full w-full items-start justify-between rounded-md border-[1px] border-[transparent] dark:hover:border-white/20 bg-white px-3 py-[20px] transition-all duration-150 hover:border-gray-200 dark:!bg-navy-800 dark:hover:!bg-navy-700">
            <div className="flex flex-col w-full">
                <input
                    type="file"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    id="task-attachment"
                    accept=".pdf"
                    onChange={handleFileChange}
                    multiple
                />
                <div className="mt-4 space-y-2">
                                {adjuntoTarea.length > 0 && Array.from(adjuntoTarea).map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border border-gray-300 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-16 w-16 items-center justify-center bg-gray-200 rounded-xl">
                                                <AiFillFilePdf className="h-full w-full text-red-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <h5 className="text-base font-bold text-navy-700 dark:text-black">
                                                    {file.name}
                                                </h5>
                                                <p className="mt-1 text-sm font-normal text-gray-600">
                                                    {Math.round(file.size / 1024)} KB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleFileRemove(index)}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
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
