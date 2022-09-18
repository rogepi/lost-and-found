import { IResponse } from './../utils/axios/type'
import axios from '@/utils/axios/index'

interface LoginParams {
  username: string
  password: string
}

   login = (params: ILogin): Promise<IResponse> => {
    return axiosInstance.post('user/login', params).then((res) => res.data)
  }
}
