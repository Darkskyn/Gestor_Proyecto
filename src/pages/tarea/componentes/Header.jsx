import React from "react";
// Icons
import { RiSearch2Line } from "react-icons/ri";
import { FiServer } from "react-icons/fi";

const Header = () => {
  // Function to open the modal
  function openModal() {
    document.getElementById("myModal").classList.remove("hidden");
  }

  // Function to close the modal
  function closeModal() {
    document.getElementById("myModal").classList.add("hidden");
  }

  // Function to handle project creation (you can customize this function)
  function createProject() {
    var projectName = document.getElementById("projectName").value;
    var projectDescription = document.getElementById("projectDescription").value;
    var inviteFriend = document.getElementById("inviteFriend").value;

    // Add your logic to handle the project creation here
    console.log("Project Name: " + projectName);
    console.log("Project Description: " + projectDescription);
    console.log("Invite Friend: " + inviteFriend);

    // Close the modal after handling the creation
    closeModal();
  }

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-Black text-2xl md:text-3xl font-bold flex items-center">
        <FiServer className="mr-2" />
        Todas las Tareas <span className="text-primary-100"></span>
      </h1>
     
      <div
        id="myModal"
        className="fixed inset-0 z-10 overflow-hidden backdrop-blur-lg hidden flex items-center justify-center transition-transform duration-300"
      >
        <div className="modal-container p-6 backdrop-blur-sm bg-white/90 w-11/12 sm:w-11/12 md:w-8/12 lg:w-6/12 rounded-md shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Crear Nueva Tarea</h2>
          <label
            htmlFor="projectName"
            className="block text-sm font-medium text-black mb-2"
          >
          Proyecto
          </label>
          <input
            type="text"
            id="projectName"
            className="w-full p-2 mb-4 rounded-lg focus:outline-none border-2 border-[#0d30a1d0] focus:border-green-500 transition-colors duration-300"
          />
          <label
            htmlFor="projectName"
            className="block text-sm font-medium text-black mb-2"
          >
            Nombre Tarea
          </label>
          <input
            type="text"
            id="projectName"
            className="w-full p-2 mb-4 rounded-lg focus:outline-none border-2 border-[#0d30a1d0] focus:border-green-500 transition-colors duration-300"
          />

          <div className="flex justify-end">
            <button
              className="bg-gradient-to-r bg-[#0d30a1d0]  border border-fuchsia-00 hover:border-violet-100 text-white font-semibold py-2 px-4 rounded-md mr-2"
              onClick={createProject}
            >
              Crear
            </button>
            <button
              className="bg-gradient-to-r bg-[#0d30a1d0]  border border-fuchsia-00 hover:border-violet-100 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
              onClick={closeModal}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
