import React, { useState, useEffect } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import foto1 from '../../../assets/imagen recurso.png';

const Formulario = ({ idproyect, proyecto }) => {
  const [tipo_recurso, setTipoRecurso] = useState("");
  const [recursos, setRecursos] = useState([]);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [recursoHover, setRecursoHover] = useState("");
  const [idMenuRecursoSeleccionado, setIdMenuRecursoSeleccionado] = useState("");
  const [cargandoRecursos, setCargandoRecursos] = useState(true);
  const [recursosSeleccionados, setRecursosSeleccionados] = useState([]);
  const [recursosPorCategoria, setRecursosPorCategoria] = useState({});

  useEffect(() => {
    const fetchRecursos = async () => {
      try {
        const recursosResponse = await axios.get('http://localhost:1337/api/recursos?populate=Id_menu_recurso');
        const recursosDisponibles = recursosResponse.data.data.filter(recurso => recurso.attributes.Estado === true);
        setRecursos(recursosDisponibles);

        // Clasificar recursos por categoría
        const categorized = recursosDisponibles.reduce((acc, recurso) => {
          const tipo = recurso.attributes?.Id_menu_recurso?.data?.attributes?.Nombre || 'Desconocido';
          if (!acc[tipo]) acc[tipo] = [];
          acc[tipo].push(recurso);
          return acc;
        }, {});
        setRecursosPorCategoria(categorized);

        setCargandoRecursos(false);
      } catch (error) {
        console.error('Error fetching recursos data:', error);
        setCargandoRecursos(false);
      }
    };
    fetchRecursos();
  }, [idproyect]);

  const handleTipoRecursoChange = (newValue) => {
    setTipoRecurso(newValue);
    setIdMenuRecursoSeleccionado("");
  };

  const handleSeleccionarRecurso = (recursoId) => {
    setRecursosSeleccionados(prev => {
      const isSelected = prev.includes(recursoId);
      if (isSelected) {
        return prev.filter(id => id !== recursoId);
      } else {
        return [...prev, recursoId];
      }
    });
  };

  const handleMouseEnter = (recursoId) => {
    setRecursoHover(recursoId);
  };

  const handleMouseLeave = () => {
    setRecursoHover("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipo_recurso) {
      Swal.fire({
        icon: 'error',
        title: 'Campo Tipo de Recurso Incompleto',
        text: 'Por favor seleccione un tipo de recurso.',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if (recursosSeleccionados.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'No Hay Recursos Seleccionados',
        text: 'Por favor seleccione al menos un recurso.',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticación no encontrado.');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Desmarcar recursos seleccionados
      const updatePromises = recursosSeleccionados.map(recursoId => {
        const updateUrl = `http://localhost:1337/api/recursos/${recursoId}`;
        const updatePayload = { data: { Estado: false } };
        return axios.put(updateUrl, updatePayload, config);
      });

      await Promise.all(updatePromises);

      // Crear registros con el tipo de recurso correcto para cada uno
      const createPayloads = recursosSeleccionados.map(recursoId => {
        const recurso = recursos.find(r => r.id === recursoId);
        const tipoRecursoId = recurso?.attributes?.Id_menu_recurso?.data?.id || idMenuRecursoSeleccionado;
        return {
          data: {
            id_proyecto: parseInt(idproyect),
            id_recursos: recursoId,
            id_tipo: tipoRecursoId
          }
        };
      });

      // Verifica si cada payload tiene el tipo de recurso definido
      createPayloads.forEach(payload => {
        if (!payload.data.id_tipo) {
          throw new Error(`El tipo de recurso no está definido para el recurso ${payload.data.id_recursos}`);
        }
      });

      const createPromises = createPayloads.map(payload => {
        const createUrl = 'http://localhost:1337/api/recurso-proyectos';
        return axios.post(createUrl, payload, config);
      });

      const responses = await Promise.all(createPromises);
      const allSuccessful = responses.every(response => response.status === 200);
      if (allSuccessful) {
        const result = await Swal.fire({
          icon: 'success',
          title: 'Recursos creados exitosamente',
          text: 'Los recursos han sido creados correctamente.',
          confirmButtonText: 'Entendido',
          showCancelButton: true
        });

        if (result.isConfirmed) {
          setRegistroExitoso(true);
        }
      } else {
        throw new Error('Error al crear algunos recursos');
      }

    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al realizar la operación',
        text: 'Hubo un problema al intentar realizar la operación. Por favor, intenta nuevamente más tarde.',
        confirmButtonText: 'Entendido'
      });
    }
  };

  useEffect(() => {
    if (registroExitoso) {
      window.location.href = `/tabla_recurso?idproyecto=${idproyect}&proyecto=${proyecto}`;
    }
  }, [registroExitoso, idproyect, proyecto]);

  const recursosFiltrados = recursos.filter(recurso => {
    if (tipo_recurso === "") {
      return true;
    }
    return (
      recurso.attributes &&
      recurso.attributes.Id_menu_recurso &&
      recurso.attributes.Id_menu_recurso.data &&
      recurso.attributes.Id_menu_recurso.data.attributes &&
      recurso.attributes.Id_menu_recurso.data.attributes.Nombre === tipo_recurso
    );
  });

  const tieneSeleccionado = {
    Servidores: recursosSeleccionados.some(recursoId => recursosPorCategoria.Servidores && recursosPorCategoria.Servidores.some(r => r.id === recursoId)),
    Equipo: recursosSeleccionados.some(recursoId => recursosPorCategoria.Equipo && recursosPorCategoria.Equipo.some(r => r.id === recursoId)),
    Humano: recursosSeleccionados.some(recursoId => recursosPorCategoria.Humano && recursosPorCategoria.Humano.some(r => r.id === recursoId))
  };

  return (
    <div className="flex justify-center items-center pt-14 pb-20 bg-gray-100">
      <div className="flex space-x-8 w-full max-w-7xl">
        <form id="create-resource-form" className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mr-12" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Formulario de Recursos</h2>
          
          <div className="mb-6">
            <img src={foto1} alt="Imagen de recursos" className="mx-auto mb-4" />
            <label className="block text-gray-700 font-bold mb-2 uppercase">TIPO DE RECURSO</label>
            <select
              id="tipo_recurso"
              value={tipo_recurso}
              onChange={(e) => handleTipoRecursoChange(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Seleccione el tipo de recurso</option>
              {[...new Set(recursos.map(recurso => (
                recurso.attributes?.Id_menu_recurso?.data?.attributes?.Nombre || 'Desconocido'
              )))].map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          {tipo_recurso && (
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2 uppercase">RECURSOS DISPONIBLES</label>
              {cargandoRecursos ? (
                <p className="text-center text-gray-500">Cargando recursos...</p>
              ) : recursosFiltrados.length === 0 ? (
                <p className="text-center text-gray-500">No hay recursos disponibles.</p>
              ) : (
                <ul className="border border-gray-300 rounded-md p-2 max-h-24 overflow-y-auto bg-white">
                  {recursosFiltrados.map(recurso => (
                    recurso.attributes?.Nombre ? (
                      <li
                        key={recurso.id}
                        className={`py-2 px-3 cursor-pointer transition duration-300 ${recursosSeleccionados.includes(recurso.id) || recurso.id === recursoHover ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                        onClick={() => handleSeleccionarRecurso(recurso.id)}
                        onMouseEnter={() => handleMouseEnter(recurso.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {recurso.attributes.Nombre}
                      </li>
                    ) : null
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="flex justify-center">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">CREAR RECURSOS</button>
          </div>
        </form>

        <div className="w-full bg-white rounded-xl border border-gray-200 shadow-lg p-4 flex flex-col h-[400px] overflow-y-auto">
  <div className="flex items-center justify-between mb-4 px-4 py-2 bg-blue-50 border-b border-gray-200 rounded-t-md">
    <h2 className="text-base font-semibold text-blue-800">Recursos Seleccionados</h2>
    <button
      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
      onClick={() => setRecursosSeleccionados([])}
      aria-label="Eliminar todos los recursos seleccionados"
    >
      <svg className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    </button>
  </div>

  <div className="flex flex-wrap gap-6 px-4 py-2">
    {recursosSeleccionados.length === 0 ? (
      <p className="text-center text-gray-500 w-full text-sm">No hay recursos seleccionados.</p>
    ) : (
      recursosSeleccionados.map(recursoId => {
        const recurso = recursos.find(r => r.id === recursoId);
        const tipoRecurso = recurso?.attributes?.Id_menu_recurso?.data?.attributes?.Nombre || 'Desconocido';
        return recurso ? (
          <div
            key={recursoId}
            className="flex-none w-[calc(33.333%_-_24px)] max-w-[300px] p-2"
          >
            <button
              className="group flex items-center p-3 rounded-lg shadow-md bg-white border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-lg w-full"
              onClick={() => handleSeleccionarRecurso(recursoId)}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-600 text-white text-lg font-medium">
                {recurso.attributes?.Nombre.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col ml-4 max-w-[calc(100%_-_64px)]">
                <p className="text-sm font-semibold text-gray-800 truncate">{recurso.attributes?.Nombre.toUpperCase()}</p>
                <span className="text-xs font-light text-gray-500 uppercase truncate">{tipoRecurso}</span>
              </div>
            </button>
          </div>
        ) : null;
      })
    )}
  </div>

  <div className="flex justify-between items-center mt-auto">
    <p className={`text-sm ${tieneSeleccionado.Servidores ? 'text-green-500' : 'text-red-500'}`}>Servidor: {tieneSeleccionado.Servidores ? '✓ Seleccionado' : '✗ No Seleccionado'}</p>
    <p className={`text-sm ${tieneSeleccionado.Equipo ? 'text-green-500' : 'text-red-500'}`}>Equipo: {tieneSeleccionado.Equipo ? '✓ Seleccionado' : '✗ No Seleccionado'}</p>
    <p className={`text-sm ${tieneSeleccionado.Humano ? 'text-green-500' : 'text-red-500'}`}>Humano: {tieneSeleccionado.Humano ? '✓ Seleccionado' : '✗ No Seleccionado'}</p>
  </div>
</div>

      </div>
    </div>
  );
};

export default Formulario;
