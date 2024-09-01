import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; // Importa el locale de moment.js para español
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configura moment.js para usar español
moment.locale('es');

// Configura el localizador de moment para react-big-calendar
const localizer = momentLocalizer(moment);

const MyCalendar = ({ idproyect }) => {
  const [proyecto, setProyecto] = useState(null);

  useEffect(() => {
    if (idproyect) {
      fetch(`http://localhost:1337/api/proyectos/${idproyect}?populate=Id_tareas`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al cargar el proyecto');
          }
          return response.json();
        })
        .then(data => {
          setProyecto(data.data); // Guarda el proyecto en el estado
        })
        .catch(error => {
          console.error('Error fetching proyecto:', error);
        });
    }
  }, [idproyect]);

  if (!proyecto) {
    return <div>Cargando...</div>;
  }

  // Obtener las tareas del proyecto
  const tareas = proyecto.attributes.Id_tareas.data;

  // Calcula la fecha de inicio y fin del proyecto
  const startDate = new Date(proyecto.attributes.Fecha_Inicio);
  const endDate = new Date(proyecto.attributes.Fecha_Fin);

  // Define colores diferentes en tonos de azul y verde
  const blueColors = [
    '#007BFF', '#0056b3', '#003d7a', '#0033a0', '#002c77',
    '#1e90ff', '#87cefa', '#4682b4', '#4169e1', '#6495ed'
  ];

  const greenColors = [
    '#28a745', '#218838', '#1e7e34', '#19692c', '#155724',
    '#32cd32', '#98fb98', '#00ff00', '#00ff7f', '#3cb371'
  ];

  // Combina las listas de colores en un solo array
  const allColors = [...blueColors, ...greenColors];

  // Genera un color único para cada tarea
  const generateUniqueColor = (index) => allColors[index % allColors.length];

  // Eventos para el calendario
  const eventos = [
    // Evento para representar la duración del proyecto
    {
      id: proyecto.id,
      title: proyecto.attributes.Nombre_Proyecto.toUpperCase(), // Nombre del proyecto en mayúsculas
      start: startDate,
      end: endDate,
      allDay: true,
      color: '#28a745', // Color verde específico para el proyecto
      borderRadius: '5px'
    },
    // Eventos para cada tarea
    ...tareas.map((tarea, index) => ({
      id: tarea.id,
      title: tarea.attributes.Nombre.toUpperCase(), // Nombre de la tarea en mayúsculas
      start: new Date(tarea.attributes.Fecha_Inicio),
      end: new Date(tarea.attributes.Fecha_Fin),
      allDay: true,
      color: generateUniqueColor(index), // Color único para cada tarea
      borderRadius: '5px'
    }))
  ];

  // Define los días de la semana y los meses en español
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // Configura el estilo para los eventos
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.color, // Usa el color asignado al evento
      borderRadius: event.borderRadius,
      color: 'white',
      border: '1px solid #2b5c92'
    };
    return {
      style
    };
  };

  return (
    <div style={{ height: '800px' }}>
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day']}
        style={{ margin: '50px' }}
        messages={{
          allDay: 'Todo el día',
          previous: 'Anterior',
          next: 'Siguiente',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          noEventsInRange: 'No hay eventos en este rango',
          showMore: total => `+ Ver más (${total})`,
          date: 'Fecha',
          time: 'Hora'
        }}
        formats={{
          weekdayFormat: (date) => dayNames[date.getDay()],
          monthHeaderFormat: (date) => `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
          dayHeaderFormat: (date) => dayNames[date.getDay()],
          dayRangeHeaderFormat: ({ start, end }) => `${dayNames[start.getDay()]} ${start.getDate()} - ${dayNames[end.getDay()]} ${end.getDate()}`
        }}
        eventPropGetter={eventStyleGetter} // Aplica los estilos personalizados a los eventos
      />
    </div>
  );
};

export default MyCalendar;
