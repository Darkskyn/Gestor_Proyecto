import React from "react";
import { FcAutomatic } from "react-icons/fc"; 

const Header_recurso = ({ nombreRecurso }) => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 pt-10">
      <h1 className="text-Black text-2xl md:text-3xl font-bold flex items-center uppercase">
        <FcAutomatic className="mr-2 text-4xl md:text-5xl" /> 
        INFORMACIÓN DEL RECURSO:  {nombreRecurso.toUpperCase()}
        <span className="text-primary-100"></span>
      </h1>
    </header>
  );
};

export default Header_recurso;
