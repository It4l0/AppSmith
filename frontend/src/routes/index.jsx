import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import DashboardUsuarios from '../pages/usuarios/DashboardUsuarios';
import CadastroUsuario from '../pages/usuarios/CadastroUsuario';
import ListaSistemas from '../pages/sistemas/ListaSistemas';
import CadastroSistema from '../pages/sistemas/CadastroSistema';
import Loading from '../components/Loading/Loading';

// Componente para proteger rotas
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="/usuarios" element={<DashboardUsuarios />} />
          <Route path="/usuarios/novo" element={<CadastroUsuario />} />
          <Route path="/usuarios/:id/editar" element={<CadastroUsuario />} />
          <Route path="/sistemas" element={<ListaSistemas />} />
          <Route path="/sistemas/novo" element={<CadastroSistema />} />
          <Route path="/sistemas/:id/editar" element={<CadastroSistema />} />
        </Route>

        {/* Redireciona qualquer rota não encontrada para a página inicial */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
