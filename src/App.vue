<template>
  <v-app>
    <v-main>
      <SynthController/>
    </v-main>
  </v-app>
</template>

<script>
import SynthController from './components/SynthComponent.vue'

export default {
  name: 'App',

  components: {
    SynthController,
  },

  data: () => ({
    //
  }),
}
</script>
<style>
html{
font-family: "arial";
}
</style>
