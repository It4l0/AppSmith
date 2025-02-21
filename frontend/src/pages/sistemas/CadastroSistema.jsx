import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import sistemaService from '../../services/sistemaService';

const CadastroSistema = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [sistemaOriginal, setSistemaOriginal] = useState(null);
  const [successModal, setSuccessModal] = useState({
    open: false,
    alteracoes: [],
    salvando: false
  });
  
  const [sistema, setSistema] = useState({
    nome: '',
    descricao: '',
    url: '',
    status: 'ativo',
    versao: '',
    responsavel: '',
    observacoes: ''
  });

  useEffect(() => {
    if (id) {
      carregarSistema();
    }
  }, [id]);

  const carregarSistema = async () => {
    try {
      setLoading(true);
      console.log('[SISTEMAS] Carregando sistema:', id);
      const data = await sistemaService.buscarSistemaPorId(id);
      console.log('[SISTEMAS] Sistema carregado:', data);
      setSistema(data);
      setSistemaOriginal(data);
      setError(null);
    } catch (err) {
      console.error('[SISTEMAS] Erro ao carregar sistema:', err);
      setError('Erro ao carregar dados do sistema');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSistema(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const compararAlteracoes = () => {
    if (!sistemaOriginal) return [];

    const alteracoes = [];
    const campos = {
      nome: 'Nome',
      descricao: 'Descrição',
      url: 'URL',
      status: 'Status',
      versao: 'Versão',
      responsavel: 'Responsável',
      observacoes: 'Observações'
    };

    Object.entries(campos).forEach(([key, label]) => {
      const valorOriginal = String(sistemaOriginal[key] || '');
      const valorNovo = String(sistema[key] || '');

      if (valorOriginal !== valorNovo) {
        alteracoes.push({
          campo: label,
          de: valorOriginal,
          para: valorNovo
        });
      }
    });

    return alteracoes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Se for um novo sistema, não precisa verificar alterações
    if (!id) {
      setSuccessModal({
        open: true,
        alteracoes: [{ campo: 'Novo Sistema', de: '', para: sistema.nome }],
        salvando: false
      });
      return;
    }

    // Se for edição, verifica as alterações
    const alteracoes = compararAlteracoes();
    if (alteracoes.length === 0) {
      setError('Nenhuma alteração foi realizada');
      return;
    }

    setSuccessModal({
      open: true,
      alteracoes,
      salvando: false
    });
  };

  const handleConfirmarAlteracoes = async () => {
    try {
      setSuccessModal(prev => ({
        ...prev,
        salvando: true
      }));

      if (id) {
        await sistemaService.atualizarSistema(id, sistema);
      } else {
        await sistemaService.criarSistema(sistema);
      }

      setSuccess(true);
      setSuccessModal(prev => ({
        ...prev,
        salvando: false
      }));

      setTimeout(() => {
        navigate('/sistemas');
      }, 2000);
    } catch (err) {
      console.error('Erro ao salvar sistema:', err);
      if (err.response?.data?.message) {
        setError(Array.isArray(err.response.data.message) 
          ? err.response.data.message.join(', ') 
          : err.response.data.message);
      } else {
        setError('Erro ao salvar sistema');
      }
      setSuccessModal(prev => ({
        ...prev,
        open: false
      }));
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'ativo':
        return 'success';
      case 'inativo':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading && id) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          {id ? 'Editar Sistema' : 'Novo Sistema'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Sistema {id ? 'atualizado' : 'criado'} com sucesso!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Nome do Sistema"
                name="nome"
                value={sistema.nome}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="descricao"
                value={sistema.descricao}
                onChange={handleChange}
                multiline
                rows={3}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL"
                name="url"
                value={sistema.url}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={sistema.status}
                  onChange={handleChange}
                  label="Status"
                  disabled={loading}
                >
                  <MenuItem value="ativo">Ativo</MenuItem>
                  <MenuItem value="inativo">Inativo</MenuItem>
                  <MenuItem value="manutencao">Em Manutenção</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Versão"
                name="versao"
                value={sistema.versao}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Responsável"
                name="responsavel"
                value={sistema.responsavel}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                name="observacoes"
                value={sistema.observacoes}
                onChange={handleChange}
                multiline
                rows={3}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/sistemas')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : (id ? 'Atualizar' : 'Criar')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Dialog
        open={successModal.open}
        onClose={() => setSuccessModal(prev => ({ ...prev, open: false }))}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon />
          Confirmar Alterações
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            As seguintes alterações foram realizadas:
          </Typography>
          <Box sx={{ mt: 2 }}>
            {successModal.alteracoes.map((alteracao, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {alteracao.campo}:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip
                    label={alteracao.de || '(vazio)'}
                    size="small"
                    color="default"
                  />
                  <Typography variant="body2" color="text.secondary">
                    →
                  </Typography>
                  <Chip
                    label={alteracao.para || '(vazio)'}
                    size="small"
                    color="primary"
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setSuccessModal(prev => ({ ...prev, open: false }))}
            disabled={successModal.salvando}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarAlteracoes}
            variant="contained"
            disabled={successModal.salvando}
            startIcon={successModal.salvando ? <CircularProgress size={20} /> : null}
          >
            {successModal.salvando ? 'Salvando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CadastroSistema;
