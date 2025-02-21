import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import sistemaService from '../../services/sistemaService';

const ListaSistemas = () => {
  const navigate = useNavigate();
  const [sistemas, setSistemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [sistemaToDelete, setSistemaToDelete] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Carregar sistemas
  const carregarSistemas = async (retry = false) => {
    try {
      setLoading(true);
      console.log('[SISTEMAS] Iniciando carregamento de sistemas...');
      const data = await sistemaService.listarSistemas();
      console.log('[SISTEMAS] Sistemas carregados:', data);
      setSistemas(data || []);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      console.error('[SISTEMAS] Erro detalhado ao carregar sistemas:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack
      });
      
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         err.message || 
                         'Erro ao carregar sistemas. Por favor, tente novamente.';
      setError(errorMessage);
      
      if (retry && retryCount < maxRetries) {
        const delay = 2000 * (retryCount + 1);
        console.log(`[SISTEMAS] Tentando novamente em ${delay}ms... (Tentativa ${retryCount + 1} de ${maxRetries})`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => carregarSistemas(true), delay);
      } else if (retryCount >= maxRetries) {
        console.log('[SISTEMAS] Número máximo de tentativas atingido');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarSistemas(true);
  }, []);

  // Função para tentar novamente manualmente
  const handleRetry = () => {
    setRetryCount(0);
    carregarSistemas(true);
  };

  // Navegar para página de cadastro
  const handleAdd = () => {
    navigate('/sistemas/novo');
  };

  // Navegar para página de edição
  const handleEdit = (id) => {
    navigate(`/sistemas/editar/${id}`);
  };

  // Abrir diálogo de confirmação de exclusão
  const handleDeleteClick = (sistema) => {
    setSistemaToDelete(sistema);
    setDeleteDialog(true);
  };

  // Confirmar exclusão
  const handleDeleteConfirm = async () => {
    try {
      await sistemaService.excluirSistema(sistemaToDelete.id);
      await carregarSistemas();
      setDeleteDialog(false);
      setSistemaToDelete(null);
    } catch (err) {
      console.error('Erro ao excluir sistema:', err);
      setError('Erro ao excluir sistema');
    }
  };

  // Função para retornar a cor do chip de status
  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo':
        return 'success';
      case 'inativo':
        return 'error';
      case 'manutencao':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        {retryCount > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            Tentativa {retryCount} de {maxRetries}...
          </Typography>
        )}
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Tentar Novamente
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Typography component="h2" variant="h6" color="primary">
            Sistemas
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Novo Sistema
          </Button>
        </div>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Versão</TableCell>
                <TableCell>Responsável</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sistemas.map((sistema) => (
                <TableRow key={sistema.id}>
                  <TableCell>{sistema.nome}</TableCell>
                  <TableCell>{sistema.url}</TableCell>
                  <TableCell>
                    <Chip
                      label={sistema.status}
                      color={getStatusColor(sistema.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{sistema.versao}</TableCell>
                  <TableCell>{sistema.responsavel}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(sistema.id)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(sistema)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Diálogo de confirmação de exclusão */}
        <Dialog
          open={deleteDialog}
          onClose={() => setDeleteDialog(false)}
        >
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir o sistema "{sistemaToDelete?.nome}"?
              Esta ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>Cancelar</Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default ListaSistemas;
