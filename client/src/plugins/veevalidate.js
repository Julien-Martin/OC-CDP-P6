import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import validatorMessage from 'vee-validate/dist/locale/fr'

Validator.localize({fr: validatorMessage})
Vue.use(VeeValidate, {
	locale: 'fr'
})