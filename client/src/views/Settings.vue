<template>
    <div>
        <Loader :visible="loader"></Loader>
        <Modal :visibility="modal.visibility" :title="modal.title" :message="modal.message"
               v-on:cancel="modal.visibility = $event"
               v-on:submit="deleteAccount"></Modal>
        <v-container>
            <v-card>
                <Alert type="error" :message="error"></Alert>
                <v-container fluid>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-alert :value="true" type="info">Informations personnelles</v-alert>
                            <v-form ref="personnalInfo">
                                <v-container>
                                    <v-layout row wrap>
                                        <v-flex xs12 md3>
                                            <v-text-field v-model="me.name.lastname" label="Nom"
                                                          v-validate="'required'" name="nom"
                                                          data-vv-scope="form-1"
                                                          :error-messages="errors.collect('form-1.nom')"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md3>
                                            <v-text-field v-model="me.name.firstname" label="Prénom"
                                                          v-validate="'required'"
                                                          data-vv-scope="form-1"
                                                          :error-messages="errors.collect('form-1.prénom')"
                                                          name="prénom"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md3>
                                            <v-text-field v-model="me.address.street" label="Adresse ligne 1"
                                                          v-validate="'required'"
                                                          data-vv-scope="form-1"
                                                          :error-messages="errors.collect('form-1.adresse')"
                                                          name="adresse"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md3>
                                            <v-text-field v-model="me.address.street2" label="Adresse ligne 2"
                                                          name="adresse ligne 2"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md3>
                                            <v-text-field v-model="me.address.city" label="Ville"
                                                          v-validate="'required'"
                                                          data-vv-scope="form-1"
                                                          :error-messages="errors.collect('form-1.ville')"
                                                          name="ville"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md3>
                                            <v-text-field v-model="me.address.postalcode" label="Code postal"
                                                          v-validate="'required'"
                                                          data-vv-scope="form-1"
                                                          :error-messages="errors.collect('form-1.code postal')"
                                                          name="code postal"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md3>
                                            <v-text-field v-model="me.address.country" label="Pays"
                                                          v-validate="'required'"
                                                          data-vv-scope="form-1"
                                                          :error-messages="errors.collect('form-1.pays')"
                                                          name="pays"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md3>
                                            <v-text-field v-model="me.phone" label="Téléphone"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md3>
                                            <v-btn color="primary" @click="changeInfo('form-1')">Modifier</v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-form>
                        </v-flex>
                        <v-flex xs12>
                            <v-alert :value="true" type="info">Informations sur l'activité</v-alert>
                            <v-form ref="workInfo" data-vv-scope="form-2">
                                <v-container>
                                    <v-layout row wrap>
                                        <v-flex xs12 md3>
                                            <v-text-field v-model="me.siret" label="Numéro de siret"
                                                          v-validate="'required'" name="numéro de siret"
                                                          data-vv-scope="form-2"
                                                          :error-messages="errors.collect('form-2.numéro de siret')"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md3>
                                            <v-text-field v-model="me.RCS"
                                                          label="Immatriculation au Registre du commerce et des sociétés"
                                                          hint="Pour les activités de commerces"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md3>
                                            <v-text-field v-model="me.RM"
                                                          label="Immatriculation au Répertoire des métiers"
                                                          hint="Pour les activités artisanales"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md3>
                                            <v-text-field v-model="me.commercialName" label="Nom commercial"
                                                          hint="Facultatif"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs12 md3>
                                            <v-switch v-model="me.useVAT" label="Assujetti à la TVA"></v-switch>
                                        </v-flex>
                                        <v-flex xs12 md3 v-if="me.useVAT">
                                            <v-text-field v-model="me.VATnumber" label="Numéro de TVA"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs12 md3>
                                            <v-textarea v-model="me.paymentInfo" rows="4" no-resize
                                                        label="Information de paiement"
                                                        placeholder="Virement sur l'IBAN, Carte bancaire, Chèque à l'ordre de ..."></v-textarea>
                                        </v-flex>
                                        <v-flex xs12 md3>
                                            <v-textarea v-model="me.cgv" rows="4" no-resize
                                                        placeholder="Les conditions générales de vente décrites ci-après détaillent les droits et obligations de la société...."
                                                        label="Conditions générales de vente"></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-btn color="primary" @click="changeInfo('form-2')">Modifier</v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-form>
                        </v-flex>
                        <v-flex xs12>
                            <v-alert :value="true" type="warning">Informations de connexion</v-alert>
                            <v-form ref="passwordInfo">
                                <v-container>
                                    <v-layout row wrap>
                                        <v-flex xs12 md3>
                                            <v-text-field v-model="me.email" disabled label="Email"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md3>
                                            <v-text-field v-model="auth.oldpassword"
                                                          data-vv-scope="form-3"
                                                          type="password"
                                                          v-validate="'required'" name="ancien mot de passe"
                                                          :error-messages="errors.collect('form-3.ancien mot de passe')"
                                                          label="Ancien mot de passe"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs12 md3>
                                            <v-text-field v-model="auth.password"
                                                          type="password"
                                                          v-validate="'required'" name="nouveau mot de passe"
                                                          ref="nouveau mot de passe"
                                                          data-vv-scope="form-3"
                                                          :error-messages="errors.collect('form-3.nouveau mot de passe')"
                                                          label="Nouveau mot de passe"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md3>
                                            <v-text-field label="Confirmer le nouveau mot de passe"
                                                          data-vv-scope="form-3"
                                                          type="password"
                                                          v-model="auth.confirmedPassword"
                                                          v-validate="'required|confirmed:nouveau mot de passe'" name="confirmation"
                                                          :error-messages="errors.collect('form-3.confirmation')"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-btn color="warning" @click="changePassword">Modifier</v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-form>
                        </v-flex>
                        <v-flex xs12>
                            <v-alert :value="true" type="error">Supprimer le compte</v-alert>
                            <v-form>
                                <v-container>
                                    <v-layout row wrap>
                                        <v-flex xs12 md3>
                                            <v-text-field v-model="accountToDelete.password"
                                                          v-validate="'required'" name="mot de passe"
                                                          data-vv-scope="form-4"
                                                          type="password"
                                                          :error-messages="errors.collect('form-4.mot de passe')"
                                                          label="Mot de passe"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-btn dark color="error" @click="showDeleteModal">Supprimer</v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-form>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
        </v-container>
    </div>
