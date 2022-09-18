<script setup lang="ts">
import { getItem, updateItem } from '@/utils/axios'
import { ItemDeatail } from '@/types/item'

const route = useRoute()
const router = useRouter()
const state = reactive({
  data: {} as ItemDeatail,
})

onMounted(() => {
  getItem(route.query.id).then((res: any) => {
    console.log(res)
    state.data = res.data.data
  })
})

const onSubmit = () => {
  updateItem(route.query.id, {
    title: state.data.title,
    place: state.data.place,
    contact: state.data.contact,
    description: state.data.description,
    state: state.data.state,
  }).then((res) => {
    console.log(res)
    ElMessage.success('修改成功')
    router.push({ name: 'releaseMsg' })
  })
}
const back = () => {
  router.push({ name: 'releaseMsg' })
}
</script>

<template>
  <el-form label-width="80px" class="">
    <el-form-item label="物品名" required>
      <el-input v-model="state.data.title" />
    </el-form-item>
    <el-form-item label="地点" required>
      <el-input v-model="state.data.place" />
    </el-form-item>
    <el-form-item label="联系方式" required>
      <el-input v-model="state.data.contact" />
    </el-form-item>
    <el-form-item label="描述" required>
      <el-input type="textarea" v-model="state.data.description" />
    </el-form-item>
    <el-form-item label="状态" required>
      <el-radio-group v-model="state.data.state">
        <el-radio label="已领取" />
        <el-radio label="未领取" />
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <el-button @click="onSubmit" type="primary">修改</el-button>
      <el-button @click="back">返回</el-button>
    </el-form-item>
  </el-form>
</template>
