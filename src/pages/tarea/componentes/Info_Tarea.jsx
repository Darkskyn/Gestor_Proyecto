import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaSave } from "react-icons/fa";
import { FcSms,
  FcClock
 } from "react-icons/fc";
 import { LiaPlusCircleSolid } from 'react-icons/lia';
 import { AiFillFilePdf } from 'react-icons/ai';

const Info_Tarea = ({ idtarea }) => {
  const [nombreTarea, setNombreTarea] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [Descripcion,setDescripcion] = useState(null)
  const [estado, setEstado] = useState(null);
  const [prioridad, setPrioridad] = useState(null);
  const [hitos, setHitos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [comentario, setComentario] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [Id_usuario, setUserId] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [userRole, setUserRole] = useState(""); // Nueva variable para el rol del usuario
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [expandedCommentId, setExpandedCommentId] = useState(null);
  const authToken = localStorage.getItem('authToken');
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [loadingRespuestas, setLoadingRespuestas] = useState({});
  const [respuestas, setRespuestas] = useState({});
  const[Slaplay,setSlaDisplay]= useState('');
  const [dragging, setDragging] = useState(false);
  const [hasFiles, setHasFiles] = useState(false); // Nuevo estado para controlar la visibilidad del botón
  const [files, setFiles] = useState([]);
  const [adjuntoTarea, setAdjuntoTarea] = useState([]);
  
  useEffect(() => {
    if (!idtarea) return;

    const tareaIdInt = parseInt(idtarea, 10);
    if (isNaN(tareaIdInt)) {
      console.error('El ID de la tarea no es válido.');
      return;
    }

    fetch(`http://localhost:1337/api/tareas/${tareaIdInt}?populate=Adjunto`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.data && data.data.attributes && data.data.attributes.Adjunto) {
          const taskFiles = data.data.attributes.Adjunto.data || [];
          setFiles(taskFiles);
        } else {
          console.error('No se encontraron archivos adjuntos en la respuesta de la API.');
          setFiles([]);
        }
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        setFiles([]);
      });
  }, [authToken, idtarea]);

  useEffect(() => {
    // Actualiza hasFiles cuando adjuntoTarea cambia
    setHasFiles(adjuntoTarea.length > 0);
  }, [adjuntoTarea]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const invalidFiles = files.filter(file => file.type !== 'application/pdf');
    if (invalidFiles.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Tipo de archivo no válido',
        text: 'Por favor, seleccione solo archivos PDF.',
      });
      e.target.value = ''; // Limpia el campo de archivo si hay archivos inválidos
    } else {
      setAdjuntoTarea(prevFiles => [...prevFiles, ...files]); // Actualiza el estado con los archivos válidos
    }
  };

  const handleFileRemove = (index) => {
    setAdjuntoTarea(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleUploadFiles = async () => {
    const tareaIdInt = parseInt(idtarea, 10);

    if (isNaN(tareaIdInt)) {
      Swal.fire({
        icon: 'error',
        title: 'ID de tarea inválido',
        text: 'Por favor, proporcione un ID de tarea válido.',
      });
      return;
    }

    if (adjuntoTarea.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'No hay archivos',
        text: 'Por favor, seleccione al menos un archivo para subir.',
      });
      return;
    }

    const formData = new FormData();
    adjuntoTarea.forEach(file => {
      formData.append('files.files', file); // Nombre del campo debe coincidir con el que espera el backend
    });

    // Agregar el ID de los archivos a 'data'
    const fileIds = adjuntoTarea.map((_, index) => index + 1); // Aquí asume que los IDs de archivo son consecutivos o ajusta según el backend
    formData.append('data', JSON.stringify({
      Adjunto: fileIds
    }));

    // Imprime el contenido de FormData para depuración
    console.log('Contenido de FormData:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`);
        console.log(`  Name: ${value.name}`);
        console.log(`  Size: ${value.size}`);
        console.log(`  Type: ${value.type}`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'No autenticado',
          text: 'Por favor, inicie sesión para continuar.',
        });
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          // No establecer 'Content-Type': 'multipart/form-data' manualmente
        }
      };

      const response = await axios.put(`http://localhost:1337/api/tareas/${tareaIdInt}`, formData, config);
      console.log('Respuesta completa de la API:', response);
      console.log('Datos de la respuesta de la API:', response.data);

      // Limpia el estado y el campo de archivo después de la subida
      setAdjuntoTarea([]);
      Swal.fire({
        icon: 'success',
        title: 'Archivos actualizados exitosamente',
        text: '',
      }).then(() => {
        // Recarga la ventana después de cerrar la alerta
        window.location.reload();
      });
      } catch (error) {
        console.error('Error al subir archivos:', error.response || error);
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
        Swal.fire('Error', `Hubo un error al actualizar los archivos. Detalles: ${errorMessage}`, 'error');
      }
  };
  

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
    const fetchTaskData = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/tareas/${idtarea}`);
        const tarea = response.data.data;

        if (tarea) {
          const { Nombre, Fecha_Inicio, Fecha_Fin, Estado, Prioridad, Hitos,Descripcion} = tarea.attributes;
          setNombreTarea(Nombre);
          setFechaInicio(Fecha_Inicio);
          setFechaFin(Fecha_Fin);
          setEstado(Estado);
          setPrioridad(Prioridad);
          setHitos(Hitos);
          setDescripcion(Descripcion);
          setLoading(false);

          // Calcular el tiempo restante desde la fecha actual
          const remainingSLAInHours = calculateRemainingSLAInHours(Fecha_Fin);
          console.log('remainingSLAInHours:', remainingSLAInHours); // Verificar el valor aquí

          // Convertir las horas restantes a días y horas
          const slaFormatted = convertSLA(remainingSLAInHours);
          console.log('slaFormatted:', slaFormatted); // Verificar el valor aquí

          // Asignar el valor calculado a slaDisplay
          setSlaDisplay(slaFormatted);


        } else {
          console.error('Error: No se encontraron datos válidos en la respuesta.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching task data:', error);
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [idtarea]);

  useEffect(() => {
    // Obtén el rol del usuario desde localStorage
    const role = localStorage.getItem('userRole');
    if (role) {
      setUserRole(role);
    }
  }, []);

  const handleOpenReplyModal = (comentarioId) => {
    setReplyCommentId(comentarioId);
    setShowReplyModal(true);
  };

  const handleCloseReplyModal = () => {
    setReplyCommentId(null);
    setShowReplyModal(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        try {
          const response = await axios.get(`http://localhost:1337/api/users?filters[username][$eq]=${storedUsername}`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          if (response.data.length > 0) {
            const user = response.data[0];
            setUserId(user.id);
          } else {
            console.error('Error: Usuario no encontrado.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [authToken]);

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/comentario-ts?filters[Id_tarea][$eq]=${idtarea}&populate=Id_usuario,Id_tarea`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setComentarios(response.data.data);
      } catch (error) {
        console.error('Error fetching comentarios:', error);
      }
    };

    fetchComentarios();
  }, [idtarea, authToken]);

  const handleOpenModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
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
      alert(errorMessage || 'El comentario no es válido.');
      return;
    }

    if (!Id_usuario) {
      alert('No se pudo obtener el ID del usuario.');
      return;
    }

    const currentDateTime = new Date().toISOString();
    const idTareaInt = parseInt(idtarea, 10);

    const requestData = {
      data: {
        comentario,
        Id_usuario,
        Id_tarea: idTareaInt,
        Fecha: currentDateTime
      }
    };

    console.log('Datos a enviar:', requestData);

    try {
      await axios.post(`http://localhost:1337/api/comentario-ts`, 
        requestData,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      
      await Swal.fire({
        icon: 'success',
        title: 'Comentario creado exitosamente',
        text: 'Tu comentario ha sido enviado.',
        showConfirmButton: false,
        timer: 1500
      });

      window.location.reload();
    } catch (error) {
      console.error('Error al enviar el comentario:', error.response || error.message);

      const errorMessage = error.response?.data?.message || 'Error al enviar el comentario';
      alert(errorMessage);
    }
  };

  const saveProjectStatus = async () => {
    if (!idtarea) {
      console.error('idtarea no está definido');
      return;
    }

    // Mostrar la ventana de confirmación
    const result = await Swal.fire({
      title: 'Confirmar',
      text: "Estás a punto de guardar los cambios y modificar el SLA de la tarea.",
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
        // Obtener el token de autenticación del localStorage
        const authToken = localStorage.getItem('authToken');

        // Datos a enviar a la API
        const dataPayload = {
          data: {
            Estado: estado 
          }
        };

        // Hacer la solicitud PUT con Axios
        const response = await axios.put(
          `http://localhost:1337/api/tareas/${idtarea}`,
          dataPayload,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}` // Incluir el token de autenticación en los encabezados
            }
          }
        );

        // Actualizar el estado actual solo después de guardar
        setEstado( estado);

        Swal.fire(
          'Guardado!',
          'El estado de la tarea ha sido actualizado.',
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

    const currentDateTime = new Date().toISOString();

    // Validación del comentario
    if (!comentario.trim()) {
      setIsValid(false);
      setErrorMessage('El comentario no puede estar vacío.');
      return;
    }

    const requestData = {
      Fecha: currentDateTime,
      Respuesta: comentario,
      Id_usuario: Id_usuario,
      Id_tarea:idtarea,
      Id_comentarios: replyCommentId,
    };

    try {
      const response = await axios.post('http://localhost:1337/api/respuesta-ts',
        { data: requestData },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      console.log('Datos que se enviarán:', requestData);

      Swal.fire({
        icon: 'success',
        title: 'Respuesta enviada',
        text: 'Tu respuesta ha sido creada exitosamente.',
        showConfirmButton: false,
        timer: 2000, // Ajusta el tiempo como prefieras
      }).then(() => {
        setComentario(""); 
        handleCloseReplyModal();
        // Actualiza la interfaz aquí en lugar de recargar la página si es posible
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
      const response = await axios.get(`http://localhost:1337/api/respuesta-ts?filters[Id_comentarios][$eq]=${comentarioId}&populate=Id_usuario`, { 
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setRespuestas(prev => ({ ...prev, [comentarioId]: response.data.data }));
    } catch (error) {
      console.error('Error fetching respuestas:', error);
    } finally {
      setLoadingRespuestas(prev => ({ ...prev, [comentarioId]: false }));
    }
  };

  const handleShowComments = () => {
    setShowComments(!showComments);
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


  if (loading) {
    return <div>Cargando...</div>;
  }
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
                value={estado}
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
            <p className="text-lg font-semibold">Estado Actual:{estado}</p>

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
                  <h4 className="text-3xl font-bold text-white uppercase">{nombreTarea}</h4>
  <p className="text-lg font-light mt-4 text-white">
    {Descripcion}
  </p>            
                </blockquote>
      
                <div className="flex items-center space-x-2 text-white pb-6 pl-80">
        <FcClock size={24} />   <span className="font-semibold text-lg">SLA "{Slaplay}"</span>           
        </div>

         </div>
            </div>

            <div className="w-full md:w-6/12 px-4">
              <div className="flex flex-wrap">
                <div className="w-full md:w-6/12 px-4">
                  <div className="relative flex flex-col mt-4">
                    <div className="px-4 py-5 flex-auto">
                      <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                        <i className="far fa-calendar-alt"></i>
                      </div>
                      <h6 className="text-xl mb-1 font-semibold uppercase">Fecha Inicio</h6>
                      <p className="mb-4 text-blueGray-500">
                        {fechaInicio}
                      </p>
                    </div>
                  </div>
                  <div className="relative flex flex-col min-w-0">
                    <div className="px-4 py-5 flex-auto">
                      <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                        <i className="far fa-flag"></i>
                      </div>
                      <h6 className="text-xl mb-1 font-semibold uppercase">Prioridad</h6>
                      <p className="mb-4 text-blueGray-500">
                        {prioridad}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-6/12 px-4">
                  <div className="relative flex flex-col mt-4">
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
                  <div className="relative flex flex-col min-w-0">
                    <div className="px-4 py-5 flex-auto">
                      <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <h6 className="text-xl mb-1 font-semibold uppercase">Hitos</h6>
                      <p className="mb-4 text-blueGray-500">
                        {hitos ? 'Sí' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 ml-24">
                {/* Mostrar el botón solo si el rol no es 'Desarrollador' */}
                {userRole !== 'Desarrollador' && (
                  <button
                    className="px-6 py-2 bg-blue-500 text-white font-bold uppercase rounded shadow hover:shadow-lg outline-none focus:outline-none"
                    onClick={handleOpenModal}
                  >
                    Agregar Comentario
                  </button>
                )}

                {/* Modal de Comentario */}
                {showModal && (
                  <>
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40" />
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <div className="bg-blue-600 text-white rounded-t-lg py-3 px-4 mb-4">
                          <h3 className="text-lg font-semibold text-center uppercase">Crear Comentario</h3>
                        </div>

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
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pt-16 bg-blueGray-50">
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
                                                  const usuarioRespuesta = respuesta.attributes.Id_usuario?.data?.attributes?.username || 'Usuario no disponible';

                                                  return (
                                                      <div key={respuesta.id} className="mb-2">
                                                          <p className="text-gray-700 text-sm uppercase">
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

<div className="py-8">
      <div className="mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6">Informes PDF</h1>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-blue-700 py-8 px-4 rounded-lg shadow-lg">
          <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {files.length === 0 ? (
                <div className="col-span-1 text-center text-gray-500 text-lg font-semibold">
                  No hay archivos PDF disponibles.
                </div>
              ) : (
                files.map((file) => (
                  <div key={file.id} className="flex items-center space-x-4 bg-gray-200 p-4 rounded-lg shadow-md hover:bg-gray-300 transition ease-in-out duration-150">
                    <AiFillFilePdf className="text-red-600 text-5xl" />
                    <div className="flex flex-col">
                      <a
                        href={`http://localhost:1337${file.attributes.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200"
                      >
                        {file.attributes.name}
                      </a>
                      <span className="text-sm text-gray-600">{file.attributes.size} bytes</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <button
            className="mt-6 md:mt-0 md:ml-6 bg-green-500 text-white rounded-lg shadow-md px-4 py-2 flex items-center space-x-2 hover:bg-green-600 transition ease-in-out duration-150"
            onClick={() => document.getElementById('fileInput').click()}
          >
            <LiaPlusCircleSolid className="text-2xl" />
            <span className="font-semibold">Anexar otro documento PDF</span>
          </button>
          <input
            id="fileInput"
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div className="mt-6">
          {adjuntoTarea.length > 0 && (
            <div className="mt-4 space-y-2">
              {adjuntoTarea.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border border-gray-300 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center bg-gray-200 rounded-xl">
                      <AiFillFilePdf className="h-full w-full text-red-500" />
                    </div>
                    <div className="flex flex-col">
                      <h5 className="text-base font-bold text-gray-800">
                        {file.name}
                      </h5>
                      <p className="mt-1 text-sm text-gray-600">
                        {Math.round(file.size / 1024)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleFileRemove(index)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {hasFiles && ( // Condicionalmente muestra el botón si hay archivos en adjuntoTarea
          <button
            onClick={handleUploadFiles}
            className="mt-6 bg-blue-700 text-white rounded-lg shadow-md px-4 py-2 hover:bg-blue-600 transition ease-in-out duration-150"
          >
            Subir Archivos
          </button>
        )}
      </div>
    </div>


    </div>
      </section>

     
    </div>
    
  );
};

export default Info_Tarea;

