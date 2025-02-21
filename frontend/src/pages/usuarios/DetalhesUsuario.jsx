import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { usuarioService } from '../../services/usuarioService';

function DetalhesUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [vinculosSistema, setVinculosSistema] = useState([]);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dadosUsuario = await usuarioService.obterUsuario(id);
        setUsuario(dadosUsuario);
        
        const vinculos = await usuarioService.listarSistemasVinculados(id);
        setVinculosSistema(vinculos);
      } catch (error) {
        setMensagem({
          tipo: 'error',
          texto: 'Erro ao carregar dados do usuário. Tente novamente.'
        });
      }
    };

    carregarDados();
  }, [id]);

  if (!usuario) {
    return null;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Detalhes do Usuário
        </Typography>
        <Box>
          <Button
            variant="outlined"
            onClick={() => navigate('/usuarios')}
            sx={{ mr: 1 }}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/usuarios/${id}/editar`)}
          >
            Editar
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Nome Completo
              </Typography>
              <Typography variant="body1" gutterBottom>
                {usuario.nome_completo}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Empresa
              </Typography>
              <Typography variant="body1" gutterBottom>
                {usuario.empresa}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" gutterBottom>
                {usuario.email}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Telefone
              </Typography>
              <Typography variant="body1" gutterBottom>
                {usuario.telefone || 'Não informado'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Setor
              </Typography>
              <Typography variant="body1" gutterBottom>
                {usuario.setor || 'Não informado'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Cargo
              </Typography>
              <Typography variant="body1" gutterBottom>
                {usuario.cargo || 'Não informado'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Data de Nascimento
              </Typography>
              <Typography variant="body1" gutterBottom>
                {usuario.data_nascimento
                  ? format(new Date(usuario.data_nascimento), 'dd/MM/yyyy', { locale: ptBR })
                  : 'Não informada'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Data de Cadastro
              </Typography>
              <Typography variant="body1" gutterBottom>
                {format(new Date(usuario.data_cadastro), 'dd/MM/yyyy', { locale: ptBR })}
              </Typography>
            </Grid>
            {usuario.observacoes && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Observações
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {usuario.observacoes}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Sistemas Vinculados
          </Typography>
          <List>
            {vinculosSistema.map((vinculo, index) => (
              <div key={vinculo.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={vinculo.sistema.nome}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Perfil: {vinculo.perfil.nome}
                        </Typography>
                        {vinculo.observacoes && (
                          <Typography component="p" variant="body2">
                            Observações: {vinculo.observacoes}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              </div>
            ))}
            {vinculosSistema.length === 0 && (
              <ListItem>
                <ListItemText primary="Nenhum sistema vinculado" />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>

      <Snackbar
        open={!!mensagem.texto}
        autoHideDuration={6000}
        onClose={() => setMensagem({ tipo: '', texto: '' })}
      >
        <Alert severity={mensagem.tipo} onClose={() => setMensagem({ tipo: '', texto: '' })}>
          {mensagem.texto}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DetalhesUsuario;
