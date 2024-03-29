<template>
  <div>
    <validation-observer v-slot="{ handleSubmit }">
      <form action="" @submit.prevent="handleSubmit(submit)">
        <div class="field">
          <label for="room validation">Nom du salon</label>
          <validation-provider v-slot="{ errors }" rules="min:4">
            <input
              v-model="room"
              type="text"
              name="room"
              placeholder="Nom du salon"
              @keydown="preventSpace"
            />
            <span class="error">{{ errors[0] }}</span>
          </validation-provider>
        </div>
        <div class="field">
          <label for="url">URL de la vidéo</label>
          <validation-provider v-slot="{ errors }" rules="youtubeLink">
            <input
              v-model="url"
              type="text"
              name="url"
              placeholder="url de la video"
            />
            <span class="error validation">{{ errors[0] }}</span>
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
        <div>
          <input v-model="permission" type="checkbox" name="permissions" />
          <label for="permissions"
            >Donner le droit à tout le monde de contrôler la vidéo</label
          >
        </div>
        <div class="buttonContainer">
          <p :class="{ invisible: !error }" class="error big">{{ error }}</p>
          <button class="button">Créer le salon</button>
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
    ValidationObserver,
  },
  data() {
    return {
      room: 'test',
      url: 'https://www.youtube.com/watch?v=RjoO6wPAaVI',
      nickname: 'test',
      permission: false,
      error: '',
    }
  },
  methods: {
    preventSpace(event: KeyboardEvent): void {
      if (event.code === 'Space') event.preventDefault()
    },
    submit(): void {
      const fd = new FormData()
      fd.append('room', this.room)
      fd.append('url', this.url)
      fd.append('nickname', this.nickname)
      fd.append('permissions', this.permission.toString())
      axios
        .post('/api/create', fd)
        .then((res: any) => {
          if (res.data === 'salon créé') {
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
    input[type='text'] {
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
