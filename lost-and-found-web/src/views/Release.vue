<script setup lang="ts">
import { useTokenStore } from '@/stores/token'
import axios from 'axios'
import type { ElForm } from 'element-plus'

type FormInstance = InstanceType<typeof ElForm>
const ruleFormRef = ref<FormInstance>()
const router = useRouter()

const form = reactive({
  type: '失物招领',
  title: '',
  place: '',
  time: '',
  contact: '',
  description: '',
})

const label = computed(() => {
  return form.type == '失物招领' ? '拾到' : '遗失'
})

const rules = reactive({
  title: [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
  place: [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
  time: [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
  contact: [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
})

const getFile = () => {
  return document.getElementById('fileInput').files[0]
}

const reset = () => {
  router.go(0)
}
const onSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
      let formData = new FormData()
      formData.append('type', form.type)
      formData.append('title', form.title)
      formData.append('time', form.time)
      formData.append('place', form.place)
      formData.append('contact', form.contact)
      formData.append('description', form.description)
      formData.append('userId', useTokenStore().userId)
      formData.append('file', getFile())
      axios
        .post('api/item', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => {
          ElMessage.success('发布成功')
          router.push({ name: 'releaseMsg' })
          console.log(res)
        })
    } else {
      console.log('error submit!')
      return false
    }
  })
}

onMounted(() => {
  if (useTokenStore().isLogin() == false) {
    ElMessage.error('您当前尚未登录！')
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 2000)
  }
})
</script>
<template>
  <div class="w-[1125px] bg-[#e9eef3] p-10 box-border">
    <el-form
      ref="ruleFormRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="启事类型" prop="type" required>
        <el-radio-group v-model="form.type">
          <el-radio label="失物招领" name="type" />
          <el-radio label="寻物启事" name="type" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="物品名称" prop="title" required>
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="联系方式" prop="contact" required>
        <el-input v-model="form.contact" />
      </el-form-item>
      <el-form-item :label="label + '地点'" prop="place" required>
        <el-input v-model="form.place" />
      </el-form-item>
      <el-form-item :label="label + '时间'" prop="time" required>
        <el-col :span="11">
          <el-date-picker
            v-model="form.time"
            type="datetime"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="标签">
        <el-radio-group>
          <el-radio label="钥匙" name="type" />
          <el-radio label="书本" name="type" />
          <el-radio label="雨伞" name="type" />
          <el-radio label="其他" name="type" />
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="物品描述" prop="description" required>
        <el-input v-model="form.description" />
      </el-form-item>
      <el-form-item class="flex" label="附加图片">
        <input
          class="file"
          type="file"
          id="fileInput"
          ref="fileInt"
          @change="getFile"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(ruleFormRef)">
          发布
        </el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
