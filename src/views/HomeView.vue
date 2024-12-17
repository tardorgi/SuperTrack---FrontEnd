<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/SuperTrack.png">
    <Inicio msg="Trabalho de Arquitetura de Software"/>
  </div>
</template>

<script>
// @ is an alias to /src
import InicioView from '@/components/Inicio.vue'

export default {
  name: 'Inicio',
  components: {
    InicioView
  }
}
</script>
