<script lang="ts" setup>
import { useTokenStore } from '@/stores/token'
import { formatDateTime } from '@/utils'
import { deleteItem, getItemListByUser } from '@/utils/axios'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { Item } from '@/types/item'

const state = reactive({
  tableData: [] as Item[],
})

const search = ref('')
const filterTableData = computed(() =>
  state.tableData.filter(
    (data) =>
      !search.value ||
      data.title.toLowerCase().includes(search.value.toLowerCase())
  )
)
const filterTag = (value: string, row: Item) => {
  return row.state === value
}

const router = useRouter()

const getData = () => {
  if (useTokenStore().isLogin() == false) {
    ElMessage.error('您当前尚未登录！')
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 2000)
  } else {
    getItemListByUser(useTokenStore().userId).then((res: any) => {
      // console.log(res)

      state.tableData = res.data.data.list
    })
  }
}

onMounted(() => {
  if (useTokenStore().isLogin() == false) {
    ElMessage.error('您当前尚未登录！')
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 2000)
  } else {
    getItemListByUser(useTokenStore().userId).then((res: any) => {
      // console.log(res)

      state.tableData = res.data.data.list
      // state.tableData.map((a) => (a.time = a.time.toString().slice(0, 8))
    })
  }
})
const handleEdit = (index: number, row: Item) => {
  // eslint-disable-next-line no-console
  // console.log(index, row)
  router.push({
    name: 'msgEdit',
    query: { id: state.tableData[index].id },
  })
}
const handleDelete = (index: number, row: Item) => {
  // eslint-disable-next-line no-console
  console.log(index, row)
  ElMessageBox.confirm('确定删除该消息吗？', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      console.log(state.tableData[index].id)
      deleteItem(state.tableData[index].id).then((res) => {
        console.log(res)
        ElMessage({
          type: 'success',
          message: '消息成功删除',
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
  <el-table :data="filterTableData" style="width: 100%">
    <el-table-column type="index" />
    <el-table-column label="发布时间" sortable>
      <template #default="scope">
        {{ formatDateTime(scope.row.createTime) }}
      </template>
    </el-table-column>
    <el-table-column label="时间" sortable>
      <template #default="scope">
        {{ formatDateTime(scope.row.time) }}
      </template>
    </el-table-column>
    <el-table-column label="物品名" prop="title" />
    <el-table-column label="地点" prop="place" />
    <el-table-column
      prop="state"
      label="状态"
      width="100"
      :filters="[
        { text: '已领取', value: '已领取' },
        { text: '未领取', value: '未领取' },
      ]"
      :filter-method="filterTag"
      filter-placement="bottom-end"
    >
      <template #default="scope">
        <el-tag
          :type="scope.row.state == '已领取' ? 'success' : 'danger'"
          disable-transitions
          >{{ scope.row.state }}</el-tag
        >
      </template>
    </el-table-column>
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="搜索物品" />
      </template>
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button
        >
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>
