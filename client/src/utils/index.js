import Dashboard from '../views/Dashboard'
import Estimate from '../views/Estimate'
import Client from '../views/Client'
import Product from '../views/Product'
import Invoice from '../views/Invoice'
import Store from "../store";

export const routes = [
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


export const isNotAuth = (to, from, next) => {
	if (!Store.getters.isAuthentificated) {
		next()
		return
	}
	next('/')
}

export const isAuth = (to, from, next) => {
	if(Store.getters.isAuthentificated){
		next()
		return
	}
	next('/')
}