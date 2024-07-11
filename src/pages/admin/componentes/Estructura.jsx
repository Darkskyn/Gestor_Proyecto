import React, { useState, useEffect,useRef  } from 'react';
import { FcMindMap } from "react-icons/fc";
import { FcReading } from "react-icons/fc";
import { FcBriefcase } from "react-icons/fc";
import Chart from 'chart.js/auto';

const Estructura = () => {
    const [cantidadProyectos, setCantidadProyectos] = useState(0);
    const [cantidadUsuarios, setCantidadUsuarios] = useState(0);
    const [cantidadRecursos, setCantidadRecursos] = useState(0);
    const [usuarios, setUsuarios] = useState([]);
    const [stats, setStats] = useState({ enProgreso: 0, completado: 0, cancelado: 0 });
    const chartRef = useRef(null);

    const obtenerUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:1337/api/users?populate=role');
            if (!response.ok) {
                throw new Error('Error al obtener los usuarios.');
            }
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    // Función para contar los roles
    const contarRoles = (data) => {
        let adminCount = 0;
        let developerCount = 0;

        data.forEach(user => {
            if (user.role && user.role.name === "Admin") {
                adminCount++;
            } else if (user.role && user.role.name === "Desarrollador") {
                developerCount++;
            }
        });

        return { adminCount, developerCount };
    };
    const { adminCount, developerCount } = contarRoles(usuarios);

    useEffect(() => {
        const fetchProyectos = async () => {
          try {
            const response = await fetch('http://localhost:1337/api/proyectos');
            if (!response.ok) {
              throw new Error('No se pudo obtener la cantidad de proyectos');
            }
            const data = await response.json();
            setCantidadProyectos(data.meta.pagination.total);
            setProyectos(data.data);
          } catch (error) {
            console.error('Error al obtener la cantidad de proyectos:', error);
          }
        };
    
        fetchProyectos();
      }, []);
    
      useEffect(() => {
        const fetchUsuarios = async () => {
          try {
            const response = await fetch('http://localhost:1337/api/users');
            if (!response.ok) {
              throw new Error('No se pudo obtener la lista de usuarios');
            }
            const data = await response.json();
            setCantidadUsuarios(data.length); 
          } catch (error) {
            console.error('Error al obtener la lista de usuarios:', error);
          }
        };
    
        fetchUsuarios();
      }, []);

      useEffect(() => {
        const fetchRecursos = async () => {
          try {
            const response = await fetch('http://localhost:1337/api/menu-recursos');
            if (!response.ok) {
              throw new Error('No se pudo obtener la lista de recursos');
            }
            const data = await response.json();
            setCantidadRecursos(data.data.length); // Establecer la cantidad de recursos
          } catch (error) {
            console.error('Error al obtener la lista de recursos:', error);
          }
        };
    
        fetchRecursos();
      }, []);
    
      useEffect(() => {
        fetchProyectos();
    }, []);

      
    const fetchProyectos = async () => {
        try {
            const response = await fetch('http://localhost:1337/api/proyectos');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const proyectos = data.data;

            let enProgreso = 0;
            let completado = 0;
            let cancelado = 0;

            proyectos.forEach(proyecto => {
                const estado = proyecto.attributes.Estado_Proyecto;

                switch (estado) {
                    case 'En Progreso':
                    case 'Pendiente de Aprobación':
                        enProgreso++;
                        break;
                    case 'Completado':
                        completado++;
                        break;
                    case 'Cancelado':
                        cancelado++;
                        break;
                    default:
                        break;
                }
            });

            setStats({ enProgreso, completado, cancelado });

            if (chartRef.current) {
                const ctx = chartRef.current.getContext('2d');
                if (ctx) {
                    if (window.proyectosChart) {
                        window.proyectosChart.destroy();
                    }
                    window.proyectosChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ['En Progreso', 'Completado', 'Cancelado'],
                            datasets: [{
                                label: 'Estadísticas de Proyectos',
                                data: [enProgreso, completado, cancelado],
                                backgroundColor: [
                                    'rgba(75, 192, 192, 0.8)', // Verde más intenso para Completado
                                    'rgba(54, 162, 235, 0.8)', // Azul más intenso para En Progreso
                                    'rgba(255, 99, 132, 0.8)' // Rojo más intenso para Cancelado
                                ],
                                borderColor: [
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 99, 132, 1)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            animation: {
                                duration: 1000,
                                easing: 'easeInOutQuart' // Animación suave de entrada y salida
                            }
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error al obtener datos de la API:', error);
        }
    };


  return (  
    <div>
        <div class="p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
    <div class="bg-[#0d30a1] text-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
        <div class="flex justify-between pl-7">
            <div>
                <div class="flex items-center mb-1">
                    <div class="pl-14 text-5xl font-semibold">{cantidadUsuarios}</div>
                </div>
                <div class="text-4xl font-medium text-white">Usuarios</div>
            </div>
             {/* Icono circular */}
            <div className="rounded-full bg-slate-100 w-24 h-24  flex items-center justify-center">
              <FcReading className="text-white text-6xl	" />
            </div>
        </div>
         <a href="/Admin_Usuario" className="text-[#00ff03] font-medium text-lg hover:text-white flex items-center justify-end pr-2">
            Ver más...
          </a>
    </div>

    <div className="bg-[#0d30a1] text-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5 relative">
          <div className="flex justify-between pl-7 ">
            <div>
              <div className="flex items-center mb-1">
                <div className=" pl-14 text-5xl font-semibold">{cantidadProyectos}</div>
              </div>
              <div className="text-4xl font-medium text-white">Proyectos</div>
            </div>
            {/* Icono circular */}
            <div className="rounded-full bg-slate-100 w-24 h-24  flex items-center justify-center">
              <FcMindMap className="text-white text-6xl	" />
            </div>
          </div>
          <a href="/Admin_Proyecto" className="text-[#00ff03] font-medium text-lg hover:text-white flex items-center justify-end pr-2">
            Ver más...
          </a>
        </div>

    <div class="bg-[#0d30a1] text-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
        <div class="flex justify-between pl-7">
            <div>
                <div class="text-2xl font-semibold mb-1"></div>
                <div className="pl-14 text-5xl font-semibold">{cantidadRecursos}</div>
                <div class="text-4xl font-medium text-white">Recursos</div>
            </div>
            {/* Icono circular */}
            <div className="rounded-full bg-slate-100 w-24 h-24  flex items-center justify-center">
              <FcBriefcase className="text-white text-6xl	" />
            </div>
        </div>
        <a href="/Admin_Proyecto" className="text-[#00ff03] font-medium text-lg hover:text-white flex items-center justify-end pr-2">
            Ver más...
          </a>
    </div>
</div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="p-6 relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-gray-50 dark:bg-blue-700 w-full shadow-lg rounded">
                <div className="rounded-t mb-0 px-0 border-0">
                    <div className="flex flex-wrap items-center px-4 py-2">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                            <h3 className="font-semibold text-base text-gray-900 dark:text-gray-50">Usuarios</h3>
                        </div>
                    </div>
                    <div className="block w-full overflow-x-auto">
                        <table className="items-center w-full bg-transparent border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-4 bg-gray-100 dark:bg-green-500 text-white dark:text-white align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Roles</th>
                                    <th className="px-4 bg-gray-100 dark:bg-green-500 text-white dark:text-white align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Cantidad</th>
                                    <th className="px-4 bg-gray-100 dark:bg-green-500 text-white dark:text-white align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-gray-700 dark:text-gray-100">
                                    <th className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">Administrator</th>
                                    <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{adminCount}</td>
                                    <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center">
                                            <span className="mr-2">{(adminCount / (adminCount + developerCount) * 100).toFixed(0)}%</span>
                                            <div className="relative w-full">
                                                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                                                    <div style={{ width: `${(adminCount / (adminCount + developerCount) * 100).toFixed(0)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="text-gray-700 dark:text-gray-100">
                                    <th className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">Desarrollador</th>
                                    <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{developerCount}</td>
                                    <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center">
                                            <span className="mr-2">{(developerCount / (adminCount + developerCount) * 100).toFixed(0)}%</span>
                                            <div className="relative w-full">
                                                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                                                    <div style={{ width: `${(developerCount / (adminCount + developerCount) * 100).toFixed(0)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

                  
                        <div class="bg-white border border-blue-500 shadow-md shadow-black/5 p-6 rounded-md">
                    <div class="flex justify-between mb-4 items-start">
                        <div class="font-medium">Auditoria</div>
                         <div class="dropdown">
                            <button type="button" class="dropdown-toggle text-gray-400 hover:text-gray-600"><i class="ri-more-fill"></i></button>
                            <ul class="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                                <li>
                                    <a href="#" class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Profile</a>
                                </li>
                                <li>
                                    <a href="#" class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Settings</a>
                                </li>
                                <li>
                                    <a href="#" class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Logout</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="overflow-hidden">
                        <table class="w-full min-w-[540px]">
                            <tbody>
                                <tr>
                                    <td class="py-2 px-4 border-b border-b-gray-50">
                                        <div class="flex items-center">
                                            <a href="#" class="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Lorem Ipsum</a>
                                        </div>
                                    </td>
                                    <td class="py-2 px-4 border-b border-b-gray-50">
                                        <span class="text-[13px] font-medium text-gray-400">02-02-2024</span>
                                    </td>
                                    <td class="py-2 px-4 border-b border-b-gray-50">
                                        <span class="text-[13px] font-medium text-gray-400">17.45</span>
                                    </td>
                                     <td class="py-2 px-4 border-b border-b-gray-50">
                                        <div class="dropdown">
                                            <button type="button" class="dropdown-toggle text-gray-400 hover:text-gray-600 text-sm w-6 h-6 rounded flex items-center justify-center bg-gray-50"><i class="ri-more-2-fill"></i></button>
                                            <ul class="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                                                <li>
                                                    <a href="#" class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Profile</a>
                                                </li>
                                                <li>
                                                    <a href="#" class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Settings</a>
                                                </li>
                                                <li>
                                                    <a href="#" class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Logout</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td> 
                                </tr>
                                <tr>
                                    <td class="py-2 px-4 border-b border-b-gray-50">
                                        <div class="flex items-center">
                                            <a href="#" class="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Lorem Ipsum</a>
                                        </div>
                                    </td>
                                    <td class="py-2 px-4 border-b border-b-gray-50">
                                        <span class="text-[13px] font-medium text-gray-400">02-02-2024</span>
                                    </td>
                                    <td class="py-2 px-4 border-b border-b-gray-50">
                                        <span class="text-[13px] font-medium text-gray-400">17.45</span>
                                    </td>
                                     <td class="py-2 px-4 border-b border-b-gray-50">
                                        <div class="dropdown">
                                            <button type="button" class="dropdown-toggle text-gray-400 hover:text-gray-600 text-sm w-6 h-6 rounded flex items-center justify-center bg-gray-50"><i class="ri-more-2-fill"></i></button>
                                            <ul class="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                                                <li>
                                                    <a href="#" class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Profile</a>
                                                </li>
                                                <li>
                                                    <a href="#" class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Settings</a>
                                                </li>
                                                <li>
                                                    <a href="#" class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Logout</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td> 
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white border border-blue-700 shadow-md p-6 rounded-md lg:col-span-2">
            <div className="font-medium mb-4">Estadísticas Proyectos</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="rounded-md  border-dashed bg-blue-700 border-white border-2 p-4 flex items-center justify-between">
                    <div>
                        <div className="text-xl text-white font-semibold">{stats.enProgreso}</div>
                        <span className="text-white text-lg">En Progreso</span>
                    </div>
                    {/* Aquí se podría añadir un icono o gráfico pequeño */}
                </div>
                <div className="rounded-md border-dashed bg-blue-700 border-white border-2 p-4 flex items-center justify-between">
                    <div>
                        <div className="text-xl text-white font-semibold">{stats.completado}</div>
                        <span className="text-white text-lg">Completado</span>
                    </div>
                    {/* Aquí se podría añadir un icono o gráfico pequeño */}
                </div>
                <div className="rounded-md  border-dashed bg-blue-700 border-white border-2 p-4 flex items-center justify-between">
                    <div>
                        <div className="text-xl text-white font-semibold">{stats.cancelado}</div>
                        <span className="text-white text-lg">Cancelado</span>
                    </div>
                    {/* Aquí se podría añadir un icono o gráfico pequeño */}
                </div>
            </div>
            <div>
                <canvas ref={chartRef} id="proyectos-chart"></canvas>
            </div>
        </div>


                <div class="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                    <div class="flex justify-between mb-4 items-start">
                        <div class="font-medium">Earnings</div>
                        <div class="dropdown">
                            <button type="button" class="dropdown-toggle text-gray-400 hover:text-gray-600"><i class="ri-more-fill"></i></button>
                            <ul class="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                                <li>
                                    <a href="#" class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Profile</a>
                                </li>
                                <li>
                                    <a href="#" class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Settings</a>
                                </li>
                                <li>
                                    <a href="#" class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Logout</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full min-w-[460px]">
                            <thead>
                                <tr>
                                    <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">Service</th>
                                    <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Earning</th>
                                    <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="py-2 px-4 border-b border-b-gray-50">
                                        <div class="flex items-center">
                                            <img src="https://placehold.co/32x32" alt="" class="w-8 h-8 rounded object-cover block"/>
                                            <a href="#" class="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                                        </div>
                                    </td>
                                    <td class="py-2 px-4 border-b border-b-gray-50">
                                        <span class="text-[13px] font-medium text-emerald-500">+$235</span>
                                    </td>
                                    <td class="py-2 px-4 border-b border-b-gray-50">
                                        <span class="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">Pending</span>
                                    </td>
                                </tr>
                                
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      </div>
  )
}

export default Estructura
