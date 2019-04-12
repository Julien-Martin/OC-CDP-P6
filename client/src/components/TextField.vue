<template>
	<v-flex :class="gridArg">
		<v-text-field v-model="modelArg" :label="labelArg" v-validate="validateArg" :name="labelArg"
									:error-messages="errors.collect(labelArg)" :type="typeArg" :disabled="disableArg"
									:hint="hintArg"></v-text-field>
	</v-flex>
</template>

<script>
	export default {
		name: "TextField",
		props: {
			value: String,
			validate: String,
			label: String,
			type: String,
			disable: Boolean,
			grid: String,
			hint: String,
		},
		data() {
			return {
				labelArg: this.label,
				validateArg: this.validate,
				typeArg: this.type || 'text',
				disableArg: this.disable || false,
				gridArg: this.grid || 'xs12',
				hintArg: this.hint || '',
			}
		},
		computed: {
			modelArg: {
				get() {
					return this.value
				},
				set(val) {
					this.$emit('input', val)
				}
			}
		}
	}
</script>