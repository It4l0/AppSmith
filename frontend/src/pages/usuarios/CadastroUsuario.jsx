import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';

import { CheckCircle } from '@mui/icons-material';
import userService from '../../services/userService';

const CadastroUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    ativo: true
  });

  // Estado para tracking de alterações
  const [itemOriginal, setItemOriginal] = useState(null);
  const [successModal, setSuccessModal] = useState({
    open: false,
    alteracoes: []
  });

  // Carregar dados do usuário se estiver editando
  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const data = await userService.buscarUsuarioPorId(id);
      setFormData({
        ...data,
        ativo: data.status === 'ativo'
      });
      setItemOriginal({
        ...data,
        ativo: data.status === 'ativo'
      });
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ativo' ? checked : value
    }));
  };

  const getAlteracoes = () => {
    if (!itemOriginal) {
      return [{
        campo: 'Novo Usuário',
        de: '',
        para: formData.nome
      }];
    }

    const alteracoes = [];

    Object.keys(formData).forEach(key => {
      if (key === 'senha') return; // Não mostrar alterações de senha
      if (String(formData[key]) !== String(itemOriginal[key])) {
        alteracoes.push({
          campo: key,
          de: itemOriginal[key],
          para: formData[key]
        });
      }
    });

    return alteracoes;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Se estiver editando e não houver alterações, não fazer nada
    const alteracoes = getAlteracoes();
    if (id && alteracoes.length === 0) {
      enqueueSnackbar('Nenhuma alteração foi realizada', { variant: 'info' });
      return;
    }

    setSuccessModal({
      open: true,
      alteracoes
    });
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      
      const dadosParaSalvar = {
        ...formData,
        status: formData.ativo ? 'ativo' : 'inativo'
      };

      if (id) {
        await userService.atualizarUsuario(id, dadosParaSalvar);
        enqueueSnackbar('Usuário atualizado com sucesso!', { variant: 'success' });
      } else {
        await userService.criarUsuario(dadosParaSalvar);
        enqueueSnackbar('Usuário criado com sucesso!', { variant: 'success' });
      }
      
      navigate('/usuarios');
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      setLoading(false);
      setSuccessModal({ open: false, alteracoes: [] });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {id ? 'Editar Usuário' : 'Novo Usuário'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="nome"
                label="Nome"
                value={formData.nome}
                onChange={handleChange}
                fullWidth
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="senha"
                label="Senha"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                fullWidth
                required={!id}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.ativo}
                    onChange={handleChange}
                    name="ativo"
                    disabled={loading}
                  />
                }
                label="Usuário Ativo"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/usuarios')}
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
              {id ? 'Salvar Alterações' : 'Criar Usuário'}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Modal de confirmação */}
      <Dialog open={successModal.open} onClose={() => setSuccessModal({ open: false, alteracoes: [] })}>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircle />
            <Typography>Confirmar Alterações</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography gutterBottom>
            Revise as alterações antes de salvar:
          </Typography>

          <Box sx={{ mt: 2 }}>
            {successModal.alteracoes.map((alteracao, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {alteracao.campo}:
                </Typography>
                <Box display="flex" gap={1} alignItems="center">
                  <Chip 
                    label={alteracao.de || '(vazio)'} 
                    size="small"
                    color="default"
                  />
                  {' → '}
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
        <DialogActions>
          <Button 
            onClick={() => setSuccessModal({ open: false, alteracoes: [] })}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CadastroUsuario;
