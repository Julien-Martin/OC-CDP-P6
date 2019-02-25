<template>
	<div id="appToolbar">
		<v-toolbar color="primary" dark fixed app clipped-right>
			<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
			<v-toolbar-title>ME Assistant</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-menu offset-y>
				<v-btn icon slot="activator">
					<v-icon>account_circle</v-icon>
				</v-btn>
				<v-list>
					<v-list-tile>
						<v-list-tile-title>Paramètres</v-list-tile-title>
					</v-list-tile>
					<v-list-tile>
						<v-list-tile-title>Déconnexion</v-list-tile-title>
					</v-list-tile>
				</v-list>
			</v-menu>
		</v-toolbar>
		<v-navigation-drawer v-model="drawer" fixed app>
			<v-list>
				<v-list-tile>
					<v-list-tile-action>
						<v-icon>home</v-icon>
					</v-list-tile-action>
					<v-list-tile-title>Tableau de bord</v-list-tile-title>
				</v-list-tile>
				<v-list-tile>
					<v-list-tile-action>
						<v-icon>contacts</v-icon>
					</v-list-tile-action>
					<v-list-tile-title>Clients</v-list-tile-title>
				</v-list-tile>
				<v-list-tile>
					<v-list-tile-action>
						<v-icon>extension</v-icon>
					</v-list-tile-action>
					<v-list-tile-title>Produits/Prestations</v-list-tile-title>
				</v-list-tile>
				<v-list-tile>
					<v-list-tile-action>
						<v-icon>dashboard</v-icon>
					</v-list-tile-action>
					<v-list-tile-title>Devis</v-list-tile-title>
				</v-list-tile>
				<v-list-tile>
					<v-list-tile-action>
						<v-icon>receipt</v-icon>
					</v-list-tile-action>
					<v-list-tile-title>Factures</v-list-tile-title>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				drawer: null,
			}
		}
	}
</script>

<style scoped>

</style>