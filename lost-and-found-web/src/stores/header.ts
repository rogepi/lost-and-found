export const useHeaderStore = defineStore('header', {
  state: () => {
    return { isShow: true ,hover:''}
  },
  actions: {
    show() {
      this.isShow = true
    },
    hidden() {
      this.isShow = false
    },
    change() {
      this.isShow = !this.isShow
    },
  },
})
