import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
import { checkIsAdmin } from '@/api'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/Rincatian',
    name: 'Rincatian',
    component: () => import('@/views/Rincatian.vue'),
    redirect: '/Rincatian/phonetics',
    children: [
      {
        path: 'phonetics',
        name: 'RincatianPhonetics',
        component: () => import('@/views/rincatian/Phonetics.vue')
      },
      {
        path: 'vocabulary',
        name: 'RincatianVocabulary',
        component: () => import('@/views/rincatian/Vocabulary.vue')
      },
      {
        path: 'grammar',
        name: 'RincatianGrammar',
        component: () => import('@/views/rincatian/Grammar.vue')
      },
      {
        path: 'practice',
        name: 'RincatianPractice',
        component: () => import('@/views/rincatian/Practice.vue')
      },
      {
        path: 'history',
        name: 'RincatianHistory',
        component: () => import('@/views/rincatian/History.vue')
      }
    ]
  },
  {
    path: '/world',
    name: 'World',
    component: () => import('@/views/World.vue'),
    redirect: '/world/worldview',
    children: [
      {
        path: 'worldview',
        name: 'WorldWorldview',
        component: () => import('@/views/world/Worldview.vue')
      },
      {
        path: 'rainbow-crystal',
        name: 'WorldRainbowCrystal',
        component: () => import('@/views/world/RainbowCrystal.vue')
      },
      {
        path: 'starfall-war',
        name: 'WorldStarfallWar',
        component: () => import('@/views/world/StarfallWar.vue')
      },
      {
        path: 'zero-judgment',
        name: 'WorldZeroJudgment',
        component: () => import('@/views/world/ZeroJudgment.vue')
      },
      {
        path: 'derivative-works',
        name: 'WorldDerivativeWorks',
        component: () => import('@/views/world/DerivativeWorks.vue')
      },
      {
        path: 'cultural-works',
        name: 'WorldCulturalWorks',
        component: () => import('@/views/world/CulturalWorks.vue')
      },
      {
        path: 'tian-calendar',
        name: 'WorldTianCalendar',
        component: () => import('@/views/world/TianCalendar.vue')
      }
    ]
  },
  {
    path: '/business',
    name: 'Business',
    component: () => import('@/views/Business.vue')
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import('@/views/Community.vue')
  },
  {
    path: '/community/post/:id',
    name: 'PostDetail',
    component: () => import('@/views/PostDetail.vue')
  },
  {
    path: '/community/new',
    name: 'PostNew',
    component: () => import('@/views/PostEditor.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/community/edit/:id',
    name: 'PostEdit',
    component: () => import('@/views/PostEditor.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/User.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 导航守卫：需要登录的页面，未登录则跳转首页；管理员页面额外检查角色
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // 需要登录但未登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'Home', query: { showLogin: 'true' } })
    return
  }
  
  // 需要管理员权限但不是管理员
  if (to.meta.requiresAdmin && userStore.user?.id) {
    const isAdmin = await checkIsAdmin(userStore.user.id)
    if (!isAdmin) {
      next({ name: 'Home' })
      return
    }
  }
  
  next()
})

export default router