import React from "react";
// Icons

import { FcMindMap } from "react-icons/fc";

const Header = () => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 pt-10">
      <h1 className="text-Black text-3xl md:text-4xl font-bold flex items-center">
        <FcMindMap className="mr-3 text-4xl md:text-5xl" />
        Todos los Proyectos <span className="text-primary-100"></span>
      </h1>
      
    </header>
  );
};

export default Header;
