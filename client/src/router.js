import Vue from 'vue'
import Router from 'vue-router'

import {isAdmin, isAuth, isNotAuth} from "./utils";

import Signup from './views/Signup'
import Confirmation from './views/Confirmation'
import Settings from './views/Settings'
import Estimates from './views/Estimates'
import Client from './views/Client'
import Product from './views/Product'
import Invoices from './views/Invoices'
import LegalForm from './views/LegalForm'
import PageNotFound from "./views/PageNotFound";
import Landing from "./views/Landing";
import Legal from "./views/Legal";
import Forgot from "./views/Forgot";

Vue.use(Router);

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'landing',
			component: Landing,
			beforeEnter: isNotAuth
		},
		{
			path: '/mentions-legales',
			name: 'legal',
			component: Legal,
		},
		{
			path: '/signup',
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
			path: '/forgot/:id',
			name: 'forgot',
			component: Forgot,
			beforeEnter: isNotAuth
		},
		{
			path: '/settings',
			name: 'settings',
			component: Settings,
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
			component: Estimates,
			beforeEnter: isAuth
		},
		{
			path: '/invoices',
			name: 'Factures',
			component: Invoices,
			beforeEnter: isAuth
		},
		{
			path: '/admin/legalForm',
			name: 'LegalForms',
			component: LegalForm,
			beforeEnter: isAdmin
		},
		{
			path: '*',
			component: PageNotFound
		}
	]
});

export default router