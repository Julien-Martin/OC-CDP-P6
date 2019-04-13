<template>
  <div id="signup">
    <Loader :visible="loader"></Loader>
    <v-container fluid>
      <v-layout row wrap justify-center>
        <v-flex xs12>
          <p class="text-xs-center display-2">ME-Assistant</p>
          <p v-if="noAccount" class="text-xs-center headline">Inscription</p>
          <p v-else class="text-xs-center headline">Connexion</p>
        </v-flex>
        <v-flex xs12 sm4>
          <Alert type="error" :message="error"></Alert>

          <v-card v-if="!noAccount">
            <v-card-title primary-title>
              <h3 class="headline">Connexion</h3>
            </v-card-title>
            <v-card-text>
              <form>
                <v-container fluid>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-text-field name="email"
                                    label="Adresse email"
                                    v-model="signin.email"
                                    v-validate="'required|email'"
                                    :error-messages="errors.collect('email')">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field name="password"
                                    label="Mot de passe"
                                    v-model="signin.password"
                                    v-validate="'required'"
                                    type="password"
                                    :error-messages="errors.collect('password')">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-btn color="primary" @click="submit">Connexion</v-btn>
                      <v-btn @click="noAccount = true">Créer un compte ?</v-btn>
                    </v-flex>
                  </v-layout>
                </v-container>
              </form>
            </v-card-text>
          </v-card>
          <v-stepper v-if="noAccount" v-model="stepper" vertical>

            <v-stepper-step :complete="stepper > 1" step="1">Inscription</v-stepper-step>

            <v-stepper-content step="1">
              <v-form>
                <v-card flat>
                  <v-container grid-list-md fluid>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-text-field name="email"
                                      label="Adresse email"
                                      v-model="signup.email"
                                      v-validate="'required|email'"
                                      :error-messages="errors.collect('email')">
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card>
                <v-btn color="primary" @click="submit">Continuer</v-btn>
                <v-btn flat @click="noAccount = false">Retour</v-btn>
              </v-form>
            </v-stepper-content>

            <v-stepper-step :complete="stepper === 2" step="2">Validation</v-stepper-step>

            <v-stepper-content step="2">
              <v-card flat>
                <p class="subheading">Vous allez recevoir un email de confirmation à l'adresse
                  <span>{{signup.email}}</span>.</p>
                <p class="subheading">Cliquez sur le lien pour valider votre compte.</p>
              </v-card>
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

  export default {
    data() {
      return {
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

</style>