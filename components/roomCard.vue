<template>
  <div class="card" @click="goToJoin">
    <h2>{{ room }}</h2>
    <img :src="thumbnail" alt="" />
    <h3>{{ videoTitle }}</h3>
    <p>Hôte: {{ host }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

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
    }
  },
  mounted() {
    axios
      .get(`/api/details/${this.room}`)
      .then((response) => {
        this.host = response.data.host
        const id = response.data.url.split('v=')[1].split('&')[0]
        return axios.get(`/api/videodetails/${id}`)
      })
      .then((response) => {
        this.thumbnail = response.data.thumbnail
        this.videoTitle = response.data.title
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
