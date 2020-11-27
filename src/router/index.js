import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '宿舍管理系统', icon: 'dashboard' }
    }]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: { title: '系统管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/users/index'),
        meta: { title: '用户管理', icon: 'user' },
        children: [
          {
            path: 'list',
            name: 'List',
            component: () => import('@/views/users/list'),
            meta: { title: '用户列表', icon: 'peoples' }
          },
          {
            path: 'update/:id',
            name: 'Update',
            component: () => import('@/views/users/handle'),
            meta: { title: '修改用户', icon: 'edit' },
            hidden: true
          },
          {
            path: 'add',
            name: 'Add',
            component: () => import('@/views/users/handle'),
            meta: { title: '添加用户', icon: 'edit' }
          }
        ]
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/tree/index'),
        meta: { title: '角色权限', icon: 'lock' }
      }
    ]
  },
  {
    path: '/student',
    component: Layout,
    redirect: '/student/list',
    name: 'student',
    meta: {
      title: '学生管理中心',
      icon: 'people',
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/dormitory/student/list'),
        name: 'list',
        meta: {
          title: '学生列表',
          icon: 'peoples',
        }
      },
      {
        path: 'self:/id',
        component: () => import('@/views/dormitory/student/self'),
        name: 'self',
        meta: {
          title: '学生个人信息',
          icon: 'user',
        }
      },
      {
        path: 'myDormitory',
        component: () => import('@/views/dormitory/student/myDormitory'),
        name: 'myDormitory',
        meta: {
          title: '个人宿舍管理',
          icon: 'theme',
        }
      },
      {
        path: 'myDormitoryScore',
        component: () => import('@/views/dormitory/student/myDormitoryScore'),
        name: 'myDormitoryScore',
        meta: {
          title: '个人宿舍得分',
          icon: 'star',
        }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
