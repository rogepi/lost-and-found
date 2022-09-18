<script setup lang="ts">
import { formatDateTime } from '@/utils'
import { Item } from '@/views/Home.vue'

// 路由功能
const router = useRouter()
const toItemPage = (query: any) =>
  router.push({
    name: 'item',
    query: {
      id: query,
    },
  })

const state = defineProps<{ carddata: Item }>()
const label = computed(() => {
  return state.carddata.type == '失物招领' ? '拾到' : '遗失'
})
</script>
<template>
  <el-card :body-style="{ padding: '0px' }">
    <el-image
      :src="state.carddata.photoPath"
      class="w-full h-50 block cursor-pointer box-border"
      @click="toItemPage(state.carddata.id)"
    />
    <div class="p-3">
      <div class="mb-2 flex justify-between items-center">
        <span class="text-gray-500 text-sm truncate"
          >发布时间：{{ formatDateTime(state.carddata.createTime) }}
        </span>
        <el-tag
          :type="state.carddata.state == '已领取' ? 'success' : 'danger'"
          disable-transitions
          >{{ state.carddata.state }}</el-tag
        >
      </div>
      <div class="flex justify-between items-center">
        <span
          class="cursor-pointer truncate"
          @click="toItemPage(state.carddata.id)"
          >物品名称：{{ state.carddata.title }}</span
        >
        <el-button
          class="text-gray-500"
          size="small"
          @click="toItemPage(state.carddata.id)"
          >留言</el-button
        >
      </div>
      <div class="my-2 flex justify-between items-center">
        <span class="text-[#39bdff] truncate"
          ><span class="text-black">{{ label }}时间：</span
          >{{ formatDateTime(state.carddata.time) }}</span
        >
      </div>
      <div class="my-2">
        <span class="truncate"
          >{{ label }}地点：{{ state.carddata.place }}</span
        >
      </div>
      <div class="truncate">物品描述：{{ state.carddata.description }}</div>
    </div></el-card
  >
</template>
