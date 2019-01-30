<template>
	<div>

		<div class="container">
			<aside class="tree-root">
				<div v-if="getUser.id" class="tree-item">
					<div class="tree-plate"  v-bind:class="{active: $route.params.id === getUser.id}">
						<div class="circle"></div>
						<span class="folder no-select-color teamname">{{ getUser.firstname }}</span>
					</div>
				</div>

			</aside>

			<div class="workspace-main">
				<router-view :key="$route.fullPath"></router-view>
			</div>

		</div>

	</div>

</template>

<script>
	import { GetUser } from '../constants/query.graphql'
	export default {
		data() {
			return {
				getUser: {},
			}
		},
		apollo: {
			getUser: {
				query: GetUser,
			},
		},
	}
</script>

<style scoped>
	.container {
		width: 100%;
		height: calc(100% - 52px);
	}
	.plus-button {
		position: absolute;
		right: 0;
		top: 7px;
		margin: 0 2px;
	}
	aside {
		width: 220px;
		height: 100%;
		display: inline-block;
	}
	.workspace-main {
		flex: 1 1;
	}
</style>