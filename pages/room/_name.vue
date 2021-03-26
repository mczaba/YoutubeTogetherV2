<template>
  <div v-if="!destroyRoom" id="view">
    <side-bar v-if="socket" :socket="socket" />
    <theater v-if="socket" :socket="socket" />
    <chat v-if="socket" :socket="socket" />
  </div>
  <div v-else class="destroy">
    <h1>L'hôte du salon s'est déconnecté</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { io } from 'socket.io-client'
import axios from 'axios'
import chat from '../../components/chat.vue'
import sideBar from '../../components/sideBar.vue'
import theater from '../../components/theater.vue'

export default Vue.extend({
  components: {
    chat,
    sideBar,
    theater,
  },
  middleware: 'auth',
  data() {
    return {
      socket: null as any,
      destroyRoom: false,
    }
  },
  mounted() {
    axios.get('/api/init').then(() => {
      this.socket = io({
        query: {
          room: this.$route.params.name,
          user: this.$store.getters['auth/name'],
        },
      })
      this.socket.on('killRoom', () => {
        this.destroyRoom = true
      })
    })
  },
  beforeDestroy() {
    this.socket.disconnect()
  },
})
</script>

<style lang="scss" scoped>
#view {
  display: grid;
  width: 100%;
  grid-template-columns: 275px auto 400px;
  padding-top: 50px;
}

.destroy {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 50px);
}
</style>
