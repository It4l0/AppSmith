import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import styles from './Loading.module.css';

const Loading = ({ message = 'Carregando...' }) => {
  return (
    <Box className={styles.loadingContainer}>
      <CircularProgress size={40} thickness={4} />
      <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
