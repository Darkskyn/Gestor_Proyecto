import React, { useState, useEffect } from "react";
import { FcPlanner } from "react-icons/fc";

const Header = ({ idproyect }) => {
  const [nombreProyecto, setNombreProyecto] = useState("");

  useEffect(() => {
    const fetchNombreProyecto = async () => {
      try {
        const response = await fetch(`http://localhost:1337/api/proyectos/${idproyect}`);
        if (!response.ok) {
          throw new Error("No se pudo obtener el nombre del proyecto");
        }
        const data = await response.json();
        // Accede al nombre del proyecto dentro de data.attributes.Nombre_Proyecto
        setNombreProyecto(data.data.attributes.Nombre_Proyecto);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNombreProyecto();
  }, [idproyect]);

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-Black text-2xl md:text-3xl font-bold flex items-center">
        <FcPlanner className="mr-2" />
        Calendario del Proyecto:{" "}
        <div className="bg-green-500 rounded-lg px-4 py-2">
          <span className="text-white uppercase">{nombreProyecto}</span>
        </div>
      </h1>
    </header>
  );
};

export default Header;
