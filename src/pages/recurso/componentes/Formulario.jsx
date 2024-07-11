import React, { useState, useEffect } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import foto1 from '../../../assets/imagen recurso.png';

const Formulario = ({ idproyect, proyecto }) => {

  const [tipo_recurso, setTipoRecurso] = useState("");
  const [recursos, setRecursos] = useState([]);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [recursoSeleccionado, setRecursoSeleccionado] = useState("");
  const [recursoHover, setRecursoHover] = useState("");
  const [recursoSeleccionadoMarcado, setRecursoSeleccionadoMarcado] = useState("");
  const [idMenuRecursoSeleccionado, setIdMenuRecursoSeleccionado] = useState("");
  const [cargandoRecursos, setCargandoRecursos] = useState(true); // Estado para manejar la carga de recursos

  useEffect(() => {
    console.log('idproyecto:', idproyect); // Mostrar idproyecto por consola
    const fetchRecursos = async () => {
      try {
        const recursosResponse = await axios.get('http://localhost:1337/api/recursos?populate=Id_menu_recurso');
        setRecursos(recursosResponse.data.data);
        setCargandoRecursos(false); // Indicar que la carga de recursos ha finalizado
      } catch (error) {
        console.error('Error fetching recursos data:', error);
        setCargandoRecursos(false); // Incluso si hay error, termina la carga de recursos
      }
    };
    fetchRecursos();
  }, [idproyect]); // Agrega idproyecto como dependencia para que se ejecute el efecto cuando cambie

  const handleTipoRecursoChange = (newValue) => {
    setTipoRecurso(newValue);
    setRecursoSeleccionado("");
    setRecursoSeleccionadoMarcado("");
    setIdMenuRecursoSeleccionado("");
  };

  const handleSeleccionarRecurso = (recursoId) => {
    const recursoSeleccionado = recursos.find(recurso => recurso.id === recursoId);
    if (recursoSeleccionado) {
      setRecursoSeleccionado(recursoId);
      setIdMenuRecursoSeleccionado(recursoSeleccionado.attributes.Id_menu_recurso.data.id);
    }
    setRecursoSeleccionadoMarcado(recursoId);
  };

  const handleMouseEnter = (recursoId) => {
    setRecursoHover(recursoId);
  };

  const handleMouseLeave = () => {
    setRecursoHover("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipo_recurso || !recursoSeleccionado || !idMenuRecursoSeleccionado) {
      Swal.fire({
        icon: 'error',
        title: 'Campos Incompletos',
        text: 'Por favor complete todos los campos antes de crear el recurso.',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken'); 
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Solicitud POST para actualizar el estado del recurso seleccionado a true
      const updateUrl = `http://localhost:1337/api/recursos/${recursoSeleccionado}`;

      const updatePayload = {
        data:{
          Estado: true  // Actualizar el estado a true
        }
      };

      const updateResponse = await axios.put(updateUrl, updatePayload, config);

      if (updateResponse.status === 200) {
        // Solicitud POST para crear un nuevo registro de recurso
        const createUrl = 'http://localhost:1337/api/recurso-proyectos';

        const createPayload = {
          data: {
            id_proyecto: parseInt(idproyect),
            id_recursos: recursoSeleccionado,
            id_tipo: idMenuRecursoSeleccionado,
          }
        };

        const createResponse = await axios.post(createUrl, createPayload, config);

        if (createResponse.status === 200) {
          // Mostrar mensaje de éxito con opción de aceptar
          const result = await Swal.fire({
            icon: 'success',
            title: 'Recurso creado exitosamente',
            text: 'El recurso ha sido creado correctamente.',
            confirmButtonText: 'Entendido',
            showCancelButton: true  // Mostrar el botón de cancelar
          });

          if (result.isConfirmed) {
            setRegistroExitoso(true);  // Marcar como exitoso solo si el usuario acepta
          }
        } else {
          console.error('Error al crear el recurso:', createResponse);
          Swal.fire({
            icon: 'error',
            title: 'Error al crear el recurso',
            text: 'Hubo un problema al intentar crear el recurso. Por favor, intenta nuevamente más tarde.',
            confirmButtonText: 'Entendido'
          });
        }
      } else {
        console.error('Error al actualizar el estado del recurso:', updateResponse);
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar el estado del recurso',
          text: 'Hubo un problema al intentar actualizar el estado del recurso. Por favor, intenta nuevamente más tarde.',
          confirmButtonText: 'Entendido'
        });
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

  // Filtrar recursos por tipo seleccionado y estado disponible (Estado === false)
  const recursosFiltrados = recursos.filter(recurso => {
    if (tipo_recurso === "") {
      return !recurso.attributes || !recurso.attributes.Estado; // Mostrar recursos con Estado false si no hay tipo seleccionado
    }
    return (
      recurso.attributes &&
      recurso.attributes.Id_menu_recurso &&
      recurso.attributes.Id_menu_recurso.data &&
      recurso.attributes.Id_menu_recurso.data.attributes &&
      recurso.attributes.Id_menu_recurso.data.attributes.Nombre === tipo_recurso &&
      !recurso.attributes.Estado // Mostrar recursos con Estado false del tipo seleccionado
    );
  });

  return (
    <div className="flex justify-center items-center pt-14 pb-20 bg-gray-100">
      <form id="create-resource-form" className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Crear Nuevo Recurso</h2>

        {/* Imagen dentro del formulario */}
        <div className="mb-4">
          <img src={foto1} alt="Imagen Recurso" className="mx-auto mb-4" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="mb-2">
            <label htmlFor="resource-type" className="block text-gray-700 font-bold mb-2">Tipo de Recurso</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="tipo"
              value={tipo_recurso}
              onChange={(e) => handleTipoRecursoChange(e.target.value)}
              required
            >
              <option value="">Seleccione el tipo de recurso</option>
              {[...new Set(recursos.map(recurso => (
                recurso.attributes &&
                recurso.attributes.Id_menu_recurso &&
                recurso.attributes.Id_menu_recurso.data &&
                recurso.attributes.Id_menu_recurso.data.attributes &&
                recurso.attributes.Id_menu_recurso.data.attributes.Nombre
              )))].map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          {tipo_recurso !== "" && (
            <div className="mb-2">
              <label className="block text-gray-700 font-bold mb-2">Recursos Disponibles</label>
              {cargandoRecursos ? (
                <p>Cargando recursos...</p>
              ) : recursosFiltrados.length === 0 ? (
                <p>No hay recursos disponibles.</p>
              ) : (
                <ul className="dropdown-menu border border-gray-300 rounded-md p-2 max-h-36 overflow-y-auto">
                  {recursosFiltrados.map(recurso => (
                    <li
                      key={recurso.id}
                      className={`py-1 px-2 cursor-pointer transition duration-300 ${recurso.id === recursoHover || recurso.id === recursoSeleccionadoMarcado ? 'bg-blue-200' : ''}`}
                      onClick={() => handleSeleccionarRecurso(recurso.id)}
                      onMouseEnter={() => handleMouseEnter(recurso.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {recurso.attributes && recurso.attributes.Nombre}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="flex justify-center">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">Crear Recurso</button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default Formulario;
