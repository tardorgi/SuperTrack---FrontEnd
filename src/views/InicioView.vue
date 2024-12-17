<template>
  <div class="background-container">
    <div class="InicioView">
      <img src="@/assets/SuperTrack.png" alt="Super Track Logo" class="logo" />
      <h1>{{ msg }}</h1>
      <h2>Este é um trabalho desenvolvido por:</h2>
      <ul>
        <li>Giovanni Torres Tardochi</li>
        <li>Leonardo Trevisan Nery</li>
        <li>Arthur Santos Correia</li>
        <li>Mateus Gomes Siqueira</li>
        <li>Daniel Venturini Pereira</li>
      </ul>
      
    </div>
  </div>
</template>

<script>
export default {
  name: 'InicioView',
  data() {
    return {
      msg: 'Bem vindo ao aplicativo Super Track',
    };
  },
  methods: {
    navigateTo(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style scoped>
.background-container {
  position: relative;
  background-image: url('../assets/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  color: #fff;
}

.background-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.Inicio {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 20px;
}

h1, h2 {
  font-weight: normal;
  color: white;
}
ul {
  list-style-type: none;
  padding: 0;
  color: white;
}
li {
  display: inline-block;
  margin: 0 10px;
}
button {
  padding: 20px 30px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #358a6e;
}
</style>
