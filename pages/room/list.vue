<template>
  <div class="room-list">
    <h1>Liste des salons</h1>
    <h2 v-if="roomList.length === 0">Il n'y a pas de salon actuellement</h2>
    <div class="card-list">
      <room-card v-for="room in roomList" :key="room" :room="room" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import roomCard from '../../components/roomCard.vue'

export default Vue.extend({
  components: {
    roomCard,
  },
  data() {
    return {
      roomList: [] as string[],
      error: '',
    }
  },
  mounted() {
    axios
      .get('/api/room/all')
      .then((response) => {
        response.data.forEach((element: string) => {
          this.roomList.push(element)
        })
      })
      .catch((error) => {
        this.error = error
      })
  },
})
</script>

<style lang="scss" scoped>
h1 {
  margin: 15px;
}
h2 {
  text-align: center;
}
.card-list {
  display: flex;
  flex-wrap: wrap;
  width: 90%;
  margin: auto;
  justify-content: space-between;
}
</style>
