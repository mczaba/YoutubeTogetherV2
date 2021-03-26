<template>
  <div class="app">
    <h1>Rejoindre un salon</h1>
    <validation-observer v-slot="{ handleSubmit }">
      <form action="" @submit.prevent="handleSubmit(join)">
        <div class="field">
          <label for="room validation">Nom du salon</label>
          <validation-provider v-slot="{ errors }" rules="min:4">
            <input
              v-model="room"
              type="text"
              name="room"
              placeholder="Nom du salon"
            />
            <span class="error">{{ errors[0] }}</span>
          </validation-provider>
        </div>
        <div class="field">
          <label for="nickname">Votre pseudo</label>
          <validation-provider v-slot="{ errors }" rules="min:4">
            <input
              v-model="nickname"
              type="text"
              name="nickname"
              placeholder="pseudo"
            />
            <span class="error validation">{{ errors[0] }}</span>
          </validation-provider>
        </div>
        <div class="buttonContainer">
          <p :class="{ invisible: !error }" class="error big">{{ error }}</p>
          <button class="button">Rejoindre le salon</button>
        </div>
      </form>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'

extend('min', {
  validate(value, args) {
    return value.length >= args.length
  },
  params: ['length'],
  message: 'Ce champ doit faire au moins 4 caractères',
})

export default Vue.extend({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      room: this.$route.params.room || '',
      nickname: '',
      error: '',
    }
  },
  methods: {
    join() {
      const fd = new FormData()
      fd.append('room', this.room)
      fd.append('nickname', this.nickname)
      axios
        .post('/api/join', fd)
        .then((res: any) => {
          if (res.data === 'ok') {
            this.$store.commit('auth/setName', this.nickname)
            this.$router.push(`/room/${this.room.replace(' ', '-')}`)
          } else {
            this.error = res.data
          }
        })
        .catch((error: string) => {
          this.error = error
        })
    },
  },
})
</script>

<style lang="scss" scoped>
form {
  height: 500px;
  width: calc(100% - 20px);
  padding: 0 10px;
  max-width: 500px;
  margin: 25px auto 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  div {
    width: 100%;
    input {
      width: calc(100% - 16px);
      margin-top: 5px;
    }
  }
}

.field {
  position: relative;
}
.validation {
  position: absolute;
  top: 65px;
}

.buttonContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  .big {
    font-size: 20px;
    margin-bottom: 10px;
  }
  .invisible {
    visibility: hidden;
    height: 24px;
  }
}
</style>
