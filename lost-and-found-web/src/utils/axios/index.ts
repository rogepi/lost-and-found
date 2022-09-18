import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import { showMessage } from './status'
import { ILogin, IResponse } from './type'

// 如果请求话费了超过 `timeout` 的时间，请求将被中断
axios.defaults.timeout = 5000
// 表示跨域请求时是否需要使用凭证
axios.defaults.withCredentials = false
// axios.defaults.headers.common['token'] =  AUTH_TOKEN
// 允许跨域
axios.defaults.headers.post['Access-Control-Allow-Origin-Type'] = '*'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/api/',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  transformRequest: [
    (data) => {
      data = JSON.stringify(data)
      return data
    },
  ],
})

// axios实例拦截响应
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const status = response.status
    let msg = ''
    if (status < 200 || status >= 300) {
      msg = showMessage(status)
      if (typeof response.data === 'string') {
        response.data = { msg }
      } else {
        response.data.msg = msg
      }
    }
    return response
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.log('repeated request: ' + error.message)
    } else {
      // handle error code
      // 错误抛到业务代码
      error.data = {}
      error.data.msg = '请求超时或服务器异常，请检查网络或联系管理员！'
      ElMessage.error(error.data.msg)
    }
    return Promise.reject(error)
  }
)

// axios实例拦截请求
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // const { user } = store.state
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

export default axiosInstance
/**
 * @description: 用户登录案例
 * @params {ILogin} params
 * @return {Promise}
 */

export const login = async (params: ILogin) => {
  let result
  await axiosInstance.post('user/login', params).then((res) => (result = res))
  return result
}

export const forget = async (params) => {
  let result
  await axiosInstance.post('user/forget', params).then((res) => (result = res))
  return result
}

export const register = async (params) => {
  let result
  await axiosInstance.post('user', params).then((res) => (result = res))
  return result
}

export const getInfo = async (id: string) => {
  let result
  await axiosInstance.get(`user/${id}`).then((res) => (result = res))
  return result
}

export const getUserList = async (query) => {
  let result
  await axiosInstance.get(`user?${query}`).then((res) => (result = res))
  return result
}

export const updateInfo = async (id, params) => {
  let result
  await axiosInstance.patch(`user/${id}`, params).then((res) => (result = res))
  return result
}

export const getAvatar = async (id) => {
  let result
  await axiosInstance.get(`user/avatar/${id}`).then((res) => (result = res))
  return result
}

export const getItemList = async (query) => {
  let result
  await axiosInstance.get(`item?${query}`).then((res) => (result = res))
  return result
}

export const getItem = async (id) => {
  let result
  await axiosInstance.get(`item/${id}`).then((res) => (result = res))
  return result
}

export const getItemListByUser = async (id) => {
  let result
  await axiosInstance.get(`item/user/${id}`).then((res) => (result = res))
  return result
}

export const deleteItem = async (id) => {
  let result
  await axiosInstance.delete(`comment/item/${id}`).then()
  await axiosInstance.delete(`item/${id}`).then((res) => {
    result = res
  })
  return result
}

export const updateItem = async (id, params) => {
  let result
  await axiosInstance.patch(`item/${id}`, params).then((res) => (result = res))
  return result
}

export const createComment = async (params) => {
  let result
  await axiosInstance.post('comment', params).then((res) => (result = res))
  return result
}

export const getCommentById = async (id) => {
  let result
  await axiosInstance.delete
  await axiosInstance.get(`comment/item/${id}`).then((res) => (result = res))
  return result
}

export const deleteComment = async (id) => {
  let result
  await axiosInstance.delete(`comment/${id}`).then()
  return result
}
