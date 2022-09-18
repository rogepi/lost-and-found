<script setup lang="ts">
const menuList = [
  { label: '发布消息', index: '/person/releaseMsg' },
  {
    label: '修改资料',
    index: '/person/ChangeInfo',
  },
  {
    label: '修改密码',
    index: '/person/ChangePwd',
  },
]

const route = useRoute()
const activeIndex = computed(() => {
  return route.path
})
</script>
<template>
  <div class="w-[1125px] bg-[#e9eef3] box-border">
    <el-container class="p-5">
      <el-aside class="w-50 mr-5">
        <el-menu :default-active="activeIndex" router>
          <el-menu-item
            v-for="(item, index) in menuList"
            :key="index"
            :index="item.index"
            >{{ item.label }}</el-menu-item
          >
        </el-menu>
      </el-aside>
      <el-main class="bg-white">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.el-menu-item {
  text-align: center;
}
.el-input {
  width: 50%;
}
</style>
