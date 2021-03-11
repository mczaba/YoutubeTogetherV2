<template>
  <div id="app">
    <nav>
      <h1>cc</h1>
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
  --background-button: #ef8354;
  --text-nav: #ffffff;
  --text-main: #ffffff;
  --text-header: #ef8354;
  --text-button: #2d3142;
  background-color: var(--background-main);
  color: var(--text-main);
}

#app {
  height: 100%;
}

nav {
  background-color: var(--background-nav);
  color: var(--text-nav);
  height: 50px;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
}

h1 {
  text-align: center;
  color: var(--text-header);
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
  padding: 10px 30px;
  cursor: pointer;
}
.error {
  color: var(--text-header);
  font-weight: bold;
}
</style>
