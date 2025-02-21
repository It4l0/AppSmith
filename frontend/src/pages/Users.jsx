import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  InputAdornment,
  Tooltip,
  Snackbar,
  Alert,
  TablePagination,
  TableSortLabel,
  Toolbar,
  InputBase,
  CircularProgress,
  Chip,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  CheckCircleIcon,
  AdminPanelSettingsIcon
} from '@mui/icons-material';
import userService from '../services/userService';
import LogService from '../services/logService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('nome');
  const [order, setOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    cargo: '',
    departamento: '',
    ativo: true,
    observacoes: ''
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      showSnackbar('Erro ao carregar usuários', 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'telefone') {
      formattedValue = formatPhone(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'ativo' ? checked : formattedValue
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    // Validação do nome
    if (!formData.nome.trim()) {
      errors.push('Nome é obrigatório');
    } else if (formData.nome.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    // Validação do email
    if (!formData.email.trim()) {
      errors.push('Email é obrigatório');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Email inválido');
    }
    
    // Validação do CPF
    if (!formData.cpf.trim()) {
      errors.push('CPF é obrigatório');
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      errors.push('CPF inválido. Use o formato 000.000.000-00');
    }
    
    // Validação do telefone (opcional)
    if (formData.telefone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.telefone)) {
      errors.push('Telefone inválido. Use o formato (00) 00000-0000');
    }

    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      showSnackbar(errors.join(', '), 'error');
      return;
    }

    try {
      if (selectedUser) {
        await userService.updateUser(selectedUser.id, formData);
        showSnackbar('Usuário atualizado com sucesso');
      } else {
        await userService.createUser(formData);
        showSnackbar('Usuário criado com sucesso');
      }
      loadUsers();
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      showSnackbar(error.response?.data?.message || 'Erro ao salvar usuário', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await userService.deleteUser(id);
        showSnackbar('Usuário excluído com sucesso');
        loadUsers();
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        showSnackbar('Erro ao excluir usuário', 'error');
      }
    }
  };

  const handleOpenDialog = async (user = null) => {
    if (user) {
      try {
        const userData = await userService.getUserById(user.id);
        if (userData) {
          setFormData(userData);
          setSelectedUser(user);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        showSnackbar('Erro ao carregar dados do usuário', 'error');
      }
    } else {
      setSelectedUser(null);
      setFormData({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        cargo: '',
        departamento: '',
        ativo: true,
        observacoes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredAndSortedUsers = React.useMemo(() => {
    return users
      .filter(user => 
        Object.values(user).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .sort((a, b) => {
        const isAsc = order === 'asc';
        if (a[orderBy] < b[orderBy]) return isAsc ? -1 : 1;
        if (a[orderBy] > b[orderBy]) return isAsc ? 1 : -1;
        return 0;
      });
  }, [users, searchTerm, order, orderBy]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Cards de métricas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Total de Usuários
            </Typography>
            <Typography variant="h3" color="primary">
              {users.length}
            </Typography>
            <PersonIcon color="primary" sx={{ fontSize: 40, mt: 1 }} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Usuários Ativos
            </Typography>
            <Typography variant="h3" color="success.main">
              {users.filter(user => user.ativo).length}
            </Typography>
            <CheckCircleIcon color="success" sx={{ fontSize: 40, mt: 1 }} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Administradores
            </Typography>
            <Typography variant="h3" color="warning.main">
              {users.filter(user => user.cargo?.toLowerCase().includes('admin')).length}
            </Typography>
            <AdminPanelSettingsIcon color="warning" sx={{ fontSize: 40, mt: 1 }} />
          </Paper>
        </Grid>
      </Grid>

      {/* Tabela de Usuários Recentes */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Usuários Cadastrados
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedUser(null);
              setFormData({
                nome: '',
                email: '',
                cpf: '',
                telefone: '',
                cargo: '',
                departamento: '',
                ativo: true,
                observacoes: '',
              });
              setOpenDialog(true);
            }}
          >
            Novo Usuário
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell>Departamento</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Nenhum usuário cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.nome}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.cpf}</TableCell>
                    <TableCell>{user.telefone}</TableCell>
                    <TableCell>{user.cargo}</TableCell>
                    <TableCell>{user.departamento}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.ativo ? 'Ativo' : 'Inativo'} 
                        color={user.ativo ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
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
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CPF"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                required
                inputProps={{
                  maxLength: 14,
                  placeholder: '000.000.000-00'
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                inputProps={{
                  placeholder: '(00) 00000-0000'
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Departamento"
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.ativo}
                    onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                    name="ativo"
                  />
                }
                label="Usuário Ativo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {selectedUser ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default Users;
