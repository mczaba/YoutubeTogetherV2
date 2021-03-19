<template>
  <nav>
    <div v-if="initalized">
      <div id="roomInfos">
        <h1>{{ $route.params.name }}</h1>
        <h3>Hôte : {{ host }}</h3>
        <p v-if="rights">
          Tous les utilisateurs peuvent interragir avec la vidéo
        </p>
        <p v-else>Seul l'hôte peut interragir avec la vidéo</p>
      </div>
      <div id="userList">
        <h1>Utiliteurs connectés</h1>
        <ul>
          <li v-for="guest in guests" :key="guest">{{ guest }}</li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import { io } from 'socket.io-client'

type roomInfos = {
  host: string
  url: string
  right: boolean
  timer: number
  guests: string[]
}

export default Vue.extend({
  data() {
    return {
      socket: null as any,
      host: '',
      rights: false,
      guests: [] as string[],
      initalized: false,
    }
  },
  mounted() {
    this.socket = io({
      query: {
        room: this.$route.params.name,
        user: this.$store.getters['auth/name'],
      },
    })
    this.socket.on('initialize', (data: roomInfos) => {
      if (!this.initalized) {
        this.host = data.host
        this.rights = data.right
        this.guests = [...data.guests]
        this.initalized = true
      }
    })
    this.socket.on('guestsUpdate', (data: string[]) => {
      this.guests = [...data]
    })
  },
})
</script>

<style lang="scss" scoped>
nav {
  height: 100%;
  background-color: var(--background-secondary);
  border-right: 1px solid var(--borders);
  #roomInfos {
    border-bottom: 1px solid var(--borders);
    display: flex;
    flex-direction: column;
    padding: 15px 5px;
    h3,
    p {
      margin-top: 5px;
    }
  }
  #userList {
    padding: 15px 0;
    ul {
      padding: 0;
      margin-top: 15px;
      li {
        list-style: none;
        text-align: center;
        padding: 5px 0;
        &:hover {
          background-color: var(--background-main);
        }
      }
    }
  }
}
</style>
