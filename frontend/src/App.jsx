import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

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
    <AuthProvider>
      <ThemeProvider>
        <CssBaseline />
        <Router>
          <Routes>                   
            <Route path="/" element={<Layout />}> (MUDAR PARA LOGIN)
            <Route index element={<Login />} /> (mudar para login)
            <Route path="dashboard" element={<Dashboard />} />
              <Route path="sistemas" element={<ListaSistemas />} />
              <Route path="sistemas/novo" element={<CadastroSistema />} />
              <Route path="sistemas/editar/:id" element={<CadastroSistema />} />
              <Route path="usuarios" element={<DashboardUsuarios />} />
              <Route path="usuarios/novo" element={<CadastroUsuario />} />
              <Route path="usuarios/editar/:id" element={<CadastroUsuario />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="*" element={<Login />} />           
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
