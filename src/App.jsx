import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Login from './pages/login'
import Dash from './pages/dash'
import Ms_Proyect from './pages/proyecto/Ms_Proyect'
import Crear_Proyect from './pages/proyecto/Crear_Proyect'
import Menu_tarea from './pages/tarea/menu_tarea'
import Crear_tarea from './pages/tarea/Crear_tarea'
import Recurso from './pages/recurso/recurso'
import Tabla_Recurso from './pages/recurso/tabla_recurso'
import Dash_Admin from './pages/admin/dash_admin'
import Admin_Proyecto from './pages/admin/Proyecto/Proyecto' 
import Admin_Usuario from './pages/admin/Usuario/Usuario'
import Admin_Tarea from './pages/admin/Tareas/Tareas'
import Admin_Recurso from './pages/admin/Recurso/Recurso'
import Recurso_datos from './pages/admin/Recurso/Recurso_datos'
import Auditoria from './pages/admin/Auditoria/Auditoria'
import Auditoria_proyect from './pages/admin/Auditoria/Auditoria_Proyecto/Auditoria_proyect'
import Auditoria_tarea from './pages/admin/Auditoria/Auditoria_Tarea/Auditoria_tarea'
import Auditoria_recurso from './pages/admin/Auditoria/Audiitoria_Recurso/Auditoria_recurso'
import Auditoria_inicio from './pages/admin/Auditoria/Auditoria_Inicio/Auditoria_inicio'
import Info_Proyect from './pages/proyecto/Info_Proyect'
import All_proyect from './pages/proyecto/All_proyect'
import Mi_tarea from './pages/tarea/mi_tarea'
import Info_tarea from './pages/tarea/informacion'
import Info from './pages/tarea/informa'
import Crear_tarea2 from './pages/tarea/Crear_tarea2'
import Calendar from './pages/calendar/Calendario'
import Menu_calendar from './pages/calendar/Menu_Calendario'
import Informe_Tarea from './pages/Informes/Informe_Tarea/Informe'


const App = () => {
  return (
    <div>
      <Routes>
         <Route path="/" element={<Login />}/>
         <Route path="dash" element={<Dash />}/>
         <Route path="ms_proyect" element={<Ms_Proyect />}/>
         <Route path="All_proyect" element={<All_proyect/>}/>
         <Route path="Info_Proyect" element={<Info_Proyect/>}/>
         <Route path="ms_proyect/crear_Proyect" element={<Crear_Proyect />}/>
         <Route path="menu_tarea" element={<Menu_tarea />}/>
         <Route path="Mi_tarea" element={<Mi_tarea />}/>
         <Route path="Info_tarea" element={<Info_tarea/>}/>
         <Route path="Info" element={<Info/>}/>
         <Route path="menu_tarea/crear_tarea" element={<Crear_tarea />}/>
         <Route path="Crear_tarea2" element={<Crear_tarea2/>}/>
         <Route path="recurso" element={<Recurso/>}/>
         <Route path="tabla_recurso" element={<Tabla_Recurso/>}/>
         <Route path="Admin_Dash" element={<Dash_Admin/>}/>
         <Route path="Admin_Usuario" element={<Admin_Usuario/>}/>
         <Route path="Admin_Proyecto" element={<Admin_Proyecto/>}/>
         <Route path="Admin_Tarea" element={<Admin_Tarea/>}/>
         <Route path="Admin_Recurso" element={<Admin_Recurso/>}/>
         <Route path="Recurso_datos" element={<Recurso_datos/>}/>
         <Route path="Auditoria" element={<Auditoria/>}/>
         <Route path="Auditoria_proyect" element={<Auditoria_proyect/>}/>
         <Route path="Auditoria_tarea" element={<Auditoria_tarea/>}/>
         <Route path="Auditoria_recurso" element={<Auditoria_recurso/>}/>
         <Route path="Auditoria_inicio" element={<Auditoria_inicio/>}/>
         <Route path="Menu_calendar" element={<Menu_calendar/>}/>
         <Route path="Calendar" element={<Calendar/>}/>
         <Route path="Informe_Tarea" element={<Informe_Tarea/>}/>
      </Routes>
    </div>
  );
};

export default App;