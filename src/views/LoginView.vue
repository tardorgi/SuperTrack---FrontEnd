<template>
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div>
          <label for="nome">Nome:</label>
          <input type="text" v-model="nome" required />
        </div>
        <div>
          <label for="senha">Senha:</label>
          <input type="password" v-model="senha" required />
        </div>
        <button type="submit">Entrar</button>
      </form>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        nome: "",
        senha: "",
        errorMessage: "",
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post(
            "http://localhost:8080/api/funcionarios/login",
            { nome: this.nome, senha: this.senha }
          );
          // Salva o token de autenticação no localStorage
          localStorage.setItem("authToken", response.data.token);
          
          // Redireciona para a página inicial após login
          this.$router.push("/"); 
        } catch (error) {
          this.errorMessage = "Credenciais inválidas. Tente novamente.";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .login-container {
    width: 300px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  h2 {
    text-align: center;
  }
  
  form {
    display: flex;
    flex-direction: column;
  }
  
  div {
    margin-bottom: 10px;
  }
  
  label {
    font-weight: bold;
  }
  
  input {
    padding: 8px;
    font-size: 14px;
    margin-top: 5px;
    width: 100%;
  }
  
  button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>
  