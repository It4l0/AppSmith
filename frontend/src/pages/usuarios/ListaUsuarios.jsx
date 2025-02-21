import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  Snackbar,
  Alert,
  TablePagination,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import userService from '../../services/userService';

const colunas = [
  { id: 'nome', label: 'Nome', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 170 },
  { id: 'cpf', label: 'CPF', minWidth: 130 },
  { id: 'departamento', label: 'Departamento', minWidth: 130 },
  { id: 'cargo', label: 'Cargo', minWidth: 100 },
  {
    id: 'isAdmin',
    label: 'Tipo',
    minWidth: 100,
    format: (value) => (
      <Chip 
        label={value ? 'Administrador' : 'Usuário'} 
        color={value ? 'primary' : 'default'}
        size="small"
      />
    )
  },
  {
    id: 'ativo',
    label: 'Status',
    minWidth: 100,
    format: (value) => (
      <Chip 
        label={value ? 'Ativo' : 'Inativo'} 
        color={value ? 'success' : 'error'}
        size="small"
      />
    )
  },
  { id: 'acoes', label: 'Ações', minWidth: 100 }
];

function ListaUsuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await userService.listarUsuarios();
      console.log('Dados dos usuários:', response); // Debug
      setUsuarios(response);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar usuários',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNovoUsuario = () => {
    navigate('/usuarios/novo');
  };

  const handleEditarUsuario = (id) => {
    navigate(`/usuarios/${id}/editar`);
  };

  const handleDeletarUsuario = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await userService.excluirUsuario(id);
        setSnackbar({
          open: true,
          message: 'Usuário excluído com sucesso',
          severity: 'success'
        });
        fetchUsuarios();
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Erro ao excluir usuário',
          severity: 'error'
        });
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filtrarUsuarios = () => {
    return usuarios.filter(usuario =>
      Object.values(usuario)
        .join(' ')
        .toLowerCase()
        .includes(busca.toLowerCase())
    );
  };

  const usuariosFiltrados = filtrarUsuarios();

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Usuários
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleNovoUsuario}
        >
          Novo Usuário
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar usuários..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Box>

        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {colunas.map((coluna) => (
                  <TableCell
                    key={coluna.id}
                    style={{ minWidth: coluna.minWidth, fontWeight: 'bold' }}
                  >
                    {coluna.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={colunas.length} align="center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : usuariosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={colunas.length} align="center">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                usuariosFiltrados
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((usuario) => (
                    <TableRow hover key={usuario.id}>
                      {colunas.map((coluna) => {
                        if (coluna.id === 'acoes') {
                          return (
                            <TableCell key={coluna.id}>
                              <Tooltip title="Editar">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditarUsuario(usuario.id)}
                                  sx={{ mr: 1 }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Excluir">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeletarUsuario(usuario.id)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          );
                        }
                        const value = usuario[coluna.id];
                        return (
                          <TableCell key={coluna.id}>
                            {coluna.format ? coluna.format(value) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={usuariosFiltrados.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ListaUsuarios;
