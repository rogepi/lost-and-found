<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useHeaderStore } from './stores/header'
import { useTokenStore } from './stores/token'

const router = useRouter()
const route = useRoute()
const header = useHeaderStore()
header.show()
const token = useTokenStore()

// 默认头像
const circleUrl = computed(() => useTokenStore().getAvatarPath())

const activeIndex = computed(() => {
  return '/' + route.path.split('/')[1]
})

// 菜单列表
const menuList = [
  { name: '首页', indexPath: '/' },
  {
    name: '失物招领',
    indexPath: '/lost',
  },
  {
    name: '寻物启事',
    indexPath: '/found',
  },
  {
    name: '发布启事',
    indexPath: '/release',
  },
  {
    name: '个人中心',
    indexPath: '/person',
  },
  {
    name: '关于我们',
    indexPath: '/about',
  },
]

// 跳转登录页
const toLogin = () => {
  header.hidden()
  router.push({ name: 'login' })
}

const show = () => {
  ElMessage.info(`当前登录用户为 ${useTokenStore().getName()}`)
}

// 注销
const logOut = () => {
  token.logOut()
  toLogin()
}
</script>

<template>
  <el-scrollbar height="100vh" always>
    <div class="layout">
      <el-container>
        <!-- header容器 -->
        <el-header v-if="header.isShow" class="flex justify-center">
          <el-row class="h-full min-w-screen-lg">
            <el-col :span="4">
              <div class="h-full flex">
                <span
                  class="text-2xl cursor-pointer pt-3"
                  @click="router.push({ name: 'home' })"
                  >失物招领</span
                >
              </div>
            </el-col>
            <el-col :span="18">
              <el-menu mode="horizontal" :default-active="activeIndex" router>
                <el-menu-item
                  v-for="(item, index) in menuList"
                  :key="index"
                  :index="item.indexPath"
                  >{{ item.name }}</el-menu-item
                >
                <el-menu-item v-if="token.isAdmin()" index="/manage"
                  >管理数据</el-menu-item
                >
              </el-menu>
            </el-col>
            <el-col :span="2">
              <div class="h-full flex pt-3">
                <el-button
                  type="primary"
                  @click="toLogin"
                  v-if="!token.isLogin()"
                >
                  登录/注册
                </el-button>
                <div class="block" v-else>
                  <el-dropdown>
                    <el-avatar :size="35" :src="circleUrl"></el-avatar>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="show">{{
                          useTokenStore().getName()
                        }}</el-dropdown-item>
                        <el-dropdown-item @click="logOut()"
                          >注销</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-header>

        <!-- main容器 -->
        <el-main class="flex justify-center">
          <div class="h-full min-h-4xl">
            <router-view />
          </div>
        </el-main>

        <!-- footer -->
        <el-footer class="flex justify-center">
          <div class="w-[700px] mt-4 pb-2 flex justify-around">
            <div>
              <img src="@/assets/images/logo.png" alt="" />
            </div>
            <div>
              <p class="text-[#939393] text-xs">
                失物招领平台<br />联系电话：010-23123123<br />地址：XX省XX市XX区<br />豫公网安备
                41102402022XXX号
              </p>
            </div>
          </div>
        </el-footer>
      </el-container>
    </div>
  </el-scrollbar>
</template>

<style lang="scss">
:root {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  color: var(--el-text-color-primary);
}
body {
  margin: 0;
  padding: 0;
}

.el-header {
  border-bottom: 1px solid var(--el-border-color-base);
  .el-menu {
    border-bottom: none;
  }
}

.el-footer {
  border-top: 1px solid var(--el-border-color-base);
}
</style>
