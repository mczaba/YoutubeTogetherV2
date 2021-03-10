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
      <div>
        <label for="url">URL de la vidéo</label>
        <input
          v-model="url"
          type="text"
          name="url"
          placeholder="url de la video"
        />
      </div>
      <div>
        <label for="nickname">Votre pseudo</label>
        <input
          v-model="nickname"
          type="text"
          name="nickname"
          placeholder="pseudo"
        />
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="button" @click.prevent="submit">Créer le salon</button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  data() {
    return {
      room: '',
      url: '',
      nickname: '',
      error: '',
    }
  },
  methods: {
    submit(): void {
      const fd = new FormData()
      fd.append('room', this.room)
      fd.append('url', this.url)
      fd.append('nickname', this.nickname)
      axios
        .post('/api/create', fd)
        .then((res: any) => {
          if (res.data === 'salon créé') {
            this.$router.push(`/room/${this.room.replace(' ', '-')}`)
          } else {
            this.error = res.data
          }
        })
        .catch((error: string) => {
          this.error = error
        })
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
