import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const Tabla = ({ nombre_proyecto, idproyect }) => {
  const [recursos, setRecursos] = useState([]);

  useEffect(() => {
    const fetchRecursos = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:1337/api/recurso-proyectos?populate=id_proyecto,id_recursos,id_tipo`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);

        // Filtrar los datos para obtener solo el proyecto que coincide con idproyecto
        const proyectoFiltrado = data.data.find(item => item.attributes.id_proyecto.data.id === idproyect);
        
        if (proyectoFiltrado) {
          const recursosData = [{
            id: proyectoFiltrado.id,
            idRecursos: proyectoFiltrado.attributes.id_recursos.data[0].id, // Suponiendo un solo recurso asociado
            Nombre: (proyectoFiltrado.attributes?.id_recursos?.data[0]?.attributes?.Nombre) || 'N/A',
            Descripcion: (proyectoFiltrado.attributes?.id_recursos?.data[0]?.attributes?.Descripcion) || 'N/A',
            Tipo: (proyectoFiltrado.attributes?.id_tipo?.data?.attributes?.Nombre) || 'N/A',
            Proyecto: (proyectoFiltrado.attributes?.id_proyecto?.data?.attributes?.Nombre_Proyecto) || 'N/A',
            Estado: (proyectoFiltrado.attributes?.id_recursos?.data[0]?.attributes?.Estado) || false
          }];

          setRecursos(recursosData);
        } else {
          // Mostrar mensaje de proyecto no encontrado
          console.log('Proyecto no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener recursos:', error);
      }
    };

    fetchRecursos();
  }, [idproyect]);

  const handleDelete = async (id, idRecursos) => {
    console.log('Deleting resource with ID:', id);
    const confirmDelete = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    });

    if (confirmDelete.isConfirmed) {
      try {
        const token = localStorage.getItem('authToken');
        // Realiza la solicitud DELETE al backend para eliminar el recurso-proyecto
        const responseDelete = await fetch(`http://localhost:1337/api/recurso-proyectos/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (responseDelete.ok) {
          // Realiza la solicitud PUT al backend de Strapi para actualizar el estado del recurso específico por id_recursos
          const responseUpdate = await fetch(`http://localhost:1337/api/recursos/${idRecursos}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              data: {
                Estado: false // Actualiza el estado a false
              }
            })
          });

          if (responseUpdate.ok) {
            // Recargar la página después de eliminar y actualizar
            window.location.reload();
            Swal.fire('¡Eliminado!', 'El recurso ha sido eliminado y actualizado.', 'success');
          } else {
            const errorResponse = await responseUpdate.json();
            console.error('Error al actualizar el recurso:', errorResponse);
            Swal.fire('Error', 'Hubo un error al actualizar el recurso.', 'error');
          }
        } else {
          console.error('Error al eliminar el recurso:', responseDelete.statusText);
          Swal.fire('Error', 'Hubo un error al eliminar el recurso.', 'error');
        }
      } catch (error) {
        console.error('Error al eliminar el recurso:', error);
        Swal.fire('Error', 'Hubo un error al eliminar el recurso.', 'error');
      }
    }
  };

  return (
    <div>
      <section className="mt-10 bg-white px-4 py-8 text-black antialiased">
        <div className="container mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-800">
              <thead className="bg-blue-700 text-white text-sm font-semibold uppercase">
                <tr>
                  <th className="p-4">
                    <div className="text-left font-semibold">Nombre Recurso</div>
                  </th>
                  <th className="p-4">
                    <div className="text-left font-semibold">Descripción</div>
                  </th>
                  <th className="p-4">
                    <div className="text-left font-semibold">Tipo</div>
                  </th>
                  <th className="p-4">
                    <div className="text-center font-semibold">Proyecto</div>
                  </th>
                  <th className="p-4">
                    <div className="text-center font-semibold">Estado</div>
                  </th>
                  <th className="p-4">
                    <div className="text-center font-semibold">Acción</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-sm">
                {recursos.map(recurso => (
                  <tr key={recurso.id}>
                    <td className="p-4">
                      <div className="font-medium">{recurso.Nombre}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-left">{recurso.Descripcion}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-left">{recurso.Tipo}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-center">{recurso.Proyecto}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-center">{recurso.Estado ? 'Activo' : 'Inactivo'}</div>
                    </td>
                    <td className="p-4 flex justify-center space-x-4">
                      <svg
                        onClick={() => handleDelete(recurso.id, recurso.idRecursos)}
                        className="h-8 w-8 rounded-full p-1 hover:bg-gray-900 hover:text-white cursor-pointer"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Tabla;
