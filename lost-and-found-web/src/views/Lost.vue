<script setup lang="ts">
import { getItemList } from '@/utils/axios'
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Search,
  DArrowRight,
  DArrowLeft,
} from '@element-plus/icons-vue'
import { Item } from '@/types/item'
import { ElMessage } from 'element-plus'

const state = reactive({
  data: [] as Item[],
  count: 0,
})
const pageNum = ref(1)
const maxNum = ref()
const getList = (n: number) => {
  state.data.length = 0
  getItemList(
    `type="失物招领"&pageNum=${n}&pageSize=12${
      selectValue.value != '' ? `&state='${selectValue.value}'` : ''
    }${search.value != '' ? `&key=${search.value}` : ''}`
  ).then((res: any) => {
    maxNum.value = Math.ceil(res.data.data.count / 12)
    state.count = res.data.data.count
    for (let item of res.data.data.list) {
      state.data.push({
        id: item.id,
        type: item.type,
        title: item.title,
        place: item.place,
        time: item.time,
        description: item.description,
        state: item.state,
        photoPath: item.photoPath,
        createTime: item.createTime,
      })
    }
    console.log(state.data)
    console.log(state.count)
  })
}

const next = () => {
  if (pageNum.value == maxNum.value) {
    ElMessage.info('当前已经是最后一页了')
  } else {
    getList(++pageNum.value)
  }
}
const back = () => {
  if (pageNum.value == 1) {
    ElMessage.info('当前已经是第一页了')
  } else {
    getList(--pageNum.value)
  }
}

onMounted(() => {
  getList(1)
})

// 选择器
const search = ref('')
const selectValue = ref('')
const options = [
  { label: '所有物品', value: '' },
  { label: '未领取', value: '未领取' },
  { label: '已领取', value: '已领取' },
]

const searchHandle = () => {
  getList(pageNum.value)
}
</script>
<template>
  <div class="w-[1125px] box-border">
    <div class="flex pb-4">
      <el-input class="w-50 mr-4" placeholder="物品名称" v-model="search" />
      <el-select v-model="selectValue" class="mr-4" placeholder="所有物品">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button :icon="Search" @click="searchHandle" />
    </div>
    <div class="bg-[#e9eef3] p-10 pb-1">
      <div class="flex justify-between mb-5">
        <div class="flex items-center">
          <el-icon size="30" class="mr-1">
            <box />
          </el-icon>
          <span class="text-xl">失物招领</span>
        </div>
      </div>
      <el-row class="mb-10 ml-9">
        <el-col
          class="m-4"
          v-for="(item, index) in state.data"
          :key="index"
          :span="7"
          ><LostCard :carddata="item"
        /></el-col>
      </el-row>

      <div class="mt-2 text-center">
        <span class="float-left ml-3 text-sm"> 共{{ state.count }}条记录 </span>
        <el-button @click="getList(1)" :icon="DArrowLeft" />
        <el-button @click="back" :icon="ArrowLeft" />
        <el-button
          @click="getList((pageNum = item))"
          v-for="item in maxNum"
          :key="item"
          >{{ item }}</el-button
        >
        <el-button @click="next" :icon="ArrowRight" />
        <el-button @click="getList(maxNum)" :icon="DArrowRight" />
      </div>
    </div>
  </div>
</template>
