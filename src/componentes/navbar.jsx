import React from 'react';
import '../index.css'; 
import foto1 from '../assets/logo-removebg-preview (1).png';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-[#0d47a1] to-[#00ff03] border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <a href="" className="flex items-center">
          <img src={foto1} className="h-20" alt="Logo Bancamiga" />    
        </a>
        <p className="text-white text-2xl font-bold">GESTOR DE PROYECTO</p>
        <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
