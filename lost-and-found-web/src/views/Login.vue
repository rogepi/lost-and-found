<script setup lang="ts">
import { useHeaderStore } from '@/stores/header'
import { useTokenStore } from '@/stores/token'
import { login, register } from '@/utils/axios'
import { ElMessage } from 'element-plus'
import type { ElForm } from 'element-plus'

const router = useRouter()

// 登录方法
const loginMethod = ref(true)
// 账户密码登录
const inputData = reactive({
  username: '',
  password: '',
})
const loginHandler = () => {
  login({ username: inputData.username, password: inputData.password }).then(
    (res: any) => {
      const status = res.data.data.status
      console.log(status)
      if (status == 1) {
        ElMessage.error('用户名不存在')
      } else if (status == 2) {
        ElMessage.error('密码不正确')
      } else {
        ElMessage.success('登录成功')
        useTokenStore().userId = res.data.data.userId
        useTokenStore().role = res.data.data.role
        useTokenStore().nickname = res.data.data.nickname
        useTokenStore().avatarPath = res.data.data.avatarPath
        useTokenStore().login()
        router.push({ name: 'home' })
      }
    }
  )
}

// 切换登录和注册
const isLogin = ref(true)
const change = () => {
  isLogin.value = !isLogin.value
}

// 注册数据
type FormInstance = InstanceType<typeof ElForm>
const registDataRef = ref<FormInstance>()
const registData = reactive({
  username: '',
  nickname: '',
  sex: '',
  phone: '',
  password: '',
  repassword: '',
  question: '',
  answer: '',
})
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('该项目不能为空'))
  } else if (value !== registData.password) {
    callback(new Error('两次密码不匹配'))
  } else {
    callback()
  }
}
const rules = reactive({
  username: [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
  nickname: [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
  sex: [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
  phone: [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
  repassword: [{ validator: validatePass, trigger: 'blur' }],
  question: [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
  answer: [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
})
// 清空注册信息
watch(isLogin, () => {
  registData.username = ''
  registData.nickname = ''
  registData.sex = ''
  registData.phone = ''
  registData.password = ''
  registData.repassword = ''
  registData.question = ''
  registData.answer = ''
})
const toParams = () => {
  return {
    username: registData.username,
    nickname: registData.nickname,
    sex: registData.sex,
    phone: registData.phone,
    password: registData.password,
    repassword: registData.repassword,
    question: registData.question,
    answer: registData.answer,
  }
}
// 注册方法
const registHandler = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      register(toParams()).then((res: any) => {
        if (res.data.data.status == '1') {
          ElMessage.error('该账户已存在')
        } else {
          ElMessage.success('注册成功')
          change()
        }
      })
    } else {
      console.log('error submit!')
      return false
    }
  })
}

// 导航栏操作
onMounted(() => {
  useHeaderStore().hidden()
})
onUnmounted(() => {
  useHeaderStore().show()
})
</script>
<template>
  <el-container class="flex flex-col items-center">
    <el-header class="flex justify-center">
      <el-row class="h-full min-w-screen-lg">
        <el-col :span="4">
          <div class="h-full flex items-center">
            <span class="text-2xl cursor-pointer">失物招领</span>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="flex justify-center">
      <el-card v-if="isLogin" class="h-85 w-90 mt-20" shadow="always">
        <template #header>
          <div
            class="flex justify-around text-[409eff] font-medium text-xl py-2"
          >
            <span
              :class="{ 'cursor-pointer': true, 'text-gray-300': !loginMethod }"
              @click="loginMethod = true"
              >账号登录</span
            >
          </div>
        </template>
        <el-form>
          <div>
            <el-form-item>
              <el-input
                v-model="inputData.username"
                size="large"
                placeholder="用户名/绑定手机号"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="inputData.password"
                class="my-2"
                size="large"
                placeholder="密码"
                show-password
              />
            </el-form-item>
          </div>
          <el-form-item>
            <div class="w-full flex justify-around">
              <el-button class="h-10 w-1/2" type="primary" @click="loginHandler"
                >登录</el-button
              >
              <el-button class="h-10 w-1/2" type="primary" @click="change"
                >注册</el-button
              >
            </div>
          </el-form-item>
        </el-form>
        <div class="pt-2 w-full text-center text-sm text-[409eff]">
          <span class="cursor-pointer" @click="router.push({ name: 'forget' })"
            >忘记密码?</span
          >
          &nbsp;
          <span class="cursor-pointer" @click="router.push({ name: 'home' })"
            >返回首页</span
          >
        </div>
      </el-card>
      <el-card v-else class="h-140 w-90 mt-20" shadow="always">
        <template #header>
          <div
            class="flex justify-around text-[409eff] font-medium text-xl py-2"
          >
            <span class="cursor-pointer" @click="loginMethod = true"
              >用户注册</span
            >
          </div>
        </template>
        <el-form ref="registDataRef" :model="registData" :rules="rules">
          <el-form-item label="账户" prop="username" required>
            <el-input v-model="registData.username" clearable />
          </el-form-item>
          <el-form-item label="姓名" prop="nickname" required>
            <el-input v-model="registData.nickname" clearable />
          </el-form-item>
          <el-form-item label="性别" prop="sex" required>
            <el-radio-group v-model="registData.sex">
              <el-radio label="男" />
              <el-radio label="女" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="电话" prop="phone" required>
            <el-input v-model="registData.phone" clearable />
          </el-form-item>
          <el-form-item label="密码" prop="password" required>
            <el-input v-model="registData.password" type="password" clearable />
          </el-form-item>
          <el-form-item label="重复" prop="repassword" required>
            <el-input
              v-model="registData.repassword"
              type="password"
              clearable
            />
          </el-form-item>
          <el-form-item label="密保问题" prop="question" required>
            <el-input v-model="registData.question" clearable />
          </el-form-item>
          <el-form-item label="答案" prop="answer" required>
            <el-input v-model="registData.answer" clearable />
          </el-form-item>
          <el-form-item>
            <div class="w-full flex justify-around">
              <el-button
                class="h-10 w-1/2"
                type="primary"
                @click="registHandler(registDataRef)"
                >注册</el-button
              >
              <el-button class="h-10 w-1/2" type="primary" @click="change"
                >返回</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>
