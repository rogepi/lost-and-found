<script setup lang="ts">
import { getItemList } from '@/utils/axios'
import { ArrowLeft, ArrowRight, ChatLineRound } from '@element-plus/icons-vue'
import LostContent from './HomeChilds/LostContent.vue'
import FoundContent from './HomeChilds/FoundContent.vue'
import { Item } from '@/types/item'

const state = reactive({
  data: [] as Item[],
})
const pageNum = ref(1)
const maxNum = ref()
const getList = (n: number) => {
  state.data.length = 0
  getItemList(
    `pageNum=${n}&pageSize=6${
      selectValue.value != '' ? `&state='${selectValue.value}'` : ''
    }${search.value != '' ? `&key=${search.value}` : ''}`
  ).then((res: any) => {
    maxNum.value = Math.ceil(res.data.data.count / 6)
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
</script>
<template>
  <div class="w-[1125px] box-border">
    <div class="bg-[#e9eef3] p-10 pb-1 h-[820px]">
      <div class="flex justify-between mb-5">
        <div class="flex items-center">
          <el-icon size="30" class="mr-1">
            <chat-line-round />
          </el-icon>
          <span class="text-xl">最新发布</span>
        </div>
        <div>
          <el-button @click="back" :icon="ArrowLeft" />
          <el-button @click="next" :icon="ArrowRight" />
        </div>
      </div>
      <el-row class="mb-10 ml-9">
        <el-col
          v-for="(o, index) in state.data.length >= 3 ? 3 : state.data.length"
          :key="o"
          :span="7"
          :offset="index == 0 ? 0 : 1"
        >
          <LostCard :carddata="state.data[o - 1]" />
        </el-col>
      </el-row>
      <el-row class="mb-10 ml-9">
        <el-col
          v-for="(o, index) in state.data.length >= 3
            ? state.data.length - 3
            : 0"
          :key="index"
          :span="7"
          :offset="index == 0 ? 0 : 1"
        >
          <LostCard :carddata="state.data[o + 2]" />
        </el-col>
      </el-row>
    </div>
    <LostContent :is-home="true" />
    <FoundContent :is-home="true" />
  </div>
</template>
