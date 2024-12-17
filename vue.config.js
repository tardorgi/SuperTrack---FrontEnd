module.exports = {
  devServer: {
    port: 3000,  // Porta do frontend
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // URL do backend
        changeOrigin: true, // Modifica o cabeçalho 'Origin'
        pathRewrite: { '^/api': '' },  // Remove o prefixo '/api' se necessário
      },
    },
  },
};
