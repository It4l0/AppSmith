import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from './contexts/ThemeContext';

// Layouts
import Layout from './layouts/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import ListaSistemas from './pages/sistemas/ListaSistemas';
import CadastroSistema from './pages/sistemas/CadastroSistema';
import DashboardUsuarios from './pages/usuarios/DashboardUsuarios';
import CadastroUsuario from './pages/usuarios/CadastroUsuario';
import Configuracoes from './pages/Configuracoes';
import Login from './pages/Login/Login';




function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Routes>                   
          <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="login" element={<Login />} />
            <Route path="sistemas" element={<ListaSistemas />} />
            <Route path="sistemas/novo" element={<CadastroSistema />} />
            <Route path="sistemas/editar/:id" element={<CadastroSistema />} />
            <Route path="usuarios" element={<DashboardUsuarios />} />
            <Route path="usuarios/novo" element={<CadastroUsuario />} />
            <Route path="usuarios/editar/:id" element={<CadastroUsuario />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="*" element={<Dashboard />} />           
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