</template>

<script>
    import {User} from '../graphql'
    import {onLogout} from '../vue-apollo'

    export default {
        name: "Settings",
        data() {
            return {
                modal: {
                    visibility: false,
                    message: '',
                    title: '',
                },
                auth: {
                    oldpassword: '',
                    password: '',
                    confirmedPassword: ''
                },
                accountToDelete: {
                    password: '',
                },
                me: {
                    phone: '',
                    name: {
                        firstname: '',
                        lastname: ''
                    },
                    address: {
                        street: '',
                        street2: '',
                        postalcode: '',
                        city: '',
                        country: ''
                    }
                },
                error: '',
                loader: false,
            }
        },
        apollo: {
            me: {
                query: User.GET
            }
        },

        created() {
            this.$apollo.addSmartQuery('me', {
                query: User.GET
            });
            this.getMe()
        },

        methods: {
            deleteAccount() {
                this.loaderController()
                this.$apollo.mutate({
                    mutation: User.DELETE,
                    variables: {
                        password: this.accountToDelete.password
                    }
                }).then(() => {
                    this.loaderController()
                    const apolloClient = this.$apollo.provider.defaultClient;
                    this.$router.push('/')
                    onLogout(apolloClient).then(() => {
                        this.$store.dispatch('logout').then(() => {
                            this.$router.push('/')
                        })
                    })
                }).catch(error => {
                    this.loaderController()
                    this.error = error.message
                    this.scrollTop()
                })
            },

            scrollTop(){
                this.$vuetify.goTo(0)
            },

            showDeleteModal() {
                this.$validator.validateAll('form-4').then(valid => {
                    if(valid){
                        this.modal.visibility = true
                        this.modal.title = "Supprimer le compte ?"
                        this.modal.message = "Êtes-vous sûr de vouloir supprimer votre compte ?"
                    }
                })
            },
            getMe() {
                this.loaderController();
                this.$apollo.queries.me
                    .refetch()
                    .then(result => {
                        this.loaderController();
                        this.me = result.data.me
                    })
                    .catch(error => {
                        this.loaderController();
                        this.error = error.message
                        this.scrollTop()
                    })
            },

            loaderController() {
                this.loader = !this.loader
            },

            changeInfo(scope) {
                this.$validator.validateAll(scope).then(valid => {
                    if (valid) {
                        if (!this.me.useVAT) {
                            this.me.VATnumber = ''
                        }
                        this.loaderController();
                        this.$apollo.mutate({
                            mutation: User.UPDATE,
                            variables: {
                                ...this.me
                            }
                        }).then(() => {
                            this.loaderController();
                            this.getMe()
                        }).catch(error => {
                            this.loaderController();
                            this.error = error.message
                            this.scrollTop()
                        })
                    }
                })
            },

            changePassword() {
                this.$validator.validateAll('form-3').then(valid => {
                  if(valid) {
                      delete this.auth.confirmedPassword
                      this.loaderController();
                      this.$apollo.mutate({
                          mutation: User.UPDATE_PASSWORD,
                          variables: {
                              ...this.auth
                          }
                      }).then(() => {
                          this.loaderController();
                          this.getMe()
                      }).catch(error => {
                          this.loaderController();
                          this.error = error.message
                          this.scrollTop()
                      })
                  }
                })
            },
        }
    }
</script>

<style scoped>

</style>