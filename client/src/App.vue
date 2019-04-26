<template>
	<v-app>
		<v-snackbar v-model="cookieSnack" :timeout="timeout" auto-height multi-line color="#0063ff">
			Ce site utilise des cookies. En poursuivant votre navigation sur ce site, vous acceptez notre politique de protection des données personnelles et notre politique cookies.
			<v-btn dark flat @click="acceptCookie">Accepter</v-btn>
		</v-snackbar>
		<AppToolbar v-if="isAuth"/>
		<v-content>
			<router-view/>
		</v-content>
	</v-app>
</template>

<script>

	import AppToolbar from "./components/AppToolbar";

	export default {
		name: 'App',
		components: {AppToolbar},
		data(){
			return {
				cookieSnack: false,
				timeout: 0
			}
		},
		created(){
			if(!localStorage.getItem("accept-cookie")){
				this.cookieSnack = true
			}
		},
		methods: {
			acceptCookie(){
				this.cookieSnack = false;
				localStorage.setItem("accept-cookie", true)
			},
		},
		computed: {
			isAuth() {
				return this.$store.getters.isAuthentificated
			}
		},
	}
</script>

<style>
	@media print {
		@page
		{
			size:  auto;
			margin: 0;
		}
		.v-card {
			-webkit-box-shadow: none;
			-moz-box-shadow: none;
			box-shadow: none;
		}
		.v-content {
			padding: 0 !important;
		}
	}
</style>