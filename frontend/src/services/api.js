import axios from 'axios';
import LogService from './logService';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // Aumentando o timeout para 30 segundos
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    LogService.info('Enviando requisição:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers
    });

    // Adiciona o token de autenticação se existir
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    LogService.error('Erro na configuração da requisição:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    LogService.info('Resposta recebida:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method
    });
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      LogService.error('Timeout na requisição:', {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout
      });
    } else if (!error.response) {
      LogService.error('Erro de conexão:', error);
    } else {
      LogService.error('Erro na resposta:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
        method: error.config?.method
      });
    }
    return Promise.reject(error);
  }
);

export default api;
