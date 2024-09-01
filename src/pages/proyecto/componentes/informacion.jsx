import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FcSms,
  FcClock
 } from "react-icons/fc";
 import { FaSave } from "react-icons/fa";

const Informacion = ({ idproyect }) => {
  const [projectName, setProjectName] = useState(null);
  const [projectDescription, setProjectDescription] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [gerenteProyecto, setGerenteProyecto] = useState(null);
  const [departamento, setDepartamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [comentario, setComentario] = useState("");
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [Id_usuario, setUserId] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [usuarioProyecto, setUsuarioProyecto] = useState('');
  const [tareas, setTareas] = useState([]);
  const [userRole, setUserRole] = useState(''); // Para guardar el rol del usuario
  const[sla,setSLA]= useState('');
  const [respuestas, setRespuestas] = useState({});
  const [loadingRespuestas, setLoadingRespuestas] = useState({});
  const [expandedCommentId, setExpandedCommentId] = useState(null);
  const[Slaplay,setSlaDisplay]= useState('');
  const[Estado,setEstado]= useState('');
  const authToken = localStorage.getItem('authToken');



// Función para calcular el tiempo restante en horas desde la fecha actual hasta la fecha de fin
const calculateRemainingSLAInHours = (endDate) => {
  const now = new Date(); // Fecha y hora actuales en la zona horaria local
  const end = new Date(endDate); // Fecha de fin en formato ISO 8601

  if (isNaN(end.getTime())) {
    console.error('Fecha de fin inválida:', endDate);
    return 0;
  }

  const differenceInMilliseconds = end - now;

  // Verificar los valores intermedios para depuración
  console.log('Fecha Actual:', now.toLocaleString());
  console.log('Fecha de Fin:', end.toLocaleString());
  console.log('Diferencia en Milisegundos:', differenceInMilliseconds);

  if (differenceInMilliseconds <= 0) {
    return 0; // El tiempo ya ha pasado
  }

  const differenceInHours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));

  // Verificar la diferencia en horas
  console.log('Diferencia en Horas:', differenceInHours);

  return differenceInHours;
};

