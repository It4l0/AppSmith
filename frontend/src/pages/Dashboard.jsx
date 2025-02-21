import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  Chip
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import sistemaService from '../services/sistemaService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    inativos: 0,
    manutencao: 0
  });

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const sistemas = await sistemaService.listarSistemas();
      const estatisticas = sistemas.reduce((acc, sistema) => {
        acc.total++;
        switch (sistema.status) {
          case 'ativo':
            acc.ativos++;
            break;
          case 'inativo':
            acc.inativos++;
            break;
          case 'manutencao':
            acc.manutencao++;
            break;
        }
        return acc;
      }, { total: 0, ativos: 0, inativos: 0, manutencao: 0 });

      setStats(estatisticas);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const StatusCard = ({ title, value, icon: Icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h3">
              {value}
            </Typography>
          </Box>
          <Icon sx={{ fontSize: 40, color }} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatusCard
            title="Total de Sistemas"
            value={stats.total}
            icon={AssessmentIcon}
            color="primary.main"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatusCard
            title="Sistemas Ativos"
            value={stats.ativos}
            icon={CheckCircleIcon}
            color="success.main"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatusCard
            title="Sistemas Inativos"
            value={stats.inativos}
            icon={ErrorIcon}
            color="error.main"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatusCard
            title="Em Manutenção"
            value={stats.manutencao}
            icon={BuildIcon}
            color="warning.main"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
