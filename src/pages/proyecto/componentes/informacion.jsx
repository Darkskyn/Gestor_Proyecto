import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Informacion = ({ idproyect }) => {
  const [projectName, setProjectName] = useState(null);
  const [projectDescription, setProjectDescription] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [gerenteProyecto, setGerenteProyecto] = useState(null);
  const [departamento, setDepartamento] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/proyectos/${idproyect}`);
        const { Nombre_Proyecto, Descripcion, Fecha_Inicio, Fecha_Fin, Gerente_Proyecto, Departamento } = response.data.data.attributes;
        setProjectName(Nombre_Proyecto);
        setProjectDescription(Descripcion);
        setFechaInicio(Fecha_Inicio);
        setFechaFin(Fecha_Fin);
        setGerenteProyecto(Gerente_Proyecto);
        setDepartamento(Departamento);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProjectData();
  }, [idproyect]);

  // Si projectName, projectDescription, fechaInicio, fechaFin, gerenteProyecto o departamento aún no se han cargado, muestra un mensaje de carga o retorna null
  if (!projectName || !projectDescription || !fechaInicio || !fechaFin || !gerenteProyecto || !departamento) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {/* Mantenemos intacto el código HTML y CSS del front-end */}
      <link rel="stylesheet" href="https://demos.creative-tim.com/notus-js/assets/styles/tailwind.css" />
      <link rel="stylesheet" href="https://demos.creative-tim.com/notus-js/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css" />

      <section className="relative pt-16 bg-blueGray-50">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="w-10/12 md:w-6/12 lg:w-4/12 px-12 md:px-4 mr-auto ml-auto -mt-78">
              <div className="relative flex flex-col min-w-0 break-words  w-full mb-6 shadow-lg rounded-lg bg-green-500">
                <img
                  alt="..."
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=700&amp;q=80"
                  className="w-full align-middle rounded-t-lg"
                />
                <blockquote className="relative p-8 mb-4">
                  <svg
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 583 95"
                    className="absolute left-0 w-full block h-95-px -top-94-px"
                  >
                    <polygon points="-30,95 583,95 583,65" className="text-green-500 fill-current"></polygon>
                  </svg>
                  <h4 className="text-xl font-bold text-white">{projectName}</h4> {/* Nombre del proyecto */}
                  <p className="text-md font-light mt-2 text-white">
                    {projectDescription}
                  </p>
                </blockquote>
              </div>
            </div>

            <div className="w-full md:w-6/12 px-4">
              <div className="flex flex-wrap">
                <div className="w-full md:w-6/12 px-4">
                  <div className="relative flex flex-col mt-4">
                    <div className="px-4 py-5 flex-auto">
                      <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                        <i className="far fa-user"></i>
                      </div>
                      <h6 className="text-xl mb-1 font-semibold">Gerente del Proyecto</h6>
                      <p className="mb-4 text-blueGray-500">
                        {gerenteProyecto}
                      </p>
                    </div>
                  </div>
                  <div className="relative flex flex-col min-w-0">
                    <div className="px-4 py-5 flex-auto">
                      <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                        <i className="far fa-calendar-alt"></i>
                      </div>
                      <h6 className="text-xl mb-1 font-semibold">Fecha Inicio</h6>
                      <p className="mb-4 text-blueGray-500">
                        {fechaInicio}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-6/12 px-4">
                  <div className="relative flex flex-col min-w-0 mt-4">
                    <div className="px-4 py-5 flex-auto">
                      <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                        <i className="far fa-building"></i>
                      </div>
                      <h6 className="text-xl mb-1 font-semibold">Departamento</h6>
                      <p className="mb-4 text-blueGray-500">
                        {departamento}
                      </p>
                    </div>
                  </div>
                  <div className="relative flex flex-col min-w-0">
                    <div className="px-4 py-5 flex-auto">
                      <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                        <i className="far fa-calendar-check"></i>
                      </div>
                      <h6 className="text-xl mb-1 font-semibold">Fecha Fin</h6>
                      <p className="mb-4 text-blueGray-500">
                        {fechaFin}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Informacion;
