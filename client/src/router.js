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
import LegalForm from './views/LegalForm'

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
			beforeEnter: isAuth
		},
		{
			path: '/clients',
			name: 'Clients',
			component: Client,
			beforeEnter: isAuth
		},
		{
			path: '/products',
			name: 'Produits/Prestations',
			component: Product,
			beforeEnter: isAuth
		},
		{
			path: '/estimates',
			name: 'Devis',
			component: Estimate,
			beforeEnter: isAuth
		},
		{
			path: '/invoices',
			name: 'Factures',
			component: Invoice,
			beforeEnter: isAuth
		},
		{
			path: '/admin/legalForm',
			name: 'LegalForms',
			component: LegalForm
		}
	]
})

export default router