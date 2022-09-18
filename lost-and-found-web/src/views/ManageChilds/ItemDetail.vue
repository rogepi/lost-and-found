<script setup lang="ts">
import {
  deleteComment,
  getCommentById,
  getItem,
  updateItem,
} from '@/utils/axios'
import { IComment, ItemDeatail } from '@/types/item'

const route = useRoute()
const router = useRouter()
const state = reactive({
  data: {} as ItemDeatail,
  comments: [] as IComment[],
})

const getData = () => {
  getItem(route.query.id).then((res: any) => {
    console.log(res)
    state.data = res.data.data
  })
  getCommentById(route.query.id).then((res: any) => {
    console.log(res)
    state.comments = res.data.data.list
  })
}

onMounted(() => {
  getData()
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
    getItem(route.query.id).then((res: any) => {
      console.log(res)
      state.data = res.data.data
    })
  })
}
const back = () => {
  router.push({ name: 'itemManage' })
}

const handleDelete = (index: number, row: Comment) => {
  // eslint-disable-next-line no-console
  console.log(index, row)
  ElMessageBox.confirm('确定删除该消息吗？', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      console.log(state.comments[index].id)
      deleteComment(state.comments[index].id).then((res: any) => {
        console.log(res)
        ElMessage({
          type: 'success',
          message: '留言成功删除',
        })
        getData()
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除取消',
      })
    })
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
    <el-form-item label="留言">
      <el-table :data="state.comments">
        <el-table-column type="index" />
        <el-table-column label="用户名" prop="author" />
        <el-table-column label="内容" prop="content" />
        <el-table-column align="right">
          <template #default="scope">
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button @click="onSubmit" type="primary">修改</el-button>
      <el-button @click="back">返回</el-button>
    </el-form-item>
  </el-form>
</template>
