<template>
  <div ref="theater" class="theater">
    <div id="youtube-wrapper">
      <youtube
        ref="youtube"
        :video-id="videoID"
        :player-vars="playerVars"
        :width="playerWidth"
        :height="playerHeight"
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
        <div id="circle" :style="{ left: `calc(${advancement}% - 9px)` }"></div>
        <div id="line"></div>
      </div>
      <span>{{ currentTime | formatTime }} / {{ totalTime | formatTime }}</span>
    </div>
    <div
      v-if="!infosError"
      :style="{ height: `calc(100% - ${56 + playerHeight}px)` }"
      class="infos"
    >
      <h1>{{ videoTitle }}</h1>
      <p id="description">
        {{ videoDescription }}
      </p>
    </div>
    <h1 v-else class="error">{{ infosError }}</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Socket } from 'socket.io-client'
import axios from 'axios'
import { roomInfos } from '../assets/types'

let sendTimeInterval = null as any

export default Vue.extend({
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
  props: {
    socket: Socket,
  },
  data() {
    return {
      url: '',
      playerWidth: 1200,
      playerHeight: 675,
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
      },
      currentTime: 0,
      totalTime: 1,
      firstPlay: true,
      videoTitle: '',
      videoDescription: '',
      infosError: '',
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
    this.getElementWidth()
    window.addEventListener('resize', this.getElementWidth)
    this.socket.on('initialize', (data: roomInfos) => {
      this.url = data.url
      this.currentTime = data.timer
      this.getDetails()
      if (data.playing) this.player.playVideo()
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
  },
  methods: {
    getElementWidth() {
      let width = 0
      if (window.innerWidth > 1350) width = window.innerWidth - 675
      else if (window.innerWidth > 1000) width = window.innerWidth - 400
      else width = window.innerWidth
      this.playerWidth = Math.max(width, 300)
      this.playerHeight = Math.floor((this.playerWidth * 9) / 16) + 1
    },
    getDuration() {
      this.player.getDuration().then((time: number) => {
        this.totalTime = time
      })
    },
    onPlaying() {
      if (this.firstPlay) {
        this.player.seekTo(this.currentTime, true)
        this.firstPlay = false
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
    getDetails() {
      axios
        .get(`/api/videodetails/${this.videoID}`)
        .then((response) => {
          if (response.status === 200) {
            this.videoTitle = response.data.title
            this.videoDescription = response.data.description
          } else {
            this.infosError =
              "Les informations de la vidéo n'ont pas pu être récupérées"
          }
        })
        .catch(() => {
          this.infosError =
            "Les informations de la vidéo n'ont pas pu être récupérées"
        })
    },
  },
})
</script>

<style lang="scss" scoped>
.theater {
  height: calc(100vh - 50px);
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
    span {
      cursor: default;
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
  }
  .infos {
    width: 99%;
    margin: 15px auto 0 auto;
    height: calc(100% - 731px);
    overflow-y: scroll;
    h1 {
      text-align: left;
    }
    #description {
      white-space: pre-line;
      scrollbar-width: thin;
    }
  }
}
@media screen and (max-width: 1350px) {
  .theater {
    height: auto;
  }
}

@media screen and (max-width: 1000px) {
  .theater {
    border-bottom: 1px solid var(--borders);
    .controls {
      width: 96%;
    }
  }
}
</style>
