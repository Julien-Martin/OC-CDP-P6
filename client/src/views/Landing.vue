<template>
    <div id="landing">
        <v-snackbar v-model="cookieSnack" :timeout="timeout" auto-height multi-line color="#0063ff">
                Ce site utilise des cookies. En poursuivant votre navigation sur ce site, vous acceptez notre politique de protection des données personnelles et notre politique cookies.
            <v-btn dark flat @click="acceptCookie">Accepter</v-btn>
        </v-snackbar>
        <v-toolbar flat dark color="#0063ff">
            <v-toolbar-title class="mx-0">ME-ASSISTANT</v-toolbar-title>
            <p>v1.0</p>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn flat round router to="/signup">Connexion</v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-content>
            <v-parallax :src="images[0]">
                <section>
                    <v-layout column align-center justify-center class="white--text">
                        <h1 class="white--text mb-2 display-3 text-xs-center">ME-ASSISTANT</h1>
                        <div class="white--text title mb-3 text-xs-center">Libérez-vous de la facturation gratuitement</div>
                        <v-text-field prepend-inner-icon="mail_outline" label="Adresse e-mail" class="mt-5" solo
                                      v-model="email" v-validate="'required|email'" name="email"
                                      :error-messages="errors.collect('email')"></v-text-field>
                        <Alert :type="alertType" :message="alertMessage"></Alert>
                        <v-btn color="#a845f7" class="lighten-2" dark large round @click="submit">Inscription</v-btn>
                    </v-layout>
                </section>
            </v-parallax>
            <section id="section2" :style="{ backgroundImage: `url('${images[1]}')` }">
                <v-layout column wrap class="mt-5" align-center>
                    <v-flex xs12 sm4 class="my-3">
                        <div class="text-xs-center">
                            <h2 class="headline">La façon la plus simple de gérer sa facturation</h2>
                            <span class="subheading">Génération de devis et de factures</span>
                        </div>
                    </v-flex>
                    <v-flex xs12>
                        <v-container grid-list-xl>
                            <v-layout row wrap align-center>
                                <v-flex xs12 md6>
                                    <v-img :src="macImageURL2"></v-img>
                                </v-flex>
                                <v-flex xs12 md6>
                                    <v-card class="elevation-0 transparent">
                                        <v-card-title primary-title class="layout justify-center text-xs-center">
                                            <p class="display-1">Génération de devis et de factures</p>
                                        </v-card-title>
                                        <v-card-text class="layout justify-center">
                                            <div class="headline">En moins d'une minute</div>
                                        </v-card-text>
                                        <v-card-text>
                                            Le temps est important, notre objectif: vous en faire gagner.
                                            Vous pouvez créer vos factures et devis en quelques cliques.
                                            Vous pourrez alors vous concentrer sur votre secteur d'activité.
                                        </v-card-text>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-flex>
                </v-layout>
            </section>

            <section id="section3" :style="{ backgroundImage: `url('${images[2]}')` }">
                <v-layout column wrap align-center>
                    <v-flex xs12>
                        <v-container grid-list-xl>
                            <v-layout row wrap align-center>
                                <v-flex xs12 md6>
                                    <v-card class="elevation-0 transparent">
                                        <v-card-title primary-title class="layout justify-center text-xs-center">
                                            <p class="display-1">Gestion des produits et clients</p>
                                        </v-card-title>
                                        <v-card-text class="layout justify-center">
                                            <div class="headline">Tout en efficacité</div>
                                        </v-card-text>
                                        <v-card-text>
                                            Vous pouvez créer un profil client et accéder aux informations quand vous le
                                            voulez.
                                            Vous pouvez renseigner tous vos produits et prestations afin de les ajouter
                                            rapidement sur vos devis et factures.
                                        </v-card-text>
                                    </v-card>
                                </v-flex>
                                <v-flex xs12 md6>
                                    <v-img :src="macImageURL"></v-img>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-flex>

                </v-layout>
            </section>

            <v-footer color="#0063ff">
                <v-layout row wrap align-center>
                    <v-flex xs12 class="text-xs-center">
                        <div class="white--text ml-3">ME-ASSISTANT -
                            <router-link class="white--text" to="/mentions-legales">Mentions légales</router-link>
                        </div>
                    </v-flex>
                </v-layout>
            </v-footer>

        </v-content>
    </div>
</template>

<script>
    import macImage from '@/assets/mac.png'
    import macImage2 from '@/assets/mac2.png'
    import section1 from '@/assets/section1.png'
    import section2 from '@/assets/section2.png'
    import section3 from '@/assets/section3.png'
    import {CAPTURE} from "../graphql/auth";

    export default {
        name: "Landing",
        data() {
            return {
                images: [section1, section2, section3],
                macImageURL: macImage,
                macImageURL2: macImage2,
                email: '',
                alertMessage: '',
                alertType: 'success',
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
                this.cookieSnack = false
                localStorage.setItem("accept-cookie", true)
            },
            captureEmail() {
                this.$apollo.mutate({
                    mutation: CAPTURE,
                    variables: {
                        email: this.email
                    }
                }).then(() => {
                    this.alertType = "success"
                    this.alertMessage = "Vous allez recevoir un email de confirmation à l'adresse "+this.email
                }).catch(error => {
                    this.alertType = "error"
                    this.alertMessage = error
                })
            },
            submit() {
                this.$validator.validateAll().then(valid => {
                    if (valid) {
                        this.captureEmail()
                    }
                })
            }
        }
    }
</script>

<style scoped>
    #section2, #section3 {
        background-size: contain;
    }

    #section2 {
        background-position: left;
    }

    #section3 {
        background-position: right;
    }
</style>