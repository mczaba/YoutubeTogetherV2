<template>
  <div v-if="!destroyRoom" id="view">
    <side-bar v-if="socket" class="side-bar" :socket="socket" />
    <theater v-if="socket" class="theater" :socket="socket" />
    <chat v-if="socket" class="chat" :socket="socket" />
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
  grid-template-columns: 275px 1200px auto;
  padding-top: 50px;
}

.destroy {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 50px);
}
@media screen and (max-width: 1875px) {
  #view {
    grid-template-columns: 275px auto 400px;
  }
}
@media screen and (max-width: 1350px) {
  #view {
    grid-template-columns: auto 400px;
    grid-template-rows: auto auto;
  }
  .side-bar {
    grid-column: 1 / 3;
    grid-row: 1 / 2;
  }
  .theater {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }
  .chat {
    grid-column: 2 / 3;
    grid-row: 2/ 3;
  }
}
@media screen and (max-width: 1000px) {
  #view {
    grid-template-columns: auto;
    grid-template-rows: 230px 700px 700px;
  }
  .side-bar {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }
  .theater {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }
  .chat {
    grid-column: 1 / 2;
    grid-row: 3 / 4;
  }
}
@media screen and (max-width: 650px) {
  #view {
    padding-top: 0;
  }
}
</style>
