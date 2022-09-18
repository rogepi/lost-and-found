<script lang="ts" setup>
import { getUserList } from '@/utils/axios'
import {
  ArrowLeft,
  ArrowRight,
  DArrowLeft,
  DArrowRight,
} from '@element-plus/icons-vue'

import { User } from '@/types/user'

const state = reactive({
  data: [] as User[][],
  count: 0,
})

const pageNum = ref(1)
const maxNum = computed(() => Math.ceil(state.count / 10))
const filterTableData = reactive({ data: [] as User[][], count: 0 })
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

const arrtrans = (baseArray: any[]) => {
  let len = baseArray.length
  let n = 10
  let lineNum = len % n === 0 ? len / n : Math.floor(len / n + 1)
  let res = []
  for (let i = 0; i < lineNum; i++) {
    let temp = baseArray.slice(i * n, i * n + n)
    res.push(temp)
  }
  return res
}

const getData = (pageNum: number = 1, pageSize: number = 0) => {
  getUserList(`pageNum=${pageNum}&pageSize=${pageSize}&role="user"`).then(
    (res: any) => {
      state.count = res.data.data.count
      let usernames = res.data.data.list.map(
        (a: { username: any }) => a.username
      )
      let nicknames = res.data.data.list.map(
        (a: { nickname: any }) => a.nickname
      )
      let sexs = res.data.data.list.map((a: { sex: any }) => a.sex)
      let phones = res.data.data.list.map((a: { phone: any }) => a.phone)
      let _data = [] as User[]
      for (let i = 0; i < usernames.length; i++) {
        // if (res.data.data.list[i].role == 'user')
        _data.push({
          username: usernames[i],
          nickname: nicknames[i],
          sex: sexs[i],
          phone: phones[i],
        })
      }
      state.data = arrtrans(_data)
    }
  )
}

onMounted(() => {
  getData(1, 0)
})

const select = ref<'username' | 'nickname' | 'phone'>('nickname')
const search = ref('')
const filterSex = (value: string, row: User) => {
  return row.sex === value
}

watchEffect(() => {
  let data_ = [] as User[][]
  let copy: User[][] = JSON.parse(JSON.stringify(state.data))
  console.log(copy)
  for (let i = 0; i < maxNum.value; i++) {
    data_[i] = copy[i].filter(
      (item) =>
        !search.value ||
        item[select.value]
          .toLowerCase()
          .includes(search.value.trim().toLowerCase())
    )
  }

  filterTableData.count = data_.flat(Infinity).length
  console.log(arrtrans(data_.flat(Infinity)))
  filterTableData.data = arrtrans(data_.flat(Infinity))
})
</script>
<template>
  <div class="flex">
    <el-select v-model="select" size="small" class="w-25 mr-3">
      <el-option label="姓名" value="nickname" />
      <el-option label="账号" value="username" />
      <el-option label="电话号码" value="phone" />
    </el-select>
    <el-input
      v-model="search"
      size="small"
      placeholder="关键字"
      class="w-1/4 mr-3"
    />
  </div>

  <el-table :data="filterTableData.data[pageNum - 1]" style="width: 100%">
    <el-table-column type="index">
      <template #default="scope">
        {{ (pageNum - 1) * 10 + scope.$index + 1 }}
      </template>
    </el-table-column>
    <el-table-column label="账号" prop="username" />
    <el-table-column label="姓名" prop="nickname" />
    <el-table-column
      label="性别"
      prop="sex"
      :filters="[
        { text: '男', value: '男' },
        { text: '女', value: '女' },
      ]"
      :filter-method="filterSex"
    />
    <el-table-column label="电话号码" prop="phone" />
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
