<template>
  <div id="app">
    <nav class="navbar">
      <div v-if="mobileView" @click="goToCreate">
        <NuxtLink to="/create">Créer un salon</NuxtLink>
      </div>
      <div v-if="mobileView" @click="goToJoin">
        <NuxtLink to="/join">Rejoindre un salon</NuxtLink>
      </div>
      <div v-if="mobileView" @click="goToList">
        <NuxtLink to="/room/list">Liste des salons</NuxtLink>
      </div>
      <template v-if="!mobileView">
        <NuxtLink to="/create">Créer un salon</NuxtLink>
        <NuxtLink to="/join">Rejoindre un salon</NuxtLink>
        <NuxtLink to="/room/list">Liste des salons</NuxtLink>
      </template>
    </nav>
    <Nuxt class="content" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      windowWidth: 0,
    }
  },
  computed: {
    mobileView(): boolean {
      return this.windowWidth < 651
    },
  },
  mounted() {
    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (process.client) {
      this.windowWidth = window.innerWidth
      window.addEventListener('resize', () => {
        this.windowWidth = window.innerWidth
      })
    }
  },
  methods: {
    goToCreate(): void {
      this.$router.push('/create')
    },
    goToJoin(): void {
      this.$router.push('/join')
    },
    goToList(): void {
      this.$router.push('/room/list')
    },
  },
})
</script>

<style lang="scss">
* {
  margin: 0;
}
html,
body {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  height: 100%;
  --background-nav: #2d3142;
  --background-main: #4f5d75;
  --background-secondary: #3a3f52;
  --background-button: #ef8354;
  --text-nav: #ffffff;
  --text-main: #ffffff;
  --text-header: #ef8354;
  --text-button: #2d3142;
  --borders: #999;
  background-color: var(--background-main);
  color: var(--text-main);
}

#app {
  height: 100%;
  min-height: 100vh;
}

.button {
  display: inline-block;
  border-radius: 4px;
  font-size: 1rem;
  border: 1px solid var(--text-header);
  color: var(--background-main);
  font-weight: bold;
  background-color: var(--text-header);
  text-decoration: none;
  padding: 10px 10px;
  cursor: pointer;
}
.error {
  color: var(--text-header);
  font-weight: bold;
}

h1 {
  text-align: center;
  color: var(--text-header);
}

p {
  max-width: 50rem;
}

.navbar {
  background-color: var(--background-nav);
  height: 50px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
  a,
  a:visited,
  a:active {
    color: var(--text-header);
    font-weight: bold;
    font-size: 1.5em;
    text-decoration: none;
  }
}

.content {
  height: calc(100% - 75px);
  padding-top: 75px;
}

@media screen and (max-width: 650px) {
  #app {
    position: relative;
  }
  .navbar {
    background-color: var(--background-button);
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    top: auto;
    height: 100px;
    gap: 0;
    div {
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(100% - 10px);
      border-right: 1px solid var(--text-button);
      width: calc(33% - 1px);
      padding: 5px;
      cursor: pointer;
      a,
      a:visited,
      a:active {
        color: var(--text-button);
        font-size: 1em;
        text-align: center;
      }
    }
    div:last-child {
      border: none;
    }
  }
  .content {
    height: calc(100% - 125px);
    padding-top: 25px;
    padding-bottom: 100px;
  }
}
</style>
