import Vue from 'vue'
import Router from 'vue-router'

import Signup from './views/Signup'
import Confirmation from './views/Confirmation'
import Settings from './views/Settings'
import Dashboard from './views/Dashboard'
import Estimate from './views/Estimate'
import Client from './views/Client'
import Product from './views/Product'
import Invoice from './views/Invoice'

import {isAuth, isNotAuth} from "./utils";

Vue.use(Router)

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'signup',
			component: Signup,
			beforeEnter: isNotAuth
		},
		{
			path: '/signup/:id',
			name: 'confirmation',
			component: Confirmation,
			beforeEnter: isNotAuth
		},
		{
			path: '/settings',
			name: 'settings',
			component: Settings,
			beforeEnter: isAuth
		},
		{
			path: '/dashboard',
			name: 'Tableau de bord',
			component: Dashboard,
			icon: 'home',
			beforeEnter: isAuth
		},
		{
			path: '/clients',
			name: 'Clients',
			component: Client,
			icon: 'contacts',
			beforeEnter: isAuth
		},
		{
			path: '/products',
			name: 'Produits/Prestations',
			component: Product,
			icon: 'extension',
			beforeEnter: isAuth
		},
		{
			path: '/estimates',
			name: 'Devis',
			component: Estimate,
			icon: 'dashboard',
			beforeEnter: isAuth
		},
		{
			path: '/invoices',
			name: 'Factures',
			component: Invoice,
			icon: 'receipt',
			beforeEnter: isAuth
		},
	]
})

export default router