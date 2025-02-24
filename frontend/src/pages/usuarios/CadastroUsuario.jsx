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
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

import { CheckCircle } from '@mui/icons-material';
import userService from '../../services/userService';
import sistemaService from '../../services/sistemaService';

const CadastroUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);




  const [sistemasDisponiveis, setSistemasDisponiveis] = useState([]);

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    cargo: '',
    departamento: '',
    cpf: '',
    observacoes: '',


    ativo: false, // Garantir que o valor inicial seja booleano
    sistemas: []
  });

  // Estado para tracking de alterações
  const [itemOriginal, setItemOriginal] = useState(null);
  const [successModal, setSuccessModal] = useState({
    open: false,
    alteracoes: []
  });

  // Carregar sistemas disponíveis
  useEffect(() => {
    const carregarSistemas = async () => {
      try {
        const sistemas = await sistemaService.listarSistemas();
        setSistemasDisponiveis(sistemas);
      } catch (error) {
        enqueueSnackbar('Erro ao carregar sistemas', { variant: 'error' });
      }
    };
    carregarSistemas();
  }, [enqueueSnackbar]);

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
      
      // Atualiza o formulário com todos os dados do usuário
      setFormData({
        nome: data.nome,
        email: data.email,
        senha: '', // Não carregamos a senha por segurança
        telefone: data.telefone || '',
        cargo: data.cargo || '',
        departamento: data.departamento || '',
        cpf: data.cpf || '',
        observacoes: data.observacoes || '',


        ativo: data.ativo || false, // Garantir que seja booleano
        sistemas: data.sistemas || []
      });
      
      // Guarda o estado original para comparação
      setItemOriginal({
        ...data,

          ativo: data.ativo || false, // Garantir que seja booleano
        sistemas: data.sistemas || []
      });

    } catch (error) {
      enqueueSnackbar('Erro ao carregar usuário', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const compararAlteracoes = () => {
    if (!itemOriginal) return [];

    const alteracoes = [];

    const campos = [
      { key: 'nome', label: 'Nome' },
      { key: 'email', label: 'Email' },
      { key: 'telefone', label: 'Telefone' },
      { key: 'cargo', label: 'Cargo' },
      { key: 'departamento', label: 'Departamento' },
      { key: 'cpf', label: 'CPF' },
      { key: 'observacoes', label: 'Observações' }
    ];

    campos.forEach(({ key, label }) => {
      if (String(formData[key]) !== String(itemOriginal[key])) {
        alteracoes.push({
          campo: label,
          de: itemOriginal[key] || 'Não informado',
          para: formData[key] || 'Não informado'
        });
      }
    });

    if (formData.senha) {
      alteracoes.push({
        campo: 'Senha',
        de: '********',
        para: '********'
      });
    }

    if (formData.ativo !== itemOriginal.ativo) {
      alteracoes.push({
        campo: 'Status',
        de: itemOriginal.ativo ? 'Ativo' : 'Inativo',
        para: formData.ativo ? 'Ativo' : 'Inativo'
      });
    }

    // Comparar sistemas associados
    const sistemasOriginais = new Set(itemOriginal.sistemas.map(s => s.id));
    const sistemasAtuais = new Set(formData.sistemas.map(s => s.id));
    
    if (JSON.stringify([...sistemasOriginais]) !== JSON.stringify([...sistemasAtuais])) {
      alteracoes.push({
        campo: 'Sistemas',
        de: itemOriginal.sistemas.map(s => s.nome).join(', ') || 'Nenhum',
        para: formData.sistemas.map(s => s.nome).join(', ') || 'Nenhum'
      });
    }

    return alteracoes;
  };

  const handleInputChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ativo' ? checked : value
    }));
  };

  const handleSistemaChange = (event) => {
    const sistemaId = event.target.value;
    const sistema = sistemasDisponiveis.find(s => s.id === sistemaId);
    
    if (sistema && !formData.sistemas.find(s => s.id === sistema.id)) {
      setFormData(prev => ({
        ...prev,
        sistemas: [...prev.sistemas, sistema]
      }));
    }
  };

  const handleRemoverSistema = (sistemaId) => {
    setFormData(prev => ({
      ...prev,
      sistemas: prev.sistemas.filter(s => s.id !== sistemaId)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Se estiver editando e não houver alterações, não fazer nada
    const alteracoes = compararAlteracoes();
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
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleInputChange}
                required={!id}
                disabled={loading}
                helperText={id ? "Deixe em branco para manter a senha atual" : ""}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CPF"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Departamento"
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                disabled={loading}
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch

                  checked={!!formData.ativo} // Garantir que seja booleano
                    onChange={handleInputChange}
                    name="ativo"
                    disabled={loading}
                  />
                }
                label={formData.ativo ? 'Usuário Ativo' : 'Usuário Inativo'}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Sistemas Associados
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="sistema-select-label">Adicionar Sistema</InputLabel>
                    <Select
                      labelId="sistema-select-label"
                      id="sistema-select"
                      value=""
                      label="Adicionar Sistema"
                      onChange={handleSistemaChange}
                      disabled={loading}
                    >
                      {sistemasDisponiveis
                        .filter(sistema => !formData.sistemas.find(s => s.id === sistema.id))
                        .map((sistema) => (
                          <MenuItem key={sistema.id} value={sistema.id}>
                            {sistema.nome}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {formData.sistemas.map((sistema) => (
                      <Chip
                        key={sistema.id}
                        label={sistema.nome}
                        color="primary"
                        onDelete={() => handleRemoverSistema(sistema.id)}
                        disabled={loading}
                      />
                    ))}
                    {formData.sistemas.length === 0 && (
                      <Typography color="textSecondary">
                        Nenhum sistema associado
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
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
