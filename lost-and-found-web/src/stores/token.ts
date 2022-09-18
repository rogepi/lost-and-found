import { getAvatar } from './../utils/axios/index'
import { getInfo } from '@/utils/axios'

export const useTokenStore = defineStore('token', {
  state: () => {
    return {
      isLogin: false,
      userId: '',
      role: '',
      nickname: '',
      avatarPath: '',
    }
  },

  actions: {
    login() {
      localStorage.setItem('userId', this.userId)
      localStorage.setItem('role', this.role)
      localStorage.setItem('nickname', this.nickname)
      localStorage.setItem('avatarPath', this.avatarPath)
    },
    logOut() {
      this.userId = ''
      localStorage.removeItem('userId')
      localStorage.removeItem('role')
      localStorage.removeItem('nickname')
      localStorage.removeItem('avatarPath')
    },
    getUserId() {
      const storage = localStorage.getItem('userId')
      if (this.userId == '' && storage != null) this.userId = storage
      return this.userId
    },
    getName() {
      const storage = localStorage.getItem('nickname')
      if (this.nickname == '' && storage != null) this.nickname = storage
      return this.nickname
    },
    getAvatarPath() {
      getAvatar(this.getUserId()).then(
        (res: any) => (this.avatarPath = res.data.data)
      )
      return this.avatarPath
    },
    setAvatarPath(path: string) {
      this.avatarPath = path
      localStorage.setItem('avatarPath', path)
    },
    isLogin() {
      if (this.getUserId()) return true
      else return false
    },
    isAdmin() {
      const storage = localStorage.getItem('role')
      const _role = this.role ? this.role : storage
      if (_role == 'admin') return true
      else return false
    },
    getUserInfo() {
      return getInfo(this.userId)
    },
  },
})
