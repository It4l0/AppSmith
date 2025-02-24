import React from 'react';
import { Box, Typography, Paper, Divider, List, ListItem, ListItemText, Switch } from '@mui/material';

const Configuracoes = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Configurações
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Configurações Gerais
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Modo Escuro" />
            <Switch />
          </ListItem>
          <ListItem>
            <ListItemText primary="Notificações por Email" />
            <Switch />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Configurações Avançadas
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Exportar Dados" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Redefinir Configurações" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default Configuracoes;