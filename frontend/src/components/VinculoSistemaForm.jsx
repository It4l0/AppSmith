import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { usuarioService } from '../services/usuarioService';

function VinculoSistemaForm({ open, onClose, onSave, sistemas, perfis, vinculoAtual = null }) {
  const [formData, setFormData] = useState({
    sistema_id: '',
    perfil_id: '',
    observacoes: ''
  });

  useEffect(() => {
    if (vinculoAtual) {
      setFormData({
        sistema_id: vinculoAtual.sistema_id,
        perfil_id: vinculoAtual.perfil_id,
        observacoes: vinculoAtual.observacoes || ''
      });
    } else {
      setFormData({
        sistema_id: '',
        perfil_id: '',
        observacoes: ''
      });
    }
  }, [vinculoAtual]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {vinculoAtual ? 'Editar Vínculo com Sistema' : 'Novo Vínculo com Sistema'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Sistema</InputLabel>
            <Select
              name="sistema_id"
              value={formData.sistema_id}
              onChange={handleChange}
              label="Sistema"
            >
              {sistemas.map((sistema) => (
                <MenuItem key={sistema.id} value={sistema.id}>
                  {sistema.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Perfil</InputLabel>
            <Select
              name="perfil_id"
              value={formData.perfil_id}
              onChange={handleChange}
              label="Perfil"
            >
              {perfis.map((perfil) => (
                <MenuItem key={perfil.id} value={perfil.id}>
                  {perfil.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={3}
            name="observacoes"
            label="Observações"
            value={formData.observacoes}
            onChange={handleChange}
            placeholder="Digite as credenciais ou outras informações relevantes"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.sistema_id || !formData.perfil_id}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default VinculoSistemaForm;
