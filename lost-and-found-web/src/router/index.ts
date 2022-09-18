import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/lost',
      name: 'lost',
      component: () => import('@/views/Lost.vue'),
    },
    {
      path: '/found',
      name: 'found',
      component: () => import('@/views/Found.vue'),
    },
    {
      path: '/release',
      name: 'release',
      component: () => import('@/views/Release.vue'),
    },
    {
      path: '/person',
      name: 'person',
      component: () => import('@/views/PersonalCenter.vue'),
      redirect: '/person/releaseMsg',
      children: [
        {
          path: '/person/changeInfo',
          name: 'changeInfo',
          component: () => import('@/views/PersonChilds/ChangeInfo.vue'),
        },
        {
          path: '/person/changePwd',
          name: 'changePwd',
          component: () => import('@/views/PersonChilds/ChangePwd.vue'),
        },
        {
          path: '/person/releaseMsg',
          name: 'releaseMsg',
          component: () => import('@/views/PersonChilds/ReleaseMsg.vue'),
        },
        {
          path: '/person/msgEdit',
          name: 'msgEdit',
          component: () => import('@/views/PersonChilds/MsgEdit.vue'),
        },
      ],
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue'),
    },
    {
      path: '/manage',
      name: 'manage',
      component: () => import('@/views/ManagementData.vue'),
      redirect: '/manage/itemManage',
      children: [
        {
          path: '/manage/itemManage',
          name: 'itemManage',
          component: () => import('@/views/ManageChilds/ItemManage.vue'),
        },
        {
          path: '/manage/userManage',
          name: 'userManage',
          component: () => import('@/views/ManageChilds/UserManage.vue'),
        },
        {
          path: '/manage/adminManage',
          name: 'adminManage',
          component: () => import('@/views/ManageChilds/AdminManage.vue'),
        },
        {
          path: '/manage/itemDetail',
          name: 'itemDetail',
          component: () => import('@/views/ManageChilds/ItemDetail.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path:'/forget',
      name:'forget',
      component:()=>import('@/views/Forget.vue')
    },
    {
      path: '/item',
      name: 'item',
      component: () => import('@/views/Item.vue'),
    },
  ],
})

export default router
