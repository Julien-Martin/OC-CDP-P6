import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard'
import Estimate from './views/Estimate'
import Client from './views/Client'
import Product from './views/Product'
import Invoice from './views/Invoice'
import Settings from './views/Settings'
import Signup from './views/Signup'
import Confirmation from './views/Confirmation'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'signup',
      component: Signup
    },
    {
      path: '/signup/:id',
      name: 'confirmation',
      component: Confirmation
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/clients',
      name: 'client',
      component: Client
    },
    {
      path: '/products',
      name: 'product',
      component: Product
    },
    {
      path: '/estimates',
      name: 'estimate',
      component: Estimate
    },
    {
      path: '/invoices',
      name: 'invoice',
      component: Invoice
    },
    {
      path: '/settings',
      name: 'setting',
      component: Settings
    }
  ]
})

export default router