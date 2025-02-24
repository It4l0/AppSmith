import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Card,
  CardContent,
  IconButton,
  Chip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

import {
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const DashboardUsuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    usuariosAtivos: 0
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const data = await userService.listarUsuarios();
      
      if (Array.isArray(data)) {
        setUsuarios(data);
        
        // Calcula estatísticas
        setStats({
          totalUsuarios: data.length,
          usuariosAtivos: data.filter(u => u.status === 'ativo').length
        });
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Erro ao carregar usuários',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await userService.excluirUsuario(id);
        setSnackbar({
          open: true,
          message: 'Usuário excluído com sucesso',
          severity: 'success'
        });
        loadUsuarios();
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        setSnackbar({
          open: true,
          message: error.message || 'Erro ao excluir usuário',
          severity: 'error'
        });
      }
    }
  };

  const handleAdd = () => {
    navigate('/usuarios/novo');
  };

  const handleEdit = (id) => {
    navigate(`/usuarios/editar/${id}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Estatísticas */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Usuários
              </Typography>
              <Typography variant="h5" component="div">
                {stats.totalUsuarios}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Usuários Ativos
              </Typography>
              <Typography variant="h5" component="div">
                {stats.usuariosAtivos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Lista de Usuários */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" component="div">
                Usuários
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAdd}
              >
                Novo Usuário
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>                    
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={usuario.status}
                          color={usuario.status === 'ativo' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(usuario.id)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(usuario.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DashboardUsuarios;
