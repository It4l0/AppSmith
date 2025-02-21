import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { login, bypassAuth } = useAuth();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, senha });
      navigate('/');
    } catch (err) {
      console.error("Erro detalhado:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          baseURL: err.config?.baseURL,
          headers: err.config?.headers
        }
      });
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectAccess = () => {
    bypassAuth();
    navigate('/');
  };

  return (
    <Box className={styles.loginContainer}>
      <Container component="main" maxWidth="xs">
        <Paper 
          elevation={3} 
          className={styles.loginPaper}
          sx={{
            p: isMobile ? 2 : 4,
            width: '100%',
            maxWidth: '400px'
          }}
        >
          <Box className={styles.logoContainer}>
            <Typography 
              component="h1" 
              variant="h4" 
              className={styles.title}
              gutterBottom
            >
              AppSmith
            </Typography>
            <Typography 
              variant="subtitle1" 
              color="text.secondary"
              gutterBottom
            >
              Sistema de Gerenciamento
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} className={styles.form}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="senha"
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              id="senha"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
              startIcon={<LoginIcon />}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleDirectAccess}
              sx={{ mt: 1 }}
            >
              Acesso Direto ao Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
