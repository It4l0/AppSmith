import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Icon,
  useTheme
} from '@mui/material';
import {
  People as PeopleIcon,
  Computer as ComputerIcon,
  Assignment as AssignmentIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import styles from './Dashboard.module.css';
import api from '../src/services/api';

// Dados de exemplo para o gráfico
const data = [
  { name: 'Jan', usuarios: 4, sistemas: 2 },
  { name: 'Fev', usuarios: 6, sistemas: 3 },
  { name: 'Mar', usuarios: 8, sistemas: 4 },
  { name: 'Abr', usuarios: 10, sistemas: 5 },
  { name: 'Mai', usuarios: 12, sistemas: 6 },
  { name: 'Jun', usuarios: 15, sistemas: 8 },
];

const DashboardCard = ({ title, value, icon, color, onClick }) => {
  return (
    <Paper 
      elevation={3} 
      className={styles.card} 
      onClick={onClick}
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: 6,
          transition: 'all 0.3s ease-in-out'
        } : {}
      }}
    >
      <Box className={styles.cardContent}>
        <Box className={styles.cardInfo}>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ mt: 1 }}>
            {value}
          </Typography>
        </Box>
        <Box className={styles.cardIcon} sx={{ backgroundColor: `${color}15` }}>
          <Icon component={icon} sx={{ fontSize: 40, color: color }} />
        </Box>
      </Box>
    </Paper>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await api.get('/users');
        setUserCount(response.data.length);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount();
  }, []);

  const handleUserCardClick = () => {
    navigate('/users');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Cards informativos */}
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Usuários Cadastrados"
            value={userCount}
            icon={PeopleIcon}
            color={theme.palette.primary.main}
            onClick={handleUserCardClick}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Sistemas"
            value="8"
            icon={ComputerIcon}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Acessos"
            value="42"
            icon={AssignmentIcon}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Ativos"
            value="85%"
            icon={SpeedIcon}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatusCard
            title="Usuarios"
            value={stats.users}
            icon={<PersonIcon />}
            color="primary.main"
          />
        </Grid>
        
         {/* Gráfico */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Crescimento
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="usuarios" fill={theme.palette.primary.main} name="Usuários" />
                <Bar dataKey="sistemas" fill={theme.palette.secondary.main} name="Sistemas" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
