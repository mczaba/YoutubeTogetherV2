<template>
  <div class="chat">
    <h3 v-if="socket">Chat du salon</h3>
    <div class="chatView">
      <div class="messageList">
        <p v-for="(message, index) in messageList" :key="index">
          <b v-if="message.author !== 'info'">{{ message.author }}</b
          ><span v-if="message.author !== 'info'">
            : {{ message.content }}</span
          >
          <i v-if="message.author === 'info'">{{ message.content }}</i>
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
import { Socket } from 'socket.io-client'
import { Message, GuestUpdate } from '../assets/types'

export default Vue.extend({
  props: {
    socket: Socket,
  },
  data() {
    return {
      messageList: [] as Object[],
      messageInput: '',
    }
  },
  mounted() {
    this.socket.on('messageSent', (data: Message) => {
      this.displayMessage(data)
    })
    this.socket.on('guestsUpdate', (data: GuestUpdate) => {
      this.displayMessage({
        author: 'info',
        content:
          data.newGuest.action === 'joined'
            ? `${data.newGuest.name} vient de se connecter au salon`
            : `${data.newGuest.name} vient de se déconnecter`,
      })
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
    displayMessage(message: Message) {
      const messageList = document.querySelector('.messageList')!
      this.messageList.push(message)
      if (
        messageList.scrollTop + messageList.clientHeight ===
        messageList.scrollHeight
      ) {
        setTimeout(() => {
          messageList.scrollTop = messageList.scrollHeight
        }, 5)
      }
    },
  },
})
</script>

<style lang="scss">
.chat {
  background-color: var(--background-secondary);
  color: var(--text-nav);
  border-left: 1px solid var(--borders);
  position: relative;
  overflow: hidden;
  .chatView {
    height: calc(100% - 147px);
    text-align: left;
    padding: 0 15px 5px 15px;
    overflow: auto;
    position: relative;
    .messageList {
      overflow: auto;
      max-height: calc(100% - 10px);
      width: calc(100% - 30px);
      position: absolute;
      bottom: 5px;
      padding-top: 5px;
      p {
        margin: 0;
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

@media screen and (max-width: 1000px) {
  .chat {
    border-left: none;
  }
}
</style>
