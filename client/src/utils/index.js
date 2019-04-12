import Store from "../store";

export const links = [
	{
		path: '/clients',
		name: 'Clients',
		icon: 'contacts',
	},
	{
		path: '/products',
		name: 'Produits/Prestations',
		icon: 'extension',
	},
	{
		path: '/estimates',
		name: 'Devis',
		icon: 'dashboard',
	},
	{
		path: '/invoices',
		name: 'Factures',
		icon: 'receipt',
	},
];

export const adminLinks = [
	{
		path: '/admin/legalForm',
		name: 'Forme juridique',
		icon: 'account_balance'
	}
];


export const isNotAuth = (to, from, next) => {
	if (!Store.getters.isAuthentificated) {
		next();
		return
	}
	next('/')
};

export const isAuth = (to, from, next) => {
	if(Store.getters.isAuthentificated){
		next();
		return
	}
	next('/')
};

export const isAdmin = (to, from, next) => {
	if(Store.getters.isAuthentificated && Store.getters.isAdmin){
		next();
		return
	}
	next('/')
};