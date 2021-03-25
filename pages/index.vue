<template>
  <div class="container app">
    <h1 class="title">YoutubeTogether</h1>
    <p>
      Bienvenue sur l'application YoutubeTogether. Vous pouvez créer un salon ou
      rejoindre un salon déjà existant pour regarder des vidéos youtube en
      synchroninisé avec vos amis
    </p>
    <div class="links">
      <NuxtLink to="/create" class="button"> Créer un salon </NuxtLink>
      <NuxtLink to="/join" class="button"> Rejoindre un salon </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="scss">
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  text-align: center;

  .title {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system,
      BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      sans-serif;
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: var(--text-main);
    letter-spacing: 1px;
  }

  p {
    font-size: 1.5rem;
  }

  .links {
    padding-top: 15px;
    .button {
      margin: 0 10px;
    }
  }
}
</style>
