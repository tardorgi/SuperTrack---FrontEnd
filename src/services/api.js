import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',  // Endereço base da API
  // Remova 'withCredentials' ou defina como false (caso esteja configurado)
  withCredentials: false,  // Não enviar credenciais, como cookies ou autenticação
});

export default api;
