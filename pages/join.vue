<template>
  <div class="app">
    <h1>Créer un salon</h1>
    <form action="">
      <div>
        <label for="room">Nom du salon</label>
        <input
          v-model="room"
          type="text"
          name="room"
          placeholder="Nom du salon"
        />
      </div>
      <button class="button" @click.prevent="join">Créer le salon</button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      room: '',
    }
  },
  methods: {
    join() {
      this.$router.push(`/room/${this.room}`)
    },
  },
})
</script>

<style lang="scss" scoped>
form {
  height: 300px;
  width: 40%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  div {
    width: 100%;
    input {
      width: 100%;
      margin-top: 5px;
    }
  }
}
h1 {
  margin: 15px;
}
</style>
