<template>
    <div id="signup" class="backgroundCover" :style="{ backgroundImage: `url('${images[0]}')` }">
        <Loader :visible="loader"></Loader>
        <v-container fluid>
            <v-layout row wrap justify-center class="white--text">
                <v-flex xs12 class="pt-5">
                    <p class="text-xs-center display-2">ME-Assistant</p>
                    <p v-if="noAccount" class="text-xs-center headline">Inscription</p>
                    <p v-else class="text-xs-center headline">Connexion</p>
                </v-flex>
                <v-flex xs12 md4>
                    <Alert type="error" :message="error"></Alert>
                    <div v-if="!noAccount">
                        <v-text-field prepend-inner-icon="mail_outline" label="Adresse e-mail" class="mt-5" solo
                                      v-model="signin.email" v-validate="'required|email'" name="email"
                                      :error-messages="errors.collect('email')"></v-text-field>
                        <v-text-field prepend-inner-icon="lock" label="Mot de passe" solo
                                      v-model="signin.password" type="password" v-validate="'required'" name="password"
                                      :error-messages="errors.collect('password')"></v-text-field>
                        <v-btn color="#a845f7" class="lighten-2" dark large @click="submit" round>Connexion</v-btn>
                        <v-btn dark large round color="#47B9F5" @click="noAccount = true">Créer un compte ?</v-btn>
                        <v-btn dark large round color="#6473EB" router to="/">Retour à l'accueil</v-btn>
                    </div>
                    <v-stepper v-if="noAccount" v-model="stepper">
                        <v-stepper-header>
                            <v-stepper-step step="1" :complete="stepper > 1">Inscription</v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step :complete="stepper === 2" step="2">Validation</v-stepper-step>
                        </v-stepper-header>
                        <v-stepper-content step="1">
                            <v-text-field prepend-inner-icon="mail_outline" label="Adresse e-mail" class="mt-5" box
                                          v-model="signup.email" v-validate="'required|email'" name="email"
                                          :error-messages="errors.collect('email')"></v-text-field>
                            <v-btn dark large round color="#a845f7" @click="submit">Continuer</v-btn>
                            <v-btn dark large round @click="noAccount = false">Retour</v-btn>
                        </v-stepper-content>


                        <v-stepper-content step="2" class="black--text">
                            <p class="subheading">Vous allez recevoir un email de confirmation à l'adresse
                                <span>{{signup.email}}</span>.</p>
                            <p class="subheading">Cliquez sur le lien pour valider votre compte.</p>
                        </v-stepper-content>
                    </v-stepper>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import {Auth} from "../graphql";
    import {onLogin} from '../vue-apollo'
    import section1 from '@/assets/section1.png'

    export default {
        data() {
            return {
                images: [section1],
                error: '',
                stepper: 1,
                noAccount: false,
                loader: false,
                signin: {
                    email: '',
                    password: ''
                },
                signup: {
                    email: '',
                },
            }
        },
        methods: {
            login() {
                this.loader = true;
                const email = this.signin.email;
                const password = this.signin.password;
                this.$apollo.mutate({
                    mutation: Auth.LOGIN,
                    variables: {
                        email, password
                    }
                }).then((response) => {
                    this.loader = false;
                    if (!response.data.login) return;
                    const apolloClient = this.$apollo.provider.defaultClient;
                    const token = response.data.login.token;
                    const role = response.data.login.user.role;
                    onLogin(apolloClient, token, role).then(() => {
                        this.$store.dispatch('login').then(() => {
                            this.$router.push('estimates')
                        })
                    })
                }).catch(error => {
                    this.loader = false;
                    this.error = error.message
                })
            },
            captureEmail() {
                this.loader = true;
                const email = this.signup.email;
                this.$apollo.mutate({
                    mutation: Auth.CAPTURE,
                    variables: {
                        email,
                    }
                }).then(() => {
                    this.loader = false;
                    this.stepper = 2
                }).catch(error => {
                    this.loader = false;
                    this.error = error.message
                })
            },
            submit() {
                this.$validator.validateAll().then(valid => {
                    if (valid) {
                        if (!this.noAccount) {
                            this.login()
                        } else {
                            this.captureEmail()
                        }
                    }
                })
            }
        },
    }
</script>

<style scoped>
    .backgroundCover {
        height: 100%;
        background-size: cover;
    }
</style>