import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Configura EmailJS con tu clave pública
emailjs.init('YOUR_PUBLIC_KEY');

const ContactForm = () => {
  // Obtén el nombre de usuario y el correo electrónico desde localStorage
  const storedUserName = localStorage.getItem('username') || ''; // Usa un valor por defecto si no está en localStorage
  const storedUserEmail = localStorage.getItem('email') || ''; // Usa un valor por defecto si no está en localStorage

  const [formData, setFormData] = useState({
    user_name: storedUserName, // Establece el valor inicial del nombre
    user_email: storedUserEmail, // Establece el valor inicial del correo electrónico
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Actualiza el estado si el nombre de usuario o el correo electrónico en localStorage cambian
    const storedUserName = localStorage.getItem('username') || '';
    const storedUserEmail = localStorage.getItem('email') || '';
    setFormData((prevFormData) => ({
      ...prevFormData,
      user_name: storedUserName,
      user_email: storedUserEmail,
    }));
  }, []); // Este efecto se ejecuta una sola vez cuando el componente se monta

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs.sendForm('service_6cu7xt8', 'template_1n6lis6', e.target, "8zQmgU71msUZb8iZ5")
      .then((response) => {
        console.log('SUCCESS!', response);
        toast.success('¡Correo enviado exitosamente!');
        setIsSuccess(true);
        setFormData({
          user_name: storedUserName, // Mantén el nombre del usuario al enviar
          user_email: storedUserEmail, // Mantén el correo electrónico al enviar
          message: '',
        });

        // Recarga la ventana después de 3 segundos
        setTimeout(() => {
          window.location.reload(); // Recarga la página actual
        }, 3000);
      })
      .catch((error) => {
        console.log('FAILED...', error);
        toast.error('Hubo un error al enviar el correo.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <form id="contact-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <input type="hidden" name="contact_number" value="697483" />
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="user_name">
            Nombre
          </label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            readOnly // Establece el campo como solo lectura
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="user_email">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="user_email"
            name="user_email"
            value={formData.user_email}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            readOnly // Establece el campo como solo lectura
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="message">
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white ${isSubmitting ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} transition`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
        
        {isSuccess && (
          <p className="text-green-600 mt-4">¡Correo enviado exitosamente!</p>
        )}
      </form>

      <ToastContainer />
    </div>
  );
};

export default ContactForm;
