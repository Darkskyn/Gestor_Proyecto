'use strict';

/**
 * dependencia service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::dependencia.dependencia');
