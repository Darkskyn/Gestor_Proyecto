import React from "react";
import { FiServer } from "react-icons/fi";

const Header_recurso = ({ nombreRecurso }) => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 pt-10">
      <h1 className="text-Black text-2xl md:text-3xl font-bold flex items-center">
        <FiServer className="mr-2" />
        Todos los {nombreRecurso}s
        <span className="text-primary-100"></span>
      </h1>
    </header>
  );
};

export default Header_recurso;