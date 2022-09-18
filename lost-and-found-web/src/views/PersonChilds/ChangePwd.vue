<script setup lang="ts">
import { useTokenStore } from '@/stores/token'
import type { ElForm } from 'element-plus'
import { compareSync, hashSync } from 'bcryptjs'

import { updateInfo } from '@/utils/axios'
import router from '@/router'

type FormInstance = InstanceType<typeof ElForm>
const ruleFormRef = ref<FormInstance>()

const state = reactive({
  oldpass: '',
  password: '',
  repassword: '',
})

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('该项目不能为空'))
  } else if (value !== state.password) {
    callback(new Error('两次密码不匹配'))
  } else {
    callback()
  }
}
const rules = reactive({
  oldpass: [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
  repassword: [{ validator: validatePass, trigger: 'blur' }],
})

const ClickHandler = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
      useTokenStore()
        .getUserInfo()
        .then((res:any) => {
          console.log(res.data.data)
          if (!compareSync(state.oldpass, res.data.data.password)) {
            ElMessage.error('旧密码不正确')
          } else {
            updateInfo(useTokenStore().userId, {
              password: hashSync(state.password),
            }).then((res_:any) => console.log(res_.data))
            ElMessage.success('修改成功')
            useTokenStore().logOut()
            router.push({ name: 'login' })
          }
        })
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const reset = () => {
  state.oldpass = ''
  state.password = ''
  state.repassword = ''
  ElMessage.info('已重置信息')
}
</script>

<template>
  <el-form label-width="80px" ref="ruleFormRef" :rules="rules" :model="state">
    <el-form-item label="旧密码" prop="oldpass" required>
      <el-input v-model="state.oldpass" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item label="新密码" prop="password" required>
      <el-input v-model="state.password" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item label="重复密码" prop="repassword" required>
      <el-input v-model="state.repassword" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="ClickHandler(ruleFormRef)"
        >提交</el-button
      >
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
