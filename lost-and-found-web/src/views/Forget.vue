<script setup lang="ts">
import { useHeaderStore } from '@/stores/header'
import { ElMessage } from 'element-plus'
import type { ElForm } from 'element-plus'
import { forget, getUserList, updateInfo } from '@/utils/axios'
import { hashSync } from 'bcryptjs'

const router = useRouter()

const state = reactive({
  data: {
    username: '',
    id: '',
    question: '',
    answer: '',
    inputAnswer: '',
    password: '',
    repassword: '',
  },
  status: 1,
})

type FormInstance = InstanceType<typeof ElForm>
const TableRef = ref<FormInstance>()
const next = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      if (state.status == 1) {
        forget({ username: state.data.username }).then((res: any) => {
          console.log(res.data)
          if (res.data.data.status == 2) {
            state.data.id = res.data.data.id
            state.data.question = res.data.data.question
            state.data.answer = res.data.data.answer
            state.status++
          } else {
            ElMessage.error('用户名或手机号错误')
          }
        })
      } else if (state.status == 2) {
        if (state.data.answer == state.data.inputAnswer) {
          ElMessage.success('验证成功')
          state.data.inputAnswer = ''
          state.status++
        } else {
          ElMessage.error('答案不一致')
        }
      } else if (state.status == 3) {
        updateInfo(state.data.id, {
          password: hashSync(state.data.password),
        }).then((res: any) => console.log(res.data))
        ElMessage.success('修改成功')
        router.push({ name: 'login' })
      }
    } else {
      return false
    }
  })
}
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('该项目不能为空'))
  } else if (value !== state.data.password) {
    callback(new Error('两次密码不匹配'))
  } else {
    callback()
  }
}
const rules = reactive({
  username: [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
  inputAnswer: [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
  repassword: [{ validator: validatePass, trigger: 'blur' }],
})

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
      <el-card class="h-85 w-100 mt-20" shadow="always">
        <template #header>
          <div
            class="flex justify-around text-[409eff] font-medium text-xl py-2"
          >
            <span :class="{ 'cursor-pointer': true }">忘记密码</span>
          </div>
        </template>
        <div>
          <el-form ref="TableRef" :model="state.data" :rules="rules">
            <div v-if="state.status == 1">
              <el-form-item label="用户名/手机号" prop="username" required>
                <el-input v-model="state.data.username" clearable />
              </el-form-item>
            </div>
            <div v-if="state.status == 2">
              <el-form-item label="密保问题">{{
                state.data.question
              }}</el-form-item>
              <el-form-item label="答案" prop="inputAnswer" required>
                <el-input v-model="state.data.inputAnswer" clearable />
              </el-form-item>
            </div>
            <div v-if="state.status == 3">
              <el-form-item label="密码" prop="password" required>
                <el-input
                  v-model="state.data.password"
                  type="password"
                  clearable
                />
              </el-form-item>
              <el-form-item label="重复" prop="repassword" required>
                <el-input
                  v-model="state.data.repassword"
                  type="password"
                  clearable
                />
              </el-form-item>
            </div>
            <el-form-item>
              <div class="w-full flex justify-around">
                <el-button
                  @click="state.status--"
                  :disabled="state.status == 1"
                  class="h-10 w-1/3"
                  type="primary"
                  >上一步</el-button
                >
                <el-button
                  @click="next(TableRef)"
                  class="h-10 w-1/3"
                  type="primary"
                  >下一步</el-button
                >
              </div>
            </el-form-item>
          </el-form>
          <div class="pt-2 w-full text-center text-sm text-[409eff]">
            <span class="cursor-pointer" @click="router.push({ name: 'login' })"
              >返回登录页</span
            >
          </div>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>
