import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    singularName: 'release';
    pluralName: 'releases';
    displayName: 'Release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    timezone: Attribute.String;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    singularName: 'release-action';
    pluralName: 'release-actions';
    displayName: 'Release Action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    contentType: Attribute.String & Attribute.Required;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    isEntryValid: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    Estado: Attribute.Boolean & Attribute.DefaultTo<true>;
    Estatus: Attribute.Boolean & Attribute.DefaultTo<true>;
    Id_comentarios: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::comentario.comentario'
    >;
    Id_auditoria_inicio_sesions: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::auditoria-inicio-sesion.auditoria-inicio-sesion'
    >;
    Id_respuestas: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::respuesta.respuesta'
    >;
    Id_comentario: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::comentario-t.comentario-t'
    >;
    Id_respuesta_ts: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::respuesta-t.respuesta-t'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 50;
        },
        number
      >;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAuditoriaInicioSesionAuditoriaInicioSesion
  extends Schema.CollectionType {
  collectionName: 'auditoria_inicio_sesions';
  info: {
    singularName: 'auditoria-inicio-sesion';
    pluralName: 'auditoria-inicio-sesions';
    displayName: 'Auditoria_Inicio_Sesion';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Fecha: Attribute.DateTime;
    Id_usuario: Attribute.Relation<
      'api::auditoria-inicio-sesion.auditoria-inicio-sesion',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    Accion: Attribute.Enumeration<['Inicio', 'Cierre']>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::auditoria-inicio-sesion.auditoria-inicio-sesion',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::auditoria-inicio-sesion.auditoria-inicio-sesion',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAuditoriaMenuRecursoAuditoriaMenuRecurso
  extends Schema.CollectionType {
  collectionName: 'auditoria_menu_recursos';
  info: {
    singularName: 'auditoria-menu-recurso';
    pluralName: 'auditoria-menu-recursos';
    displayName: 'Auditoria_Menu_Recurso';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Fecha: Attribute.DateTime;
    id_menu_recursos: Attribute.Relation<
      'api::auditoria-menu-recurso.auditoria-menu-recurso',
      'manyToMany',
      'api::menu-recurso.menu-recurso'
    >;
    Nombre_Recurso: Attribute.String;
    Accion: Attribute.Enumeration<
      ['Modificacion', 'Creacion', 'Reactivacion', 'Eliminacion']
    >;
    Usuario: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::auditoria-menu-recurso.auditoria-menu-recurso',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::auditoria-menu-recurso.auditoria-menu-recurso',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAuditoriaProyectoAuditoriaProyecto
  extends Schema.CollectionType {
  collectionName: 'auditoria_proyectos';
  info: {
    singularName: 'auditoria-proyecto';
    pluralName: 'auditoria-proyectos';
    displayName: 'Auditoria_Proyecto';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Fecha: Attribute.DateTime;
    id_proyectos: Attribute.Relation<
      'api::auditoria-proyecto.auditoria-proyecto',
      'manyToMany',
      'api::proyecto.proyecto'
    >;
    Nombre_Proyecto: Attribute.String;
    Accion: Attribute.Enumeration<['Modificacion', 'Creacion', 'Reactivacion']>;
    Usuario: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::auditoria-proyecto.auditoria-proyecto',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::auditoria-proyecto.auditoria-proyecto',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAuditoriaRecursoAuditoriaRecurso
  extends Schema.CollectionType {
  collectionName: 'auditoria_recursos';
  info: {
    singularName: 'auditoria-recurso';
    pluralName: 'auditoria-recursos';
    displayName: 'Auditoria_Recurso';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Fecha: Attribute.DateTime;
    id_recursos: Attribute.Relation<
      'api::auditoria-recurso.auditoria-recurso',
      'manyToMany',
      'api::recurso.recurso'
    >;
    Usuario: Attribute.String;
    Accion: Attribute.Enumeration<
      ['Modificacion', 'Creacion', 'Reativacion', 'Eliminacion']
    >;
    Nombre_Recurso: Attribute.String;
    Menu_recurso: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::auditoria-recurso.auditoria-recurso',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::auditoria-recurso.auditoria-recurso',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAudotiraTareaAudotiraTarea extends Schema.CollectionType {
  collectionName: 'audotira_tareas';
  info: {
    singularName: 'audotira-tarea';
    pluralName: 'audotira-tareas';
    displayName: 'Auditoria_Tarea';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Fecha: Attribute.DateTime;
    id_proyectos: Attribute.Relation<
      'api::audotira-tarea.audotira-tarea',
      'manyToMany',
      'api::proyecto.proyecto'
    >;
    Id_tareas: Attribute.Relation<
      'api::audotira-tarea.audotira-tarea',
      'manyToMany',
      'api::tarea.tarea'
    >;
    Nombre_Tarea: Attribute.String;
    Accion: Attribute.Enumeration<['Modificacion', 'Creacion', 'Reactivacion']>;
    Usuario: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::audotira-tarea.audotira-tarea',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::audotira-tarea.audotira-tarea',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiComentarioComentario extends Schema.CollectionType {
  collectionName: 'comentarios';
  info: {
    singularName: 'comentario';
    pluralName: 'comentarios';
    displayName: 'Comentario';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    comentario: Attribute.Text &
      Attribute.SetMinMaxLength<{
        minLength: 5;
        maxLength: 150;
      }> &
      Attribute.DefaultTo<'Ingrese Comentario....min 5 caracter'>;
    Id_usuario: Attribute.Relation<
      'api::comentario.comentario',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    Fecha: Attribute.DateTime;
    Id_proyecto: Attribute.Relation<
      'api::comentario.comentario',
      'manyToOne',
      'api::proyecto.proyecto'
    >;
    Id_respuesta: Attribute.Relation<
      'api::comentario.comentario',
      'oneToMany',
      'api::respuesta.respuesta'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::comentario.comentario',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::comentario.comentario',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiComentarioTComentarioT extends Schema.CollectionType {
  collectionName: 'comentario_ts';
  info: {
    singularName: 'comentario-t';
    pluralName: 'comentario-ts';
    displayName: 'ComentarioT';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    comentario: Attribute.String;
    Id_usuario: Attribute.Relation<
      'api::comentario-t.comentario-t',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    Fecha: Attribute.DateTime;
    Id_tarea: Attribute.Relation<
      'api::comentario-t.comentario-t',
      'manyToOne',
      'api::tarea.tarea'
    >;
    Id_respuesta_ts: Attribute.Relation<
      'api::comentario-t.comentario-t',
      'manyToMany',
      'api::respuesta-t.respuesta-t'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::comentario-t.comentario-t',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::comentario-t.comentario-t',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMenuRecursoMenuRecurso extends Schema.CollectionType {
  collectionName: 'menu_recursos';
  info: {
    singularName: 'menu-recurso';
    pluralName: 'menu-recursos';
    displayName: 'Menu_recurso';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Nombre: Attribute.String & Attribute.Required;
    Descripcion: Attribute.Text &
      Attribute.SetMinMaxLength<{
        minLength: 5;
        maxLength: 100;
      }>;
    Id_recursos: Attribute.Relation<
      'api::menu-recurso.menu-recurso',
      'oneToMany',
      'api::recurso.recurso'
    >;
    id_recurso_proyectos: Attribute.Relation<
      'api::menu-recurso.menu-recurso',
      'oneToMany',
      'api::recurso-proyecto.recurso-proyecto'
    >;
    Id_auditoria_menu_recursos: Attribute.Relation<
      'api::menu-recurso.menu-recurso',
      'manyToMany',
      'api::auditoria-menu-recurso.auditoria-menu-recurso'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::menu-recurso.menu-recurso',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::menu-recurso.menu-recurso',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProyectoProyecto extends Schema.CollectionType {
  collectionName: 'proyectos';
  info: {
    singularName: 'proyecto';
    pluralName: 'proyectos';
    displayName: 'Proyecto';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Nombre_Proyecto: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 5;
        maxLength: 100;
      }>;
    Descripcion: Attribute.Text &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 20;
        maxLength: 250;
      }>;
    Fecha_Inicio: Attribute.Date;
    Fecha_Fin: Attribute.Date;
    Estado_Proyecto: Attribute.Enumeration<
      [
        'Pendiente de Aprobaci\u00F3n',
        'En Progreso',
        'Completado',
        'Cancelado',
        'Suspendido'
      ]
    >;
    Departamento: Attribute.Enumeration<['Requerimiento', 'Proyecto']>;
    Objetivo_Proyecto: Attribute.Text &
      Attribute.SetMinMaxLength<{
        minLength: 20;
        maxLength: 250;
      }>;
    Prioridad: Attribute.Enumeration<['Baja', 'Media', 'Alta']>;
    Gerente_Proyecto: Attribute.Enumeration<['Jesus Garcia', 'Augusto Grado']>;
    Id_tareas: Attribute.Relation<
      'api::proyecto.proyecto',
      'oneToMany',
      'api::tarea.tarea'
    >;
    Presupuesto: Attribute.Float &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    Id_recursos: Attribute.Relation<
      'api::proyecto.proyecto',
      'oneToMany',
      'api::recurso-proyecto.recurso-proyecto'
    >;
    usuario_proyecto: Attribute.String;
    Id_comentario: Attribute.Relation<
      'api::proyecto.proyecto',
      'oneToMany',
      'api::comentario.comentario'
    >;
    SLA: Attribute.Integer;
    Id_auditoria_proyectos: Attribute.Relation<
      'api::proyecto.proyecto',
      'manyToMany',
      'api::auditoria-proyecto.auditoria-proyecto'
    >;
    Id_auditoria_tareas: Attribute.Relation<
      'api::proyecto.proyecto',
      'manyToMany',
      'api::audotira-tarea.audotira-tarea'
    >;
    Id_respuestas: Attribute.Relation<
      'api::proyecto.proyecto',
      'manyToMany',
      'api::respuesta.respuesta'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::proyecto.proyecto',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::proyecto.proyecto',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRecursoRecurso extends Schema.CollectionType {
  collectionName: 'recursos';
  info: {
    singularName: 'recurso';
    pluralName: 'recursos';
    displayName: 'Recurso';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Descripcion: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 5;
        maxLength: 150;
      }>;
    Id_menu_recurso: Attribute.Relation<
      'api::recurso.recurso',
      'manyToOne',
      'api::menu-recurso.menu-recurso'
    >;
    Estado: Attribute.Boolean & Attribute.DefaultTo<false>;
    Nombre: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 25;
      }>;
    recurso_proyecto: Attribute.Relation<
      'api::recurso.recurso',
      'manyToOne',
      'api::recurso-proyecto.recurso-proyecto'
    >;
    Id_auditoria_recursos: Attribute.Relation<
      'api::recurso.recurso',
      'manyToMany',
      'api::auditoria-recurso.auditoria-recurso'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::recurso.recurso',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::recurso.recurso',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRecursoProyectoRecursoProyecto
  extends Schema.CollectionType {
  collectionName: 'recurso_proyectos';
  info: {
    singularName: 'recurso-proyecto';
    pluralName: 'recurso-proyectos';
    displayName: 'Recurso_proyecto';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    id_proyecto: Attribute.Relation<
      'api::recurso-proyecto.recurso-proyecto',
      'manyToOne',
      'api::proyecto.proyecto'
    >;
    id_recursos: Attribute.Relation<
      'api::recurso-proyecto.recurso-proyecto',
      'oneToMany',
      'api::recurso.recurso'
    >;
    id_tipo: Attribute.Relation<
      'api::recurso-proyecto.recurso-proyecto',
      'manyToOne',
      'api::menu-recurso.menu-recurso'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::recurso-proyecto.recurso-proyecto',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::recurso-proyecto.recurso-proyecto',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRespuestaRespuesta extends Schema.CollectionType {
  collectionName: 'respuestas';
  info: {
    singularName: 'respuesta';
    pluralName: 'respuestas';
    displayName: 'Respuesta';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Id_usuarios: Attribute.Relation<
      'api::respuesta.respuesta',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    Respuesta: Attribute.Text;
    Fecha: Attribute.DateTime;
    Id_proyectos: Attribute.Relation<
      'api::respuesta.respuesta',
      'manyToMany',
      'api::proyecto.proyecto'
    >;
    id_comentario: Attribute.Relation<
      'api::respuesta.respuesta',
      'manyToOne',
      'api::comentario.comentario'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::respuesta.respuesta',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::respuesta.respuesta',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRespuestaTRespuestaT extends Schema.CollectionType {
  collectionName: 'respuesta_ts';
  info: {
    singularName: 'respuesta-t';
    pluralName: 'respuesta-ts';
    displayName: 'RespuestaT';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Fecha: Attribute.DateTime;
    Respuesta: Attribute.String;
    Id_usuario: Attribute.Relation<
      'api::respuesta-t.respuesta-t',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    Id_tarea: Attribute.Relation<
      'api::respuesta-t.respuesta-t',
      'manyToOne',
      'api::tarea.tarea'
    >;
    Id_comentarios: Attribute.Relation<
      'api::respuesta-t.respuesta-t',
      'manyToMany',
      'api::comentario-t.comentario-t'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::respuesta-t.respuesta-t',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::respuesta-t.respuesta-t',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTareaTarea extends Schema.CollectionType {
  collectionName: 'tareas';
  info: {
    singularName: 'tarea';
    pluralName: 'tareas';
    displayName: 'Tarea';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Nombre: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 5;
        maxLength: 50;
      }>;
    Descripcion: Attribute.Text &
      Attribute.SetMinMaxLength<{
        minLength: 5;
        maxLength: 250;
      }>;
    Fecha_Inicio: Attribute.Date;
    Fecha_Fin: Attribute.Date;
    Estado: Attribute.Enumeration<
      ['Ejecucion', 'Cancelado', 'Finalizado', 'Pendiente', 'Suspendido']
    >;
    Prioridad: Attribute.Enumeration<['Baja', 'Media', 'Alta']>;
    Hitos: Attribute.Boolean & Attribute.DefaultTo<false>;
    Adjunto: Attribute.Media<'images' | 'files', true>;
    Id_proyecto: Attribute.Relation<
      'api::tarea.tarea',
      'manyToOne',
      'api::proyecto.proyecto'
    >;
    SLA: Attribute.Integer;
    Id_auditoria_tareas: Attribute.Relation<
      'api::tarea.tarea',
      'manyToMany',
      'api::audotira-tarea.audotira-tarea'
    >;
    Id_comentario: Attribute.Relation<
      'api::tarea.tarea',
      'oneToMany',
      'api::comentario-t.comentario-t'
    >;
    Id_respuesta_ts: Attribute.Relation<
      'api::tarea.tarea',
      'oneToMany',
      'api::respuesta-t.respuesta-t'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tarea.tarea',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tarea.tarea',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'plugin::i18n.locale': PluginI18NLocale;
      'api::auditoria-inicio-sesion.auditoria-inicio-sesion': ApiAuditoriaInicioSesionAuditoriaInicioSesion;
      'api::auditoria-menu-recurso.auditoria-menu-recurso': ApiAuditoriaMenuRecursoAuditoriaMenuRecurso;
      'api::auditoria-proyecto.auditoria-proyecto': ApiAuditoriaProyectoAuditoriaProyecto;
      'api::auditoria-recurso.auditoria-recurso': ApiAuditoriaRecursoAuditoriaRecurso;
      'api::audotira-tarea.audotira-tarea': ApiAudotiraTareaAudotiraTarea;
      'api::comentario.comentario': ApiComentarioComentario;
      'api::comentario-t.comentario-t': ApiComentarioTComentarioT;
      'api::menu-recurso.menu-recurso': ApiMenuRecursoMenuRecurso;
      'api::proyecto.proyecto': ApiProyectoProyecto;
      'api::recurso.recurso': ApiRecursoRecurso;
      'api::recurso-proyecto.recurso-proyecto': ApiRecursoProyectoRecursoProyecto;
      'api::respuesta.respuesta': ApiRespuestaRespuesta;
      'api::respuesta-t.respuesta-t': ApiRespuestaTRespuestaT;
      'api::tarea.tarea': ApiTareaTarea;
    }
  }
}
