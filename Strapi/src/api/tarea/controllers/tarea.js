'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::tarea.tarea', ({ strapi }) => ({
  async create(ctx) {
    try {
      // Extraer los datos y archivos de la solicitud
      const { files, body } = ctx.request;

      console.log('Files:', files);
      console.log('Body Data:', body);

      if (!body || !body.data) {
        return ctx.badRequest('No se encontraron datos en la solicitud.');
      }

      // Procesar archivos si existen
      let fileIds = [];
      if (files && files['files.files']) {
        console.log('Files Files:', files['files.files']);

        // Asegúrate de que los archivos se envíen en un formato correcto
        const uploadedFiles = await strapi.plugins.upload.services.upload.upload({ data: {}, files: files['files.files'] });
        fileIds = uploadedFiles.map(file => file.id);
      }

      // Combinar los archivos con el cuerpo de la solicitud
      const taskData = { ...body.data, Adjunto: fileIds.length > 0 ? fileIds : [] };

      console.log('Data to be created:', taskData); // Imprime los datos a crear

      // Crear la tarea
      const createdTask = await strapi.db.query('api::tarea.tarea').create({
        data: taskData
      });

      console.log('Tarea creada:', createdTask); // Imprime la tarea creada

      return ctx.send(createdTask);
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      return ctx.badRequest('Error al crear la tarea', { more: error });
    }
  },

  async update(ctx) {
    try {
      const { files, body } = ctx.request;

      console.log('Files:', files);
      console.log('Body Data:', body);

      const { id } = ctx.params;

      if (!id || isNaN(parseInt(id, 10))) {
        return ctx.badRequest('ID de tarea no es válido.');
      }

      if (!body || !body.data) {
        return ctx.badRequest('No se encontraron datos en la solicitud.');
      }

      // Obtener la tarea actual para combinar con los nuevos adjuntos
      const currentTask = await strapi.db.query('api::tarea.tarea').findOne({
        where: { id: parseInt(id, 10) },
        populate: ['Adjunto']
      });

      if (!currentTask) {
        return ctx.notFound('Tarea no encontrada.');
      }

      // Procesar archivos si existen
      let newFileIds = [];
      if (files && files['files.files']) {
        console.log('Files Files:', files['files.files']);

        // Asegúrate de que los archivos se envíen en un formato correcto
        const uploadedFiles = await strapi.plugins.upload.services.upload.upload({ data: {}, files: files['files.files'] });
        newFileIds = uploadedFiles.map(file => file.id);
      }

      // Obtener los IDs de los adjuntos actuales
      const existingFileIds = currentTask.Adjunto ? currentTask.Adjunto.map(file => file.id) : [];

      // Combinar los IDs existentes con los nuevos
      const allFileIds = [...new Set([...existingFileIds, ...newFileIds])]; // Evitar duplicados

      const taskData = { ...body.data, Adjunto: allFileIds.length > 0 ? allFileIds : [] };

      console.log('Data to be updated:', taskData); // Imprime los datos a actualizar

      // Actualizar la tarea
      const updatedTask = await strapi.db.query('api::tarea.tarea').update({
        where: { id: parseInt(id, 10) },
        data: taskData
      });

      console.log('Tarea actualizada:', updatedTask); // Imprime la tarea actualizada

      return ctx.send(updatedTask);
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      return ctx.badRequest('Error al actualizar la tarea', { more: error });
    }
  }
}));
