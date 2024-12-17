<template>
  <nav>
    <router-link to="/">Inicio</router-link> |
    <router-link to="/produtos" v-if="isAuthenticated">Estoque</router-link> |
    <router-link to="/funcionarios" v-if="isAuthenticated">Funcionarios</router-link> |
    <router-link to="/vendas" v-if="isAuthenticated">Vendas</router-link> |
    <span v-if="isAuthenticated" @click="logout" style="cursor: pointer; color: red;">Logout</span>
  </nav>
  <router-view />
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem("authToken");
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("authToken");
      this.$router.push("/login"); // Redireciona para a página de login
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #92a1f7;
}
</style>
