<script lang="ts" setup>
import { deleteItem, getItemList } from '@/utils/axios'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  ArrowRight,
  DArrowLeft,
  DArrowRight,
} from '@element-plus/icons-vue'
import { arrtrans, formatDateTime } from '@/utils'
import { Item } from '@/types/Item'

const state = reactive({
  data: [] as Item[][],
  count: 0,
})

const filterTableData = reactive({
  data: [] as Item[][],
  count: 0,
})

const pageNum = ref(1)
const maxNum = computed(() => Math.ceil(state.count / 10))

const search = ref('')
watchEffect(() => {
  let data_ = [] as Item[][]
  let copy: Item[][] = JSON.parse(JSON.stringify(state.data))
  console.log(state.data)
  for (let i = 0; i < maxNum.value; i++) {
    data_[i] = copy[i].filter(
      (item) =>
        !search.value ||
        item.title.toLowerCase().includes(search.value.trim().toLowerCase())
    )
  }

  filterTableData.count = data_.flat(Infinity).length
  filterTableData.data = arrtrans(data_.flat(Infinity))
})

const filterTag = (value: string, row: Item) => {
  return row.state === value
}

const router = useRouter()

const getData = (p: number = 1) => {
  getItemList(`pageNum=${p}&pageSize=0`).then((res: any) => {
    // console.log(res)
    state.count = res.data.data.count
    state.data = arrtrans(res.data.data.list)
    console.log(state.data)
    // state.tableData.map((a) => (a.time = a.time.toString().slice(0, 8))
  })
}

onMounted(() => {
  getData()
})
const handleEdit = (index: number, row: Item) => {
  // eslint-disable-next-line no-console
  // console.log(Math.floor(index / 10 + pageNum.value - 1))
  // console.log(index % 10)
  // console.log()
  router.push({
    name: 'itemDetail',
    query: {
      id: state.data[Math.floor(index / 10 + pageNum.value - 1)][index % 10].id,
    },
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
      // console.log(state.data[index / 10][index].id)
      deleteItem(
        state.data[Math.floor(index / 10 + pageNum.value - 1)][index % 10].id
      ).then((res) => {
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

const next = () => {
  if (pageNum.value == maxNum.value) {
    ElMessage.info('当前已经是最后一页了')
  } else {
    pageNum.value++
  }
}
const back = () => {
  if (pageNum.value == 1) {
    ElMessage.info('当前已经是第一页了')
  } else {
    pageNum.value--
  }
}
</script>
<template>
  <el-table lazy :data="filterTableData.data[pageNum - 1]" style="width: 100%">
    <el-table-column type="index">
      <template #default="scope">
        {{ (pageNum - 1) * 10 + scope.$index + 1 }}
      </template></el-table-column
    >
    <el-table-column label="日期" prop="time" sortable>
      <template #default="scope">
        {{ formatDateTime(scope.row.time) }}
      </template>
    </el-table-column>
    <el-table-column label="物品名" prop="title" />
    <el-table-column label="地址" prop="place" />
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
          >详情</el-button
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
  <div class="mt-2 text-center">
    <span class="float-left ml-3 text-sm">
      共{{ filterTableData.count }}条记录
    </span>
    <el-button @click="pageNum = 1" :icon="DArrowLeft" />
    <el-button @click="back" :icon="ArrowLeft" />
    <el-button @click="pageNum = item" v-for="item in maxNum" :key="item">{{
      item
    }}</el-button>
    <el-button @click="next" :icon="ArrowRight" />
    <el-button @click="pageNum = maxNum" :icon="DArrowRight" />
  </div>
</template>
