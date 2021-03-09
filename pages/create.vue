<template>
  <form action="">
    <input
      v-model="room"
      type="text"
      label="Nom du salon"
      placeholder="Nom du salon"
    />
    <input
      v-model="url"
      type="text"
      label="url de la video"
      placeholder="url de la video"
    />
    <input v-model="nickname" type="text" label="pseudo" placeholder="pseudo" />
    <button @click.prevent="submit">submit</button>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'

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
      fetch('/API/create', {
        method: 'POST',
        mode: 'cors',
        body: fd,
      })
        .then(() => {
          this.$router.push(`/room/${this.room}`)
        })
        .catch((error: string) => {
          this.error = error
        })
    },
  },
})
</script>
