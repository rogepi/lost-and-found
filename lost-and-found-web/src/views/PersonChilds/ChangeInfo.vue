<script setup lang="ts">
import router from '@/router'
import { useTokenStore } from '@/stores/token'
import { getInfo } from '@/utils/axios'
import axios from 'axios'

const state = reactive({
  username: '',
  nickname: '',
  sex: '',
  phone: '',
})
onMounted(() => {
  getInfo(useTokenStore().userId).then((res: any) => {
    console.log(res.data.data)
    state.username = res.data.data.username
    state.nickname = res.data.data.nickname
    state.sex = res.data.data.sex
    state.phone = res.data.data.phone
  })
})
const toParams = () => {
  return {
    username: state.username,
    nickname: state.nickname,
    sex: state.sex,
    phone: state.phone,
  }
}
const getFile = () => {
  return document.getElementById('fileInput').files[0]
}
const ClickHandler = () => {
  let formData = new FormData()
  formData.append('username', state.username)
  formData.append('nickname', state.nickname)
  formData.append('sex', state.sex)
  formData.append('phone', state.phone)
  formData.append('file', getFile())
  axios
    .patch(`/api/user/${useTokenStore().userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => {
      ElMessage.success('修改成功')

      console.log(res)
    })
}

</script>

<template>
  <el-form label-width="80px" class="w-1/2">
    <el-form-item label="账号">
      <el-input v-model="state.username" />
    </el-form-item>
    <el-form-item label="姓名">
      <el-input v-model="state.nickname" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="state.sex">
        <el-radio label="男" />
        <el-radio label="女" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="电话号码">
      <el-input v-model="state.phone" />
    </el-form-item>
    <el-form-item class="flex" label="上传头像">
      <input
        class="file"
        type="file"
        id="fileInput"
        ref="fileInt"
        @change="getFile"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="ClickHandler()">提交</el-button>
    </el-form-item>
  </el-form>
</template>
