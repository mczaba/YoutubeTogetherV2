<template>
  <div>
    <button @click="send">send</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { io } from 'socket.io-client'
import axios from 'axios'

export default Vue.extend({
  data() {
    return {
      socket: null as any,
    }
  },
  mounted() {
    axios.get('/api/init').then((_response) => {
      this.socket = io()
    })
  },
  methods: {
    send() {
      this.socket.emit('msg', 'cc')
    },
  },
})
</script>
