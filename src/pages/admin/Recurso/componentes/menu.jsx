import React, { useState, useEffect } from 'react';
import { IoIosAddCircle, IoIosClose } from 'react-icons/io';
import Swal from 'sweetalert2';

const Menu = () => {
  const [recursos, setRecursos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoRecurso, setNuevoRecurso] = useState({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    fetchRecursos();
  }, []);

  const fetchRecursos = () => {
    fetch('http://localhost:1337/api/menu-recursos')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Verifica los datos recibidos en la consola
        if (Array.isArray(data.data)) {
          setRecursos(data.data); // Actualiza el estado de recursos con los datos recibidos
        }
      })
      .catch(error => console.error('Error al obtener recursos:', error));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNuevoRecurso(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const data = {
      data: {
        Nombre: nuevoRecurso.nombre,
        Descripcion: nuevoRecurso.descripcion
      }
    };
  
    fetch('http://localhost:1337/api/menu-recursos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Nuevo recurso creado:', data);
      // Actualiza la lista de recursos mostrados después de crear uno nuevo
      fetchRecursos();
      // Oculta el formulario después de enviar los datos
      setMostrarFormulario(false);
      // Limpia el formulario
      setNuevoRecurso({ nombre: '', descripcion: '' });

      // Mostrar SweetAlert de éxito
      Swal.fire({
        icon: 'success',
        title: 'Recurso creado correctamente',
        showConfirmButton: false,
        timer: 1500
      });
    })
    .catch(error => {
      console.error('Error al crear nuevo recurso:', error);
      // Mostrar SweetAlert de error
      Swal.fire({
        icon: 'error',
        title: 'Error al crear recurso',
        text: 'Hubo un problema al intentar crear el recurso. Por favor, inténtalo de nuevo.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido'
      });
    });
  };

  const eliminarRecurso = (id, event) => {
    event.stopPropagation(); // Evita la propagación del evento

    Swal.fire({
      title: '¿Estás seguro que quieres eliminar el recurso?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Realizar la eliminación
        fetch(`http://localhost:1337/api/menu-recursos/${id}`, {
          method: 'DELETE'
        })
        .then(response => {
          if (response.ok) {
            // Actualizar la lista de recursos mostrados después de eliminar uno
            fetchRecursos();
            // Mostrar SweetAlert de éxito
            Swal.fire(
              'Eliminado',
              'El recurso ha sido eliminado correctamente',
              'success'
            );
          } else {
            throw new Error('Error al eliminar recurso');
          }
        })
        .catch(error => {
          console.error('Error al eliminar recurso:', error);
          // Mostrar SweetAlert de error
          Swal.fire(
            'Error',
            'Hubo un problema al intentar eliminar el recurso. Por favor, inténtalo de nuevo.',
            'error'
          );
        });
      }
    });
  };

  const redirectToRecursoDatos = (id, nombre) => {
    // Redireccionar a la página Recurso_datos con el ID y nombre del recurso como parámetros
    window.location.href = `/Recurso_datos?idrecurso=${id}&recurso=${nombre}`;
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 p-7 bg-blue-700 rounded-md">
        {recursos.map(recurso => (
          <div
            key={recurso.id}
            className="backdrop-blur-sm bg-white p-6 rounded-md shadow-sm cursor-pointer border-2 border-blue-800 hover:border-green-500 hover:border-2 transition-colors duration-300 relative"
            onClick={() => redirectToRecursoDatos(recurso.id, recurso.attributes.Nombre)}
          >
            <div className="flex justify-end absolute top-2 right-2">
              <button
                onClick={(event) => eliminarRecurso(recurso.id, event)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                <IoIosClose className="text-3xl" />
              </button>
            </div>
            <h2 className="text-4xl font-semibold mb-4">{recurso.attributes.Nombre}</h2>
            <p className="text-gray-800 text-xl">{recurso.attributes.Descripcion}</p>
            {/* Aquí puedes agregar más contenido según los campos disponibles en tu API */}
            <div className="col-start-2 row-start-1 row-end-3 sm:mt-4 lg:mt-4 xl:mt-4">
              <dd className="flex justify-end sm:justify-start lg:justify-end xl:justify-start -space-x-1.5"></dd>
            </div>
          </div>
        ))}

        {mostrarFormulario && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-md shadow-md w-full max-w-3xl">
              <div className="flex justify-end">
                <button
                  onClick={() => setMostrarFormulario(false)}
                  className="text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  <IoIosClose className="text-4xl" />
                </button>
              </div>
              <div className='bg-blue-800 w-72 pt-2 pb-2 mb-3 rounded-md'>
              <h2 className="text-2xl font-semibold ml-3  text-white">Crear un nuevo recurso</h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="nombre" className="block text-gray-700 font-bold mb-2">Nombre:</label>
                  <input 
                    type="text" 
                    id="nombre" 
                    name="nombre" 
                    value={nuevoRecurso.nombre} 
                    onChange={handleInputChange} 
                    placeholder="Ingrese nombre del proyecto" 
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500" 
                    required 
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="descripcion" className="block text-gray-700 font-bold mb-2">Descripción:</label>
                  <textarea 
                    id="descripcion" 
                    name="descripcion" 
                    value={nuevoRecurso.descripcion} 
                    onChange={handleInputChange} 
                    placeholder="Ingrese descripción del proyecto (min. 5 caracteres, max. 100 caracteres)" 
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 h-40 resize-none" 
                    minLength={5} 
                    maxLength={100} 
                    required 
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div
          className="backdrop-blur-sm bg-white p-6 rounded-md shadow-sm cursor-pointer border-2 border-blue-800 hover:border-green-500 hover:border-2 transition-colors duration-300 flex items-center"
          onClick={() => setMostrarFormulario(true)}
        >
          <IoIosAddCircle className="text-5xl text-green-500 mr-4" />
          <div>
            <h2 className="text-4xl font-semibold mb-4">Crear un nuevo recurso</h2>
            <p className="text-gray-800 text-xl">Haz clic aquí para crear un nuevo recurso.</p>
            {/* Aquí puedes agregar más contenido según sea necesario */}
            <div className="col-start-2 row-start-1 row-end-3 sm:mt-4 lg:mt-4 xl:mt-4">
              <dd className="flex justify-end sm:justify-start lg:justify-end xl:justify-start -space-x-1.5"></dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
