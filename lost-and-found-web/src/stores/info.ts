export const useInfoStore = defineStore('info', {
  state: () => {
    return { username: '', nickname: '', sex: '', phone: '' }
  },
})
