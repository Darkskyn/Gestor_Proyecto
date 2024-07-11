import React, { useState } from "react";
import { FiServer } from "react-icons/fi";

const Header = () => {

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-Black text-2xl md:text-3xl font-bold flex items-center">
        <FiServer className="mr-2" />
        Mis Proyectos <span className="text-primary-100"></span>
      </h1>
      
      </header>
  );
};

export default Header;