// Función para convertir horas a días y horas restantes
const convertSLA = (remainingSLAInHours) => {
  const days = Math.floor(remainingSLAInHours / 24);
  const hours = remainingSLAInHours % 24;
  return `${days} ${days === 1 ? 'Día' : 'Días'} ${hours} ${hours === 1 ? 'Hora' : 'Horas'}`;
};

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/proyectos/${idproyect}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        const dataAttributes = response.data.data.attributes;

        if (dataAttributes) {
          const { Nombre_Proyecto, Objetivo_Proyecto, Fecha_Inicio, Fecha_Fin, Gerente_Proyecto, Departamento, usuario_proyecto,SLA,Estado_Proyecto } = dataAttributes;
          setProjectName(Nombre_Proyecto);
          setProjectDescription(Objetivo_Proyecto);
          setFechaInicio(Fecha_Inicio);
          setFechaFin(Fecha_Fin);
          setGerenteProyecto(Gerente_Proyecto);
          setDepartamento(Departamento);
          setUsuarioProyecto(usuario_proyecto);
          setSLA(SLA);
          setEstado(Estado_Proyecto);

            // Calcular el tiempo restante desde la fecha actual
            const remainingSLAInHours = calculateRemainingSLAInHours(Fecha_Fin);
            console.log('remainingSLAInHours:', remainingSLAInHours); // Verificar el valor aquí
  
            // Convertir las horas restantes a días y horas
            const slaFormatted = convertSLA(remainingSLAInHours);
            console.log('slaFormatted:', slaFormatted); // Verificar el valor aquí
  
            // Asignar el valor calculado a slaDisplay
            setSlaDisplay(slaFormatted);
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [idproyect, authToken]);


  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role || '');
  }, []);

  const displayUsuarioProyecto = usuarioProyecto ? usuarioProyecto.toUpperCase() : 'N/A';

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        try {
          const response = await axios.get(`http://localhost:1337/api/users?filters[username][$eq]=${storedUsername}`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          if (response.data.length > 0) {
            setUserId(response.data[0].id);
          } else {
            console.error('Error: Usuario no encontrado.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserId();
  }, [authToken]);

  const handleSave = async () => {
    // Mostrar la ventana de confirmación
    const result = await Swal.fire({
      title: 'Confirmar',
      text: "Estás a punto de guardar los cambios y modificar el SLA del proyecto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    });

    // Si el usuario confirma, hacer la solicitud API
    if (result.isConfirmed) {
      try {
        const response = await axios.post(`http://localhost:1337/api/proyectos/${projectId}`, { estado: status });
        Swal.fire(
          'Guardado!',
          'El estado del proyecto ha sido actualizado.',
          'success'
        );
        console.log(response.data); // Maneja la respuesta según sea necesario
      } catch (error) {
        Swal.fire(
          'Error!',
          'Hubo un problema al guardar los cambios.',
          'error'
        );
        console.error(error);
      }
    }
  };



  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/comentarios?filters[Id_proyecto][$eq]=${idproyect}&populate=Id_usuario,Id_proyecto`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setComentarios(response.data.data);

        // Actualiza la última hora de comentario
        const latestComment = response.data.data.reduce((latest, comment) => {
          const commentTime = new Date(comment.attributes.Fecha).getTime();
          return commentTime > latest ? commentTime : latest;
        }, 0);
        setLastCommentTime(latestComment);
      } catch (error) {
        console.error('Error fetching comentarios:', error);
      }
    };

    fetchComentarios();
  }, [idproyect, authToken]);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/tareas?populate=Id_proyecto`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        const tareas = response.data.data;
        const tareasDelProyecto  = tareas.filter(tarea => tarea.attributes.Id_proyecto?.data?.id ===  parseInt(idproyect, 10));
        setTareas(tareasDelProyecto );
      } catch (error) {
        console.error('Error fetching tareas:', error);
      }
    };

    fetchTareas();
  }, [idproyect, authToken]);

  const handleOpenModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  const handleOpenReplyModal = (commentId) => {
    setReplyCommentId(commentId);
    setShowReplyModal(true);
  };

  const handleCloseReplyModal = () => {
    setReplyCommentId(null);
    setShowReplyModal(false);
  };

  const handleComentarioChange = (e) => {
    const value = e.target.value;
    if (value.length <= 150) {
      setComentario(value);
      if (value.length < 5) {
        setIsValid(false);
        setErrorMessage("El comentario debe tener al menos 5 caracteres.");
      } else if (value.length === 150) {
        setIsValid(false);
        setErrorMessage("Has alcanzado el límite de caracteres.");
      } else {
        setIsValid(true);
        setErrorMessage("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
        Swal.fire({
            icon: 'error',
            title: 'Comentario inválido',
            text: errorMessage || 'El comentario no es válido.',
        });
        return;
    }

    if (!Id_usuario) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener el ID del usuario.',
        });
        return;
    }

    const currentDateTime = new Date().toISOString();

    // Construye el objeto requestData con los datos que se enviarán
    const requestData = {
        Respuesta: comentario,
        Id_usuarios: Id_usuario,
        Id_proyectos: idproyect,
        Fecha: currentDateTime,
        Id_comentario: replyCommentId // Enviar el ID del comentario al que se responde
    };

    // Verifica los datos que estás enviando
    console.log('Datos enviados a la API:', requestData);

    try {
        await axios.post('http://localhost:1337/api/comentarios',
            { data: requestData },
            {
                headers: { Authorization: `Bearer ${authToken}` }
            }
        );

        Swal.fire({
            icon: 'success',
            title: 'Comentario enviado',
            text: 'Tu comentario ha sido creado exitosamente.',
            showConfirmButton: false,
            timer: 2000, // Tiempo en milisegundos que el mensaje estará visible
        }).then(() => {
            // Recargar la página después de mostrar el mensaje de éxito
            window.location.reload();
        });
    } catch (error) {
        console.error('Error al enviar el comentario:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al enviar el comentario.',
        });
    }
};

