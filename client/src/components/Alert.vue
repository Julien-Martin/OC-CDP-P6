<template>
	<v-alert :value="visibility" :type="typeArg">{{messageArgs}}</v-alert>
</template>

<script>
	export default {
		name: "Alert",
		props: {
			type: String,
			message: String
		},
		data() {
			return {
				typeArg: this.type,
				messageArg: this.message
			}
		},
		computed: {
			messageArgs: {
				get(){
					return this.message
				},
				set(val){
					this.$emit('input', val)
				}
			},
			visibility() {
				if(this.message) {
					return true
				} else {
					return false
				}
			}
		}
	}
</script>