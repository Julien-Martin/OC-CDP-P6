<template>
    <div id="forgot" class="backgroundCover" :style="{ backgroundImage: `url('${images[0]}')` }">
        <Loader :visible="loader"></Loader>
        <v-container fluid>
            <v-layout row wrap justify-center class="white--text">
                <v-flex xs12 class="pt-5">
                    <p class="text-xs-center display-2">ME-Assistant</p>
                    <p class="text-xs-center headline">Mot de passe oublié</p>
                </v-flex>
                <v-flex xs12 md6>
                    <Alert type="error" :message="error"></Alert>
                    <Alert type="success" :message="success"></Alert>
                    <v-text-field type="password" v-model="forgot.password" prepend-inner-icon="lock" solo class="mt-5"
                                  v-validate="'required'" name="Mot de passe" ref="mot de passe"
                                  :error-messages="errors.collect('Mot de passe')"
                                  label="Mot de passe"></v-text-field>
                    <v-text-field type="password" v-model="forgot.confirmedPassword" solo
                                  prepend-inner-icon="lock"
                                  v-validate="'required|confirmed:mot de passe'"
                                  data-vv-as="confirmation"
                                  name="confirmation"
                                  :error-messages="errors.collect('confirmation')"
                                  label="Confirmer le mot de passe"></v-text-field>

                    <v-btn color="#a845f7" class="lighten-2" dark large round @click="submit">Envoyer</v-btn>
                    <v-btn dark large round color="#6473EB" router to="/signup">Retour</v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import {Auth} from "../graphql";
    import section1 from '@/assets/section1.png'

    export default {
        name: "Forgot",
        data() {
            return {
                images: [section1],
                error: '',
                success: '',
                loader: false,
                forgot: {
                    password: '',
                    confirmedPassword: ''
                }
            }
        },
        methods: {
            changePassword() {
                this.loader = true
                this.$apollo.mutate({
                    mutation: Auth.FORGOT_PASSWORD_CHANGE,
                    variables: {
                        id: this.$route.params.id,
                        password: this.forgot.password
                    }
                }).then(response => {
                    console.log(response)
                    this.loader = false
                    this.success = "Le mot de passe a été changé avec succès."
                }).catch(error => {
                    this.loader = false
                    this.error = error.message
                })
            },

            submit() {
                this.$validator.validateAll().then(valid => {
                    if (valid) {
                        this.changePassword()
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .backgroundCover {
        height: 100%;
        background-size: cover;
    }
</style>