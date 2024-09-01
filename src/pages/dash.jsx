import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Asegúrate de instalar axios si no lo tienes ya
import Header from "../componentes/Header";
import Sidebar from "../componentes/Sidebar";
import { RiLineChartLine, RiHashtag } from "react-icons/ri";
import '../index.css';
import foto2 from '../assets/logo-removebg-preview (1).png';
import icono from '../assets/icono.png';

const API_URL = typeof process !== 'undefined' && process.env.API_URL ? process.env.API_URL : 'http://localhost:1337';

const Dash = () => {
  const [completedProjects, setCompletedProjects] = useState(0);
  const [inProgressProjects, setInProgressProjects] = useState(0);
  const [cancelledProjects, setCancelledProjects] = useState(0);
  const [completedPercentageChange, setCompletedPercentageChange] = useState(0);
  const [inProgressPercentageChange, setInProgressPercentageChange] = useState(0);
  const [cancelledPercentageChange, setCancelledPercentageChange] = useState(0);
  const [projects, setProjects] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);

  useEffect(() => {
    let isMounted = true; // Flag to track component mount status

    const getUserData = async () => {
      try {
        const tokenDeAutenticacion = localStorage.getItem('authToken');
        const configuracion = {
          headers: {
            'Authorization': `Bearer ${tokenDeAutenticacion}`
          }
        };

        const respuestaDeUsuario = await axios.get(`${API_URL}/api/users/me`, configuracion);
        const datosDeUsuario = respuestaDeUsuario.data;

        if (isMounted) {
          setUsuarioActual(datosDeUsuario.username); // Guardar el username del usuario
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    getUserData();

    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/api/proyectos`);
        const data = await response.json();
        const projects = data.data;

        // Contar proyectos por estado
        const completedCount = projects.filter(project => project.attributes.Estado_Proyecto === "Completado").length;
        const inProgressCount = projects.filter(project => project.attributes.Estado_Proyecto === "En Progreso").length;
        const cancelledCount = projects.filter(project => project.attributes.Estado_Proyecto === "Cancelado").length;

        const now = new Date().getTime();
        const storedData = JSON.parse(localStorage.getItem('projectData')) || {};
        const { initialCounts = { completed: 0, inProgress: 0, cancelled: 0 }, initialTimestamp = now } = storedData;

        if (!storedData.initialCounts) {
          localStorage.setItem('projectData', JSON.stringify({
            initialCounts: {
              completed: completedCount,
              inProgress: inProgressCount,
              cancelled: cancelledCount
            },
            initialTimestamp: now
          }));
          setCompletedProjects(completedCount);
          setInProgressProjects(inProgressCount);
          setCancelledProjects(cancelledCount);
          setCompletedPercentageChange(0);
          setInProgressPercentageChange(0);
          setCancelledPercentageChange(0);
        } else {
          const completedChange = initialCounts.completed === 0 ? 0 : ((completedCount - initialCounts.completed) / initialCounts.completed) * 100;
          const inProgressChange = initialCounts.inProgress === 0 ? 0 : ((inProgressCount - initialCounts.inProgress) / initialCounts.inProgress) * 100;
          const cancelledChange = initialCounts.cancelled === 0 ? 0 : ((cancelledCount - initialCounts.cancelled) / initialCounts.cancelled) * 100;

          setCompletedProjects(completedCount);
          setInProgressProjects(inProgressCount);
          setCancelledProjects(cancelledCount);
          setCompletedPercentageChange(completedChange.toFixed(2));
          setInProgressPercentageChange(inProgressChange.toFixed(2));
          setCancelledPercentageChange(cancelledChange.toFixed(2));

          if (now - initialTimestamp > 12 * 60 * 60 * 1000) {
            localStorage.setItem('projectData', JSON.stringify({
              initialCounts: {
                completed: completedCount,
                inProgress: inProgressCount,
                cancelled: cancelledCount
              },
              initialTimestamp: now
            }));
          }
        }
        
        // Set all projects data
        setProjects(projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();

    return () => {
      isMounted = false; // Cleanup flag
    };
  }, []);

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        if (usuarioActual) {
          const response = await fetch(`${API_URL}/api/proyectos?filters[usuario_proyecto][$eq]=${encodeURIComponent(usuarioActual)}`);
          const data = await response.json();
          setProjects(data.data);
        }
      } catch (error) {
        console.error('Error fetching user-specific projects:', error);
      }
    };

    fetchUserProjects();
  }, [usuarioActual]);

  const getPercentageMessage = (percentageChange) => {
    return percentageChange > 0 
      ? `+${percentageChange}% desde el inicio`
      : percentageChange === 0
      ? `Sin cambio desde el inicio`
      : `${percentageChange}% desde el inicio`;
  };

  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      <Sidebar />
      <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 h-[100vh] overflow-y-scroll">
        <Header />
        {/* Section 1 */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mt-10 gap-8">
          {/* Card 1 */}
          <div className="bg-[#0d30a1] p-8 rounded-xl text-gray-300 flex flex-col gap-6">
            <RiLineChartLine className="text-5xl text-white" />
            <h4 className="text-2xl text-white">Proyectos Completados</h4>
            <span className="text-6xl text-white font-bold">{completedProjects}</span>
            <span className={`py-1 px-3 rounded-full ${completedPercentageChange > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {getPercentageMessage(completedPercentageChange)}
            </span>
          </div>
          {/* Card 2 */}
          <div className="p-4 bg-white rounded-xl flex flex-col justify-between gap-4 drop-shadow-2xl">
            <div className="flex items-center gap-4 bg-primary-100/10 rounded-xl p-4">
              <span className="bg-[#0d30a1] text-white text-3xl font-bold p-5 rounded-xl">
                {inProgressProjects}
              </span>
              <div>
                <h3 className="text-lg font-bold">Proyecto - En Progreso</h3>
                <p className="text-gray-600 text-base">{getPercentageMessage(inProgressPercentageChange)}</p>
              </div>
            </div>
            <div className="border-t border-gray-600 pt-4"></div>
            <div className="bg-primary-100/10 rounded-xl p-4">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-[#0d30a1] text-white text-3xl font-bold p-5 rounded-xl">
                  {cancelledProjects}
                </span>
                <div>
                  <h3 className="text-lg font-bold">Proyecto - Cancelados</h3>
                  <p className="text-gray-600 text-base">{getPercentageMessage(cancelledPercentageChange)}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Card 3 */}
          <div className="col-span-1 md:col-span-2 flex flex-col justify-between">
            <h1 className="text-4xl font-bold mb-8 text-blue-600">Tus Proyectos</h1>
            <div className="bg-white p-8 rounded-xl shadow-2xl max-h-[400px] overflow-y-auto">
              {projects.length === 0 ? (
                <p className="text-gray-500">No tienes proyectos disponibles.</p>
              ) : (
                projects.slice(0, 2).map((project) => (
                  <div className="flex items-center gap-4 mb-4" key={project.id}>
                    <img
                      src={icono} // Usa el nuevo icono aquí
                      className="w-20 h-20 object-cover rounded-full"
                      alt={project.attributes.Nombre_Proyecto}
                    />
                    <div>
                      <h3 className="font-bold uppercase">{project.attributes.Nombre_Proyecto}</h3>
                      <p className="text-gray-500">{project.attributes.Objetivo_Proyecto}</p>
                    </div>
                  </div>
                ))
              )}
              {projects.length > 2 && (
                <div className="flex justify-end mt-4">
                <a
                  href="ms_proyect"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold transition-colors hover:bg-blue-600 hover:underline shadow-lg"
                >
                  Ver todos los Proyectos
                </a>
              </div>
              
              
              )}
            </div>
          </div>
        </section>
        {/* Section 2 */}
        <section className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-8">
          <div>
            <h1 className="text-2xl font-bold mb-8">Eventos Agendados</h1>
            <div className="bg-white p-8 rounded-xl shadow-2xl mb-8 flex flex-col gap-8">
              {/* Card 1 */}
              <div className="grid grid-cols-1 xl:grid-cols-4 items-center gap-4 mb-4">
                <div className="col-span-2 flex items-center gap-4">
                  <img
                    src="https://img.freepik.com/foto-gratis/hombre-joven-hermoso-contento-camiseta-azul-que-senala-lado_1262-17845.jpg"
                    className="w-14 h-14 object-cover rounded-xl"
                    alt="Evento 1"
                  />
                  <div>
                    <h3 className="font-bold">Alexander Williams</h3>
                    <p className="text-gray-500">JQ Holdings</p>
                  </div>
                </div>
                <div>
                  <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full font-medium">
                    Paid
                  </span>
                </div>
                <div>
                  <span className="font-bold">&euro; 1,200.87</span>
                </div>
              </div>
              {/* Card 2 */}
              <div className="grid grid-cols-1 xl:grid-cols-4 items-center gap-4 mb-4">
                <div className="col-span-2 flex items-center gap-4">
                  <img
                    src="https://img.freepik.com/foto-gratis/alegre-joven-deportista-posando-mostrando-pulgares-arriba-gesto_171337-8194.jpg"
                    className="w-14 h-14 object-cover rounded-xl"
                    alt="Evento 2"
                  />
                  <div>
                    <h3 className="font-bold">Jhon Philips</h3>
                    <p className="text-gray-500">Inchor Techs</p>
                  </div>
                </div>
                <div>
                  <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full font-medium">
                    Late
                  </span>
                </div>
                <div>
                  <span className="font-bold">&euro; 12,998.88</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-8">Recomendaciones/Mis Proyectos</h1>
            <div className="bg-white p-8 rounded-xl shadow-2xl mb-8 flex flex-col gap-8 h-60">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src="https://img.freepik.com/foto-gratis/retrato-mujer-mayor-cerca_23-2149207185.jpg"
                    className="w-14 h-14 object-cover rounded-full"
                    alt="Recomendación"
                  />
                  <div>
                    <h3 className="font-bold">Thomas Martin</h3>
                    <p className="text-gray-500">Updated 10m ago</p>
                  </div>
                </div>
                <div>
                  <span className="bg-[#0d30a1] py-2 px-4 rounded-full text-white">
                    Design
                  </span>
                </div>
              </div>
              <div>
                <h5 className="text-lg font-bold">
                  Need a designer to form branding essentials for my business.
                </h5>
                <p className="text-gray-500">
                  Looking for a talented brand designer to create all the
                  branding materials my new startup.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Div footer */}
        <div className="bg-[#0d30a1] text-gray-300 p-8 rounded-xl shadow-2xl flex items-center justify-between flex-wrap xl:flex-nowrap gap-8">
          <div className="flex items-center gap-4">
            <div>
              <RiHashtag className="text-4xl -rotate-12" />
            </div>
            <img className="w-64" src={foto2} alt="Foto_Bancamiga" />
          </div>
          <div>
            <h5 className="font-bold text-white">Cada segundo, Cuenta</h5>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dash;
