<template>
	<v-app>
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

		computed: {
			isAuth() {
				return this.$store.getters.isAuthentificated
			}
		}
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