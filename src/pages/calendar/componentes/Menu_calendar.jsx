import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MenuCalendar = () => {
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/proyectos');
        setProyectos(response.data.data); // Asignamos los proyectos a state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Función para manejar la redirección al clickear un proyecto
  const handleClickProyecto = (id) => {
    // Redireccionar a /calendar?idproyect=<id>
    window.location.href = `/calendar?idproyect=${id}`;
  };

  // Función para renderizar los proyectos
  const renderProyectos = () => {
    return proyectos.slice(0, 8).map(proyecto => (
      <div key={proyecto.id} className="relative group bg-blue-600 py-8 sm:py-12 px-4 flex flex-col space-y-4 items-center cursor-pointer rounded-lg shadow-lg hover:bg-green-600 transition-colors duration-300 ease-in-out transform hover:scale-105" onClick={() => handleClickProyecto(proyecto.id)}>
        {/* Mostramos la imagen del proyecto */}
        <img className="w-24 h-24 object-cover object-center rounded-full border-4 border-white" src={`https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80`} alt={proyecto.attributes.Nombre_Proyecto} />

        {/* Mostramos los detalles del proyecto */}
        <h4 className="text-white text-xl font-bold capitalize text-center">{proyecto.attributes.Nombre_Proyecto}</h4>
        <p className="text-white font-bold uppercase text-sm">Estado: {proyecto.attributes.Estado_Proyecto}</p>
        <p className="text-white font-bold uppercase text-sm">INICIO: {proyecto.attributes.Fecha_Inicio}</p>
        <p className="text-white font-bold uppercase text-sm">FIN: {proyecto.attributes.Fecha_Fin}</p>
        <p className="text-white font-bold uppercase text-sm">GERENTE: {proyecto.attributes.Gerente_Proyecto}</p>
      </div>
    ));
  };

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
       
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {renderProyectos()}
      </div>
    </div>
  );
};

export default MenuCalendar;
