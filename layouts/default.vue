<template>
  <div id="app">
    <nav class="navbar">
      <NuxtLink to="/create">Créer un salon</NuxtLink>
      <NuxtLink to="/join">Rejoindre un salon</NuxtLink>
      <NuxtLink to="/room/list">Liste des salons</NuxtLink>
    </nav>
    <Nuxt />
  </div>
</template>

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
}

.navbar {
  background-color: var(--background-nav);
  color: var(--text-nav);
  height: 50px;
  position: sticky;
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

h1 {
  text-align: center;
  color: var(--text-header);
}

p {
  max-width: 50rem;
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
</style>
