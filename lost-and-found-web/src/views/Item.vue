<script setup lang="ts">
import { useTokenStore } from '@/stores/token'
import { createComment, getCommentById, getItem } from '@/utils/axios'
import { ChatLineRound } from '@element-plus/icons-vue'
import { Item, ItemDeatail, IComment } from '@/types/item'
import { formatDateTime } from '@/utils'

// 默认头像
const circleUrl =
  'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const message = ref('')
const route = useRoute()
let state = reactive({
  data: {
    contact: '',
    createTime: new Date(),
    description: '',
    id: 1,
    photoPath: '',
    place: '',
    state: '',
    time: new Date(),
    title: '',
    type: '',
    updateTime: new Date(),
  },
  comments: [] as IComment[],
})

const label = computed(() => {
  return state.data.type == '失物招领' ? '拾到' : '遗失'
})

const onSubmit = () => {
  createComment({
    userId: useTokenStore().userId,
    itemId: route.query.id,
    content: message.value,
  }).then((res) => {})
  message.value = ''
  getComments()
}

const getComments = () => {
  getCommentById(route.query.id).then((res: any) => {
    state.comments = res.data.data.list
  })
}

onMounted(() => {
  getItem(route.query.id).then((res: any) => {
    state.data = res.data.data
  })
  getCommentById(route.query.id).then((res: any) => {
    state.comments = res.data.data.list
  })
})
</script>

<template>
  <div class="w-[1125px] box-border bg-[#e9eef3] p-10">
    <div class="min-h-[350px] flex">
      <div class="w-[500px] mr-[12px] box-border">
        <el-image
          class="w-full h-80"
          :fit="'contain'"
          :src="state.data.photoPath"
        />
      </div>
      <div class="w-[512px]">
        <div class="h-15">
          <div>物品名称</div>
          <div class="text-xl font-bold flex items-center">
            <span>{{ state.data.title }}</span>
            <el-tag
              :type="state.data.state == '已领取' ? 'success' : 'danger'"
              disable-transitions
              >{{ state.data.state }}</el-tag
            >
          </div>
        </div>
        <div class="h-15">
          <div>发布时间</div>
          <div class="text-[#39bdff] text-lg font-bold">
            {{ formatDateTime(state.data.createTime) }}
          </div>
        </div>
        <div class="h-15">
          <div>{{ label }}时间</div>
          <div class="text-[#39bdff] text-lg font-bold">
            {{ formatDateTime(state.data.time) }}
          </div>
        </div>
        <div class="h-15">
          <div>地点</div>
          <div class="text-lg font-bold">{{ state.data.place }}</div>
        </div>
        <div class="h-15">
          <div>联系方式</div>
          <div class="text-lg font-bold">{{ state.data.contact }}</div>
        </div>
        <div>
          <div>描述</div>
          <div class="text-lg font-bold">
            {{ state.data.description }}
          </div>
        </div>
      </div>
    </div>
    <div class="mt-10">
      <div class="flex items-center">
        <el-icon size="30" class="mr-1">
          <chat-line-round />
        </el-icon>
        <span class="text-xl">留言</span>
      </div>
      <div class="mt-3">
        <el-input v-model="message" type="textarea" />
        <el-button class="mt-2 float-right" type="primary" @click="onSubmit"
          >发布</el-button
        >
      </div>
      <div class="mt-12">
        <div v-for="(item, index) in state.comments" :key="index">
          <el-divider />
          <div class="flex">
            <div class="p-2">
              <img
                :src="item.avatar ? item.avatar : circleUrl"
                class="h-8 w-8 rounded-full"
                alt="avatar"
              />
            </div>
            <div class="p-1">
              <div class="text-gray-400">
                {{ item.author }}&nbsp;&nbsp;&nbsp;{{
                  formatDateTime(item.createTime)
                }}
              </div>
              <div class="text-lg font-medium">{{ item.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-divider {
  margin-top: 5px;
  margin-bottom: 10px;
}
</style>
