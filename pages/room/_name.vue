<template>
  <div id="view">
    <side-bar />
    <div class="theater">
      <div id="youtube-wrapper">
        <youtube
          ref="youtube"
          :video-id="videoID"
          :player-vars="playerVars"
          width="1200"
          height="675"
          @playing="onPlaying"
        />
      </div>
      <div class="controls">
        <button class="button" @click="socket.emit('playVideo')">
          <font-awesome-icon :icon="['fas', 'play']" />
        </button>
        <button class="button" @click="socket.emit('pauseVideo')">
          <font-awesome-icon :icon="['fas', 'pause']" />
        </button>
        <div id="bar" @click="switchTime">
          <div
            id="circle"
            :style="{ left: `calc(${advancement}% - 9px)` }"
          ></div>
          <div id="line"></div>
        </div>
        <span
          >{{ currentTime | formatTime }} / {{ totalTime | formatTime }}</span
        >
      </div>
      <div class="infos">
        <h1>Titre de la vidéo</h1>
        <p>auteur</p>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta quos
          distinctio aperiam quis blanditiis delectus odio minus esse voluptatem
          expedita eius, autem facilis. Similique ea, eos dolor labore sit quam.
        </p>
      </div>
    </div>
    <chat v-if="url" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { io } from 'socket.io-client'
import axios from 'axios'
import chat from '../../components/chat.vue'
import sideBar from '../../components/sideBar.vue'

type roomInfos = {
  host: string
  url: string
  right: boolean
  timer: number
  guests: string[]
}

let sendTimeInterval = null as any

export default Vue.extend({
  components: {
    chat,
    sideBar,
  },
  filters: {
    formatTime(value: number): string {
      let roundedValue = Math.round(value)
      let string = ''
      while (roundedValue > 60) {
        string = `:${('0' + (roundedValue % 60)).slice(-2)}${string}`
        roundedValue = (roundedValue - (roundedValue % 60)) / 60
      }
      return string
        ? `${roundedValue}${string}`
        : `00:${('0' + roundedValue).slice(-2)}`
    },
  },
  middleware: 'auth',
  data() {
    return {
      socket: null as any,
      url: '',
      playerWidth: 1200,
      playerHeight: 675,
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
      },
      currentTime: 0,
      totalTime: 1,
    }
  },
  computed: {
    videoID(): string {
      if (!this.url) {
        return ''
      }
      return this.url.split('v=')[1].split('&')[0]
    },
    player(): any {
      return (this.$refs.youtube as any).player
    },
    advancement(): number {
      return (this.currentTime / this.totalTime) * 100
    },
  },
  mounted() {
    axios.get('/api/init').then(() => {
      this.socket = io({
        query: {
          room: this.$route.params.name,
          user: this.$store.getters['auth/name'],
        },
      })
      this.socket.on('initialize', (data: roomInfos) => {
        this.url = data.url
        this.currentTime = data.timer
      })
      this.socket.on('playVideo', () => {
        this.player.playVideo()
      })
      this.socket.on('pauseVideo', () => {
        this.player.pauseVideo()
        clearInterval(sendTimeInterval)
        sendTimeInterval = null
      })
      this.socket.on('seekTo', (data: number) => {
        this.player.seekTo(data, true)
        this.socket.emit('playVideo')
      })
    })
  },
  methods: {
    getDuration() {
      this.player.getDuration().then((time: number) => {
        this.totalTime = time
      })
    },
    onPlaying() {
      if (this.currentTime === 0) {
        this.player.seekTo(this.currentTime, true)
        this.currentTime++
      }
      if (!sendTimeInterval) {
        sendTimeInterval = setInterval(() => {
          this.player.getCurrentTime().then((time: number) => {
            this.currentTime = time
            this.socket.emit('refreshTimer', time)
          })
        }, 1000)
      }
      this.getDuration()
    },
    switchTime(event: MouseEvent) {
      const bar = document.querySelector('#bar')! as HTMLDivElement
      const barPosX = bar.offsetLeft
      const barWidth = bar.offsetWidth
      let relativeClickPos = ((event.clientX - barPosX) / barWidth) * 100
      if (relativeClickPos < 0) {
        relativeClickPos = 0
      }
      const secondsTimer = (relativeClickPos * this.totalTime) / 100
      this.socket.emit('seekTo', secondsTimer)
    },
  },
})
</script>

<style lang="scss" scoped>
#view {
  display: grid;
  width: 100%;
  height: calc(100% - 50px);
  grid-template-columns: 2fr 1200px 3fr;
}
#youtube-wrapper {
  pointer-events: none;
}

.controls {
  display: flex;
  width: 99%;
  margin: auto;
  justify-content: stretch;
  align-items: center;
  gap: 10px;
  height: 30px;
  margin-top: 7px;
  button {
    height: 100%;
    padding: 5px 15px;
    border-radius: 5px;
    font-weight: bold;
  }
}

.infos {
  width: 99%;
  margin: 15px auto;
  h1 {
    text-align: left;
  }
}

#bar {
  flex-grow: 1;
  position: relative;
  cursor: pointer;
  height: 30px;
  margin: 0 10px;
}
#line {
  height: 0;
  border: 1px solid var(--background-button);
  width: 100%;
  position: absolute;
  top: 15px;
}
#circle {
  cursor: pointer;
  height: 18px;
  width: 18px;
  top: 6px;
  position: absolute;
  background-color: var(--background-button);
  border-radius: 9px;
}
</style>