const saveProjectStatus = async () => {
  if (!idproyect) {
    console.error('projectId no está definido');
    return;
  }

  // Mostrar la ventana de confirmación
  const result = await Swal.fire({
    title: 'Confirmar',
    text: "Estás a punto de guardar los cambios y modificar el SLA del proyecto.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, guardar',
    cancelButtonText: 'Cancelar'
  });

  // Si el usuario confirma, hacer la solicitud API
  if (result.isConfirmed) {
    try {
      // Datos a enviar a la API
      const dataPayload = {
        data: {
          Estado_Proyecto: Estado
        }
      };

      // Hacer la solicitud PUT con Axios
      const response = await axios.put(`http://localhost:1337/api/proyectos/${idproyect}`, dataPayload);

      Swal.fire(
        'Guardado!',
        'El estado del proyecto ha sido actualizado.',
        'success'
      );
      console.log(response.data); // Maneja la respuesta según sea necesario
    } catch (error) {
      Swal.fire(
        'Error!',
        'Hubo un problema al guardar los cambios.',
        'error'
      );
      console.error(error);
    }
  }
};



  const handleReplySubmit = async (e) => {
    e.preventDefault();
  
    if (!isValid) {
      Swal.fire({
        icon: 'error',
        title: 'Comentario inválido',
        text: errorMessage || 'El comentario no es válido.',
      });
      return;
    }
  
    if (!Id_usuario) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener el ID del usuario.',
      });
      return;
    }
  
    const currentDateTime = new Date().toISOString();
    const idProyectoInt = parseInt(idproyect, 10);
  
    const requestData = {
      Respuesta: comentario,
      Id_usuarios: Id_usuario,
      Id_proyectos: idProyectoInt,
      Fecha: currentDateTime,
      id_comentario: replyCommentId
    };
  
    try {
      const response = await axios.post('http://localhost:1337/api/respuestas',
        { data: requestData },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
  
      Swal.fire({
        icon: 'success',
        title: 'Respuesta enviada',
        text: 'Tu respuesta ha sido creada exitosamente.',
        showConfirmButton: false,
        timer: 2000, // Ajusta el tiempo como prefieras
      }).then(() => {
        setComentario(""); 
        handleCloseReplyModal();
        window.location.reload();
      });
    } catch (error) {
      console.error('Error al enviar la respuesta:', error);
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al enviar la respuesta.',
      });
    }
  };

  const fetchRespuestas = async (comentarioId) => {
    setLoadingRespuestas(prev => ({ ...prev, [comentarioId]: true }));
    
    try {
      const response = await axios.get(`http://localhost:1337/api/respuestas?filters[id_comentario][$eq]=${comentarioId}&populate=Id_usuarios`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setRespuestas(prev => ({ ...prev, [comentarioId]: response.data.data }));
    } catch (error) {
      console.error('Error fetching respuestas:', error);
    } finally {
      setLoadingRespuestas(prev => ({ ...prev, [comentarioId]: false }));
    }
  };

  const handleShowRespuestas = (comentarioId) => {
    if (expandedCommentId === comentarioId) {
        // Si el comentario ya está expandido, colapsarlo
        setExpandedCommentId(null);
    } else {
        // Si no está expandido, mostrar respuestas
        setExpandedCommentId(comentarioId);
        fetchRespuestas(comentarioId);
    }
};


  const handleShowComments = () => {
    setShowComments(!showComments);
  };

  const handleViewComment = (comment) => {
    setSelectedComment(comment);
    setShowCommentModal(true);
  };

  const totalTareas = tareas.length;
  const tareasCompletadas = tareas.filter(tarea => tarea.attributes.Estado.trim() === 'Finalizado').length;

  const showAddCommentButton = userRole === 'Admin';
  const showReplyButton = userRole === 'Desarrollador';
  
  return (
    <div>
      <link rel="stylesheet" href="https://demos.creative-tim.com/notus-js/assets/styles/tailwind.css" />
      <link rel="stylesheet" href="https://demos.creative-tim.com/notus-js/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css" />

      <section className="relative pt-16 bg-blueGray-50">
      <div className="absolute top-4 right-4 p-4 rounded-lg bg-transparent">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <label htmlFor="project-status" className="text-gray-700 text-lg font-bold mr-2">Estado</label>
              <select
                id="project-status"
                value={Estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-48 form-select bg-gray-100 border border-gray-300 rounded-lg py-1 px-2"
              >
                <option value=" ">Seleccionar Opcion</option>
                <option value="Completado">Completado</option>
                <option value="Suspendido">Suspendido</option>
                <option value="En Progreso">En Progreso</option>
              </select>
            </div>
            <button
              onClick={saveProjectStatus}
              className="flex items-center justify-center p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              <FaSave size={20} />
              <span className="ml-2"></span>
            </button>
          </div>
          <div className="mt-4 bg-blue-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <p className="text-lg font-semibold">Estado Actual:{Estado}</p>

          </div>
       </div>
        <div className="container mx-auto">
            <div className="flex flex-wrap items-center">
            <div className="w-full md:w-8/12 lg:w-6/12 px-8 md:px-6 mr-auto ml-auto mt-10">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-green-500">
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
        
        <h4 className="text-xl font-bold text-white uppercase">{projectName}</h4>
        <p className="text-md font-light mt-2 text-white">
          {projectDescription}
        </p>
        <p className="text-md font-light mt-2 text-white">
         ASIGNACION DE PROYECTO: {displayUsuarioProyecto.toUpperCase()} {/* Mostrar el usuario del proyecto */}
        </p>
      </blockquote>

      <div className="flex items-center space-x-2 text-white pb-6 pl-80">
        <FcClock size={24} />   <span className="font-semibold text-lg">SLA "{Slaplay}"</span>           
        </div>
    </div>
    
</div>

      <div className="w-full md:w-6/12 px-4">
        <div className="flex flex-wrap">
          {/* Contenedor para Gerente del Proyecto y Departamento */}
          <div className="flex flex-wrap w-full mb-4">
            <div className="w-full md:w-6/12 px-4">
              <div className="relative flex flex-col mt-4">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                    <i className="far fa-user"></i>
                  </div>
                  <h6 className="text-xl mb-1 font-semibold uppercase">Gerente del Proyecto</h6>
                  <p className="mb-4 text-blueGray-500">
                    {gerenteProyecto}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-6/12 px-4">
              <div className="relative flex flex-col mt-4">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                    <i className="far fa-building"></i>
                  </div>
                  <h6 className="text-xl mb-1 font-semibold uppercase">Departamento</h6>
                  <p className="mb-4 text-blueGray-500">
                    {departamento}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contenedor para Fecha Inicio y Fecha Fin */}
          <div className="flex flex-wrap w-full">
            <div className="w-full md:w-6/12 px-4">
              <div className="relative flex flex-col min-w-0">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                    <i className="far fa-calendar-check"></i>
                  </div>
                  <h6 className="text-xl mb-1 font-semibold uppercase">Fecha Inicio</h6>
                  <p className="mb-4 text-blueGray-500">
                    {fechaInicio}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-6/12 px-4">
              <div className="relative flex flex-col min-w-0">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                    <i className="far fa-calendar-check"></i>
                  </div>
                  <h6 className="text-xl mb-1 font-semibold uppercase">Fecha Fin</h6>
                  <p className="mb-4 text-blueGray-500">
                    {fechaFin}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {showAddCommentButton && (
        <div className="pt-11 mb-6 pl-40">
          <button 
            onClick={handleOpenModal}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-blue-700"
          >
            Agregar comentario
          </button>
        </div>
      )}

        </div>
      </div>
    </div>
        </div>
        
      </section>

      {/* Modal de Comentario */}
      {showModal && (
  <>
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40" />
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {/* Título del Modal */}
        <div className="bg-blue-600 text-white rounded-t-lg py-3 px-4 mb-4">
          <h3 className="text-lg font-semibold text-center uppercase">Crear Comentario</h3>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative mb-4">
            <textarea
              value={comentario}
              onChange={handleComentarioChange}
              placeholder="Escribe tu comentario..."
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isValid ? 'border-red-500' : ''}`}
              rows="4"
              maxLength="150"
            />
            <div className={`absolute bottom-2 right-3 text-sm ${comentario.length === 150 ? 'text-red-500' : 'text-gray-600'}`}>
              {comentario.length}/150
            </div>
          </div>
          <div className={`text-red-500 text-sm mb-4 ${errorMessage ? 'block' : 'hidden'}`}>
            {errorMessage}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  </>
)}


<section className="relative pt-16 bg-blueGray-50">
  <div className="container mx-auto p-4">
    <h2 className="mb-4 text-2xl font-bold text-blue-600">Tareas del Proyecto</h2>

    {tareas.length > 0 && (
      <>
        {/* Mostrar la cantidad de tareas finalizadas */}
        <div className="mb-6 flex justify-center items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-teal-600"></div>
            <p className="text-lg font-semibold text-gray-700">Tareas Completadas: {tareasCompletadas}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-gray-400"></div>
            <p className="text-lg font-semibold text-gray-700">Total de Tareas: {totalTareas}</p>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div className="relative pt-1 mb-6">
          <div className="flex items-center justify-center mb-2">
            <div className="relative flex-1">
              <div className="flex h-2 overflow-hidden text-xs flex-col rounded bg-teal-200">
                <div
                  className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-600"
                  style={{ width: `${(tareasCompletadas / totalTareas) * 100}%` }}
                ></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-teal-600">
                  {tareasCompletadas}/{totalTareas}
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    )}

    {/* Lista de Tareas */}
    <div className="flex flex-wrap gap-4">
      {tareas.length === 0 ? (
        <p className="text-gray-500 text-lg">No hay tareas para este proyecto.</p>
      ) : (
        tareas.map((tarea, index) => {
          const { Nombre, Estado, Prioridad, id } = tarea.attributes;

          // Alterna el color de fondo entre azul y verde para las tareas visibles
          const isEven = index % 2 === 0;
          const defaultBgColor = isEven ? 'bg-blue-50' : 'bg-green-50';
          const defaultBorderColor = isEven ? 'border-blue-100' : 'border-green-100';

          // Definir colores para cada estado
          const stateColors = {
            Cancelado: {
              bgColor: 'bg-red-50',
              borderColor: 'border-red-100',
              textColor: 'text-red-500'
            },
            Finalizado: {
              bgColor: 'bg-green-50',
              borderColor: 'border-green-100',
              textColor: 'text-green-500'
            },
            Ejecucion: {
              bgColor: 'bg-yellow-50',
              borderColor: 'border-yellow-100',
              textColor: 'text-yellow-500'
            },
            Suspendido: {
              bgColor: 'bg-orange-50',
              borderColor: 'border-orange-100',
              textColor: 'text-orange-500'
            }
          };

          // Limpia posibles espacios adicionales y determina los colores basados en el estado
          const trimmedState = Estado.trim();
          const { bgColor = defaultBgColor, borderColor = defaultBorderColor, textColor } = stateColors[trimmedState] || {};


        return (
          <div
            key={tarea.id}
            onClick={() => window.location.href = `/Info_tarea?tareaId=${tarea.id}`}
            className={`flex items-start rounded-xl ${bgColor} p-4 shadow-lg border ${borderColor} cursor-pointer`}
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-full border ${borderColor}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${textColor}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </div>

            <div className="ml-4">
              <h3 className="font-semibold text-lg uppercase">{Nombre}</h3>
              <p className={`mt-2 text-sm font-bold ${textColor}`}>Estado: {Estado}</p>
              <p className={`mt-2 text-sm font-bold ${textColor}`}>Prioridad: {Prioridad}</p>
            </div>
          </div>
        );
      })
    )}
  </div>
</div>

       
       
<div className="container mx-auto pt-4">
      <div className="flex flex-wrap items-center">
        <div className="w-full px-12 md:px-4 mx-auto">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white">
            <div className="p-6">
              <h4 className="text-2xl font-semibold mb-4 text-blue-600">Comentarios</h4>
              <button 
                onClick={handleShowComments}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-blue-700 mb-4"
              >
                {showComments ? 'Ocultar comentarios' : 'Mostrar comentarios'}
              </button>
              <div className={`transition-max-height duration-500 ease-in-out overflow-hidden ${showComments ? 'max-h-screen' : 'max-h-0'}`}>
                {comentarios.length === 0 ? (
                  <p className="text-gray-500 text-lg">No hay comentarios aún.</p>
                ) : (
                  <div className="space-y-6 border-l-2 border-dashed border-blue-500 pl-6">
                    {comentarios.map((comentario) => {
                      const usuario = comentario.attributes.Id_usuario?.data?.attributes?.username || 'Usuario no disponible';
                      const fecha = comentario.attributes.Fecha ? new Date(comentario.attributes.Fecha).toLocaleString() : 'Fecha no disponible';

                      return (
                        
                        <div key={comentario.id} className="relative pl-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute -left-2 -top-1 h-6 w-6 text-blue-500">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        <div className="pl-8">
                            <p className="text-gray-800 text-lg">{comentario.attributes.comentario}</p>
                            <span className="text-gray-500 text-sm block mt-1">
                                {fecha}
                            </span>
                            <p className="text-gray-600 text-sm block mt-1 uppercase">
                                <strong>Usuario:</strong> {usuario}
                            </p>
                            <div className="flex items-center mt-2">
                                {/* Botón de Responder */}
                                {showReplyButton && (
                                    <button
                                        onClick={() => handleOpenReplyModal(comentario.id)}
                                        className="bg-green-500 text-white font-bold py-1 px-2 rounded shadow-lg hover:bg-green-700 flex items-center"
                                    >
                                        Responder
                                    </button>
                                )}
                                <FcSms
                                    className="ml-2 h-6 w-6 text-green-500 cursor-pointer"
                                    onClick={() => handleShowRespuestas(comentario.id)}
                                />
                            </div>
                            {/* Mostrar Respuestas */}
                              {expandedCommentId === comentario.id && (
                                  <div className="mt-4 pl-6 border-l-2 border-green-500">
                                      {loadingRespuestas[comentario.id] ? (
                                          <p>Cargando respuestas...</p>
                                      ) : (
                                          respuestas[comentario.id]?.length > 0 ? (
                                              respuestas[comentario.id].map((respuesta) => {
                                                  // Extraer el nombre de usuario
                                                  const usuarioRespuesta = respuesta.attributes.Id_usuarios?.data[0]?.attributes?.username || 'Usuario no disponible';

                                                  return (
                                                      <div key={respuesta.id} className="mb-2">
                                                          <p className="text-gray-700 text-sm">
                                                              <strong>{usuarioRespuesta}:</strong> {respuesta.attributes.Respuesta}
                                                          </p>
                                                          <span className="text-gray-500 text-xs">{new Date(respuesta.attributes.Fecha).toLocaleString()}</span>
                                                      </div>
                                                  );
                                              })
                                          ) : (
                                              <p className="text-gray-500 text-sm">No hay respuestas aún.</p>
                                          )
                                      )}
                                  </div>
                            )}
                        </div>
                    </div>
                );
            })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para responder comentario */}
{showReplyModal && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
      <h4 className="text-xl font-semibold mb-4 text-blue-600">Responder Comentario</h4>
      <form onSubmit={handleReplySubmit}>
        <div className="mb-4">
          <textarea
            value={comentario}
            onChange={handleComentarioChange}
            rows="4"
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Escribe tu respuesta aquí..."
          ></textarea>
          {!isValid && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
        </div>
        <div className="flex justify-end items-center">
          <button
            type="button"
            onClick={handleCloseReplyModal}
            className="bg-gray-500 text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-gray-700 flex items-center mr-2"
          >
            <i className="fas fa-times mr-2"></i> {/* Icono para cancelar */}
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-blue-700 flex items-center"
          >
            <i className="fas fa-paper-plane mr-2"></i> {/* Icono para enviar */}
            Enviar
          </button>
        </div>
      </form>
    </div>
  </div>
      )}
    </div>
      </section>

     
    </div>
  );
};

export default Informacion;
