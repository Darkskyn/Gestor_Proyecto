import React, { useState } from "react";
import { FcMultipleDevices } from "react-icons/fc";
import Swal from 'sweetalert2';

const Header = () => {
 
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-Black text-2xl md:text-3xl font-bold flex items-center uppercase">
        <FcMultipleDevices className="mr-2" />
        Mis Proyectos <span className="text-primary-100"></span>
      </h1>
      

    </header>
  );
};

export default Header;