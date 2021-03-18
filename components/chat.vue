<template>
  <div class="chat">
    <h3 v-if="socket">Chat du salon</h3>
    <div class="chatView">
      <div class="messageList">
        <p v-for="(message, index) in messageList" :key="index">
          <b>{{ message.author }}</b> : {{ message.content }}
        </p>
      </div>
    </div>
    <textarea
      v-model="messageInput"
      placeholder="Tapez votre message ici"
      @keydown="keydown"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { io } from 'socket.io-client'

type Message = { author: string; content: string }

export default Vue.extend({
  data() {
    return {
      messageList: [] as Object[],
      messageInput: '',
      socket: null as any,
    }
  },
  mounted() {
    this.socket = io({
      query: {
        room: this.$route.params.name,
        user: this.$store.getters['auth/name'],
      },
    })
    this.socket.on('messageSent', (data: Message) => {
      const messageList = document.querySelector('.messageList')!
      this.messageList.push(data)
      if (
        messageList.scrollTop + messageList.clientHeight ===
        messageList.scrollHeight
      ) {
        setTimeout(() => {
          messageList.scrollTop = messageList.scrollHeight
        }, 5)
      }
    })
  },
  methods: {
    keydown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        event.preventDefault()
        this.postMessage()
      }
    },
    postMessage() {
      if (this.messageInput) {
        this.socket.emit('messageSent', this.messageInput)
        this.messageInput = ''
      }
    },
  },
})
</script>

<style lang="scss">
.chat {
  height: 100%;
  background-color: var(--background-secondary);
  color: var(--text-nav);
  border-left: 1px solid var(--borders);
  position: relative;
  overflow: hidden;
  .chatView {
    height: calc(100% - 161px);
    text-align: left;
    padding: 15px;
    overflow: auto;
    position: relative;
    .messageList {
      overflow: auto;
      max-height: 100%;
      width: calc(100% - 30px);
      position: absolute;
      bottom: 19px;
      p {
        margin: 5px 0 0 0;
      }
    }
  }
  h3 {
    margin: 10px 0;
    text-align: center;
  }
  textarea {
    width: calc(100% - 20px);
    height: 80px;
    position: absolute;
    bottom: 0;
    border: none;
    border-top: 1px solid var(--borders);
    padding: 10px 10px;
    resize: none;
    background-color: var(--background-secondary);
    color: var(--text-nav);
    &::placeholder {
      font-family: 'Nunito', sans-serif;
    }
  }
}
</style>
