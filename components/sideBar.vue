<template>
  <nav>
    <div v-if="initalized">
      <div id="roomInfos">
        <h1>Salon : {{ $route.params.name }}</h1>
        <h3>Hôte : {{ host }}</h3>
        <p>Permission: {{ rights ? 'Tout le monde' : 'Hôte' }}</p>
      </div>
      <div v-if="hasRights" id="roomControls">
        <label for="url">Changer de vidéo</label>
        <validation-provider v-slot="{ errors }" rules="youtubeLink">
          <div class="url-input">
            <input
              v-model="url"
              type="text"
              name="url"
              placeholder="url de la video"
            />
            <button class="button" @click="changeURL">Changer</button>
          </div>
          <span class="error validation">{{ errors[0] }}</span>
        </validation-provider>
        <div v-if="host === $store.getters['auth/name']">
          <input
            v-model="rightsInput"
            type="checkbox"
            name="rights"
            @change="changeRights"
          />
          <label for="rights"
            >Permission: {{ rights ? 'Tout le monde' : 'Hôte' }}</label
          >
        </div>
      </div>
      <div v-if="!topView" id="userList">
        <h1>Utiliteurs connectés</h1>
        <ul>
          <li>👑 {{ host }}</li>
          <li v-for="guest in guests" :key="guest">{{ guest }}</li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import { Socket } from 'socket.io-client'
import { ValidationProvider, extend } from 'vee-validate'
import { roomInfos, guestUpdate } from '../assets/types'

extend('youtubeLink', {
  validate(value: string): boolean {
    if (!value.includes('www.youtube.com/watch?v=')) return false
    if (value.split('www.youtube.com/watch?v=')[1].length < 11) return false
    return true
  },
  message: 'Ce champ doit contenir un lien de vidéo youtube valide',
})

export default Vue.extend({
  components: {
    ValidationProvider,
  },
  props: {
    socket: Socket,
  },
  data() {
    return {
      host: '',
      rights: false,
      rightsInput: false,
      guests: [] as string[],
      initalized: false,
      url: '',
      windowWidth: 0,
    }
  },
  computed: {
    hasRights(): boolean {
      if (!this.rights && this.host !== this.$store.getters['auth/name'])
        return false
      return true
    },
    topView(): boolean {
      return this.windowWidth < 1351
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
    this.socket.on('initialize', (data: roomInfos) => {
      this.host = data.host
      this.rights = data.rights
      this.rightsInput = data.rights
      this.guests = [...data.guests]
      this.initalized = true
    })
    this.socket.on('guestsUpdate', (data: guestUpdate) => {
      this.guests = [...data.guestList]
    })
  },
  methods: {
    changeURL(): void {
      if (!this.url.includes('www.youtube.com/watch?v=')) return
      if (this.url.split('www.youtube.com/watch?v=')[1].length < 11) return
      this.socket.emit('changeURL', this.url)
    },
    changeRights(): void {
      this.socket.emit('changeRights')
    },
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
    padding: 15px 15px;
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

#roomControls {
  padding: 15px 15px;
  border-bottom: 1px solid var(--borders);
  .url-input {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    flex-wrap: wrap;
    gap: 10px;
    margin: 5px 0;
    input[type='text'] {
      width: calc(100% - 120px);
    }
    button {
      flex-grow: 0;
    }
  }
  .error {
    font-size: 12px;
  }
}
</style>
