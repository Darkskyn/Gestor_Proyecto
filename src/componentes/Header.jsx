import React from "react";
// Icons
import { RiSearch2Line } from "react-icons/ri";
import { FiServer } from "react-icons/fi";

const Header = () => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-Black text-2xl md:text-3xl font-bold flex items-center">
      <FiServer className="mr-2" />
      Bienvenido, <span className="text-primary-100"> Usuario</span>
      </h1>
      <form className="w-full md:w-auto">
        <div className="relative">
          <RiSearch2Line className="absolute top-1/2 -translate-y-1/2 left-2" />
          <input type="text"className="bg-[#00ff0491] outline-none py-2 pl-8 pr-4 rounded-xl w-full md:w-auto text-black placeholder-black"
          placeholder="Buscar Proyecto"/>
        </div>
      </form>
    </header>
  );
};

export default Header;
