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
    const [persona_responsable, setPersonaResponsable] = useState("");
    const [recursosHumanos, setRecursosHumanos] = useState([]);
    const [showDescripcionCounter, setShowDescripcionCounter] = useState(false);
    const [showObjetivoCounter, setShowObjetivoCounter] = useState(false);
    const [maxFechaFin, setMaxFechaFin] = useState("");

    // Usa el hook useSLA
    const { sla, updateSLA, startTimer, stopTimer } = useSLA();

    useEffect(() => {
        set_proyecto(proyecto);

        async function fetchUsuariosAdmin() {
            try {
                const response = await axios.get('http://localhost:1337/api/users?populate=role');
                const usuarios = response.data;

                const adminUsers = usuarios.filter(user => user.role.name === 'Admin');
                const nombresAdmin = adminUsers.map(user => user.username);

                setUsuariosAdmin(nombresAdmin);
            } catch (error) {
                console.error('Error al obtener usuarios administradores:', error);
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
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();

        if (month < 10) {
            month = `0${month}`;
        }
        if (day < 10) {
            day = `0${day}`;
        }

        const formattedToday = `${year}-${month}-${day}`;
        set_fechai(formattedToday);
    }, []);

    useEffect(() => {
        const calculateEndDate = (priority, startDate) => {
            if (!startDate) return '';

            const start = new Date(startDate);
            const end = new Date(start);

            if (priority === "Baja") {
                end.setMonth(start.getMonth() + 6); // 6 months
            } else if (priority === "Media") {
                end.setMonth(start.getMonth() + 3); // 3 months
            } else if (priority === "Alta") {
                end.setMonth(start.getMonth() + 1); // 1 month
            }

            return end.toISOString().split('T')[0];
        };

        const newEndDate = calculateEndDate(prioridad_proyecto, fechai_proyecto);
        set_fechaf(newEndDate);
        setMaxFechaFin(newEndDate);
    }, [prioridad_proyecto, fechai_proyecto]);

    useEffect(() => {
        if (estado_proyecto === 'Pendiente de Aprobación') {
            // Do not calculate SLA when the state is 'Pendiente de Aprobación'
            updateSLA(null);
            stopTimer();
            return;
        }

        if (fechai_proyecto && fechaf_proyecto) {
            const start = new Date(fechai_proyecto);
            const end = new Date(fechaf_proyecto);

            if (estado_proyecto === 'Completado' || estado_proyecto === 'Cancelado') {
                // Terminate the project time when state is 'Completado' or 'Cancelado'
                end.setDate(start.getDate());
            }

            // Calculate the difference in milliseconds
            const difference = end - start;

            // Convert the difference to hours
            const hours = difference / (1000 * 60 * 60);
            updateSLA(hours);
        }
    }, [fechai_proyecto, fechaf_proyecto, estado_proyecto, updateSLA]);

    useEffect(() => {
        if (estado_proyecto !== 'En Progreso') {
            stopTimer();
            return;
        }

        startTimer(fechai_proyecto);

        return () => {
            stopTimer();
        };
    }, [estado_proyecto, fechai_proyecto, startTimer, stopTimer]);

    useEffect(() => {
        async function fetchRecursosHumanos() {
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

                const response = await axios.get(`http://localhost:1337/api/recurso-proyectos?populate=id_proyecto,id_recursos,id_tipo`, config);
                const recursos = response.data.data;

                const recursosHumanos = recursos.filter(recurso => {
                    const idTipoNombre = recurso.attributes?.id_tipo?.data?.attributes?.Nombre;
                    return idTipoNombre === 'Humano';
                });

                const nombresRecursosHumanos = recursosHumanos.flatMap(recurso => 
                    recurso.attributes?.id_recursos?.data.map(rec => rec.attributes?.Nombre) || []
                );

                setRecursosHumanos(nombresRecursosHumanos);

                if (!persona_responsable && nombresRecursosHumanos.length > 0) {
                    setPersonaResponsable("");
                }

            } catch (error) {
                console.error('Error al obtener recursos humanos del proyecto:', error);
            }
        }

        fetchRecursosHumanos();
    }, [idproyect, persona_responsable]);

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

            await axios.put(`http://localhost:1337/api/proyectos/${idproyect}`, {
                data: {
                    Nombre_Proyecto: nombre_proyecto,
                    Descripcion: descripcion_proyecto,
                    Fecha_Inicio: fechai_proyecto,
                    Fecha_Fin: fechaf_proyecto,
                    Estado_Proyecto: estado_proyecto,
                    Departamento: departamento_proyecto,
                    Objetivo_Proyecto: objetivo_proyecto,
                    Prioridad: prioridad_proyecto,
                    Gerente_Proyecto: gerente_proyecto,
                    usuario_proyecto: persona_responsable,
                    SLA: sla // Ensure SLA is included in the payload
                }
            }, config);

            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: '¡Datos del proyecto actualizados correctamente!',
            }).then(() => {
                window.location.href = `/menu_tarea/crear_tarea?idproyect=${idproyect}&estado_proyecto=${encodeURIComponent(estado_proyecto)}`;
            });

        } catch (error) {
            console.error('Error al actualizar el proyecto:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al actualizar el proyecto. Por favor, inténtelo de nuevo más tarde.',
            });
        }
    };

    const handleChangeFechaFin = (e) => {
        const selectedDate = e.target.value;
        if (new Date(selectedDate) <= new Date(maxFechaFin)) {
            set_fechaf(selectedDate);
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Fecha de Finalización Inválida',
                text: `La fecha de finalización debe ser dentro del límite permitido según la prioridad (${prioridad_proyecto}).`,
            });
        }
    };
    
    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
            <form id="new-project-form" className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">Formulario de Proyecto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-4">
                        <label htmlFor="name" className="block font-semibold text-gray-700 mb-2 uppercase">Nombre del Proyecto</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            id="name" 
                            name="name" 
                            value={nombre_proyecto} 
                            onChange={(e) => set_proyecto(e.target.value)} 
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="department" className="block font-semibold text-gray-700 mb-2 uppercase">Departamento</label>
                        <select 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            id="department" 
                            name="department" 
                            value={departamento_proyecto} 
                            onChange={(e) => set_departamento(e.target.value)} 
                            required
                        >
                            <option value="">Selecciona un departamento</option>
                            <option value="Requerimiento">Requerimiento</option>
                            <option value="Proyecto">Proyecto</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="priority" className="block font-semibold text-gray-700 mb-2 uppercase">Prioridad del Proyecto</label>
                        <select 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            id="priority" 
                            name="priority" 
                            value={prioridad_proyecto} 
                            onChange={(e) => set_prioridad(e.target.value)} 
                            required
                        >
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                        </select>
                        <div className="mt-2">
                            {prioridad_proyecto === "Baja" && <p><strong>Duración estimada:</strong> <span className="text-blue-600 font-semibold">6 meses</span></p>}
                            {prioridad_proyecto === "Media" && <p><strong>Duración estimada:</strong> <span className="text-blue-600 font-semibold">3 meses</span></p>}
                            {prioridad_proyecto === "Alta" && <p><strong>Duración estimada:</strong> <span className="text-blue-600 font-semibold">1 mes</span></p>}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block font-semibold text-gray-700 mb-2 uppercase">Descripción del Proyecto</label>
                        <textarea 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            id="description" 
                            name="description" 
                            rows="3" 
                            value={descripcion_proyecto} 
                            onChange={(e) => {
                                set_descripcion(e.target.value);
                                setShowDescripcionCounter(true);
                            }} 
                            placeholder="Ingresa una descripción (min. 20, max. 150 caracteres)" 
                            minLength={20} 
                            maxLength={150} 
                            required
                        ></textarea>
                        {showDescripcionCounter && (
                            <p className="mt-1 text-gray-600 text-sm">
                                {descripcion_proyecto.length} / 150 caracteres
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="start_date" className="block font-semibold text-gray-700 mb-2 uppercase">Fecha de Inicio Estimada</label>
                        <input 
                            type="date" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            id="start_date" 
                            name="start_date" 
                            value={fechai_proyecto} 
                            onChange={(e) => set_fechai(e.target.value)} 
                            min={fechai_proyecto} 
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="end_date" className="block font-semibold text-gray-700 mb-2 uppercase">Fecha de Finalización Estimada</label>
                        <input 
                            type="date" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            id="end_date" 
                            name="end_date" 
                            value={fechaf_proyecto} 
                            onChange={handleChangeFechaFin} 
                            min={fechai_proyecto} 
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="manager_id" className="block font-semibold text-gray-700 mb-2 uppercase">Gerente de Proyecto</label>
                        <select 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            id="manager_id" 
                            name="manager_id" 
                            value={gerente_proyecto} 
                            onChange={(e) => set_gerente(e.target.value)} 
                            required
                        >
                            <option value="">Selecciona un gerente de proyecto</option>
                            {usuariosAdmin.map((usuario, index) => (
                                <option key={index} value={usuario}>{usuario}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="objective" className="block font-semibold text-gray-700 mb-2 uppercase">Objetivo del Proyecto</label>
                        <textarea 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            id="objective" 
                            name="objective" 
                            rows="3" 
                            value={objetivo_proyecto} 
                            onChange={(e) => {
                                set_objetivo(e.target.value);
                                setShowObjetivoCounter(true);
                            }} 
                            placeholder="Ingresa el objetivo (min. 20, max. 150 caracteres)" 
                            minLength={20} 
                            maxLength={150} 
                            required
                        ></textarea>
                        {showObjetivoCounter && (
                            <p className="mt-1 text-gray-600 text-sm">
                                {objetivo_proyecto.length} / 150 caracteres
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="status" className="block font-semibold text-gray-700 mb-2 uppercase">Estado del Proyecto</label>
                        <select 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            id="status" 
                            name="status" 
                            value={estado_proyecto} 
                            onChange={(e) => set_estado(e.target.value)} 
                            required
                        >
                            <option value="Pendiente de Aprobación">Pendiente de Aprobación</option>
                            <option value="En Progreso">En Progreso</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="responsable" className="block font-semibold text-gray-700 mb-2 uppercase">Persona Responsable</label>
                        <select 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            id="responsable" 
                            name="responsable" 
                            value={persona_responsable} 
                            onChange={(e) => setPersonaResponsable(e.target.value)} 
                            required
                        >
                            <option value="">Selecciona una persona responsable</option>
                            {recursosHumanos.map((recurso, index) => (
                                <option key={index} value={recurso}>{recurso}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                    >
                        Guardar Proyecto
                    </button>
                    {sla !== null && (
                        <p className="text-gray-700 text-lg font-semibold">
                            SLA Restante: {sla.toFixed(2)} horas
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Formulario;
