<template>
  <div class="card" @click="goToJoin">
    <h2 v-if="error" class="error">{{ error }}</h2>
    <template v-else>
      <h2>{{ room }}</h2>
      <img :src="thumbnail" alt="" />
      <h3>{{ videoTitle }}</h3>
      <p>Hôte: {{ host }}</p>
      <p>Nombre de participants: {{ guests + 1 }}</p>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { initializeData } from 'assets/types'

export default Vue.extend({
  props: {
    room: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      thumbnail: '',
      host: '',
      videoTitle: '',
      guests: 0,
      error: '',
    }
  },
  mounted() {
    axios
      .get<initializeData>(`/api/details/${this.room}`)
      .then((response) => {
        this.host = response.data.roomInfos.host
        this.guests = response.data.roomInfos.guests.length
        this.thumbnail = response.data.videoDetails.thumbnail
        this.videoTitle = response.data.videoDetails.title
      })
      .catch(() => {
        this.error =
          "Nous n'avons pas pu récupérer les données relatives à ce salon"
      })
  },
  methods: {
    goToJoin() {
      this.$router.push(`/join/${this.room}`)
    },
  },
})
</script>

<style lang="scss" scoped>
.card {
  background-color: var(--background-secondary);
  width: 320px;
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  gap: 10px;
  padding: 10px 0;
  cursor: pointer;
  h2 {
    text-align: center;
    color: var(--text-header);
  }
  h3,
  p {
    padding: 0 5px;
  }
}
</style>
