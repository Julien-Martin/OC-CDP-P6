<template>
    <div>
        <Loader :visible="loader"></Loader>
        <v-container>
            {{me}}
            <v-toolbar dark color="primary" class="mb-2 hidden-print-only">
                <v-spacer></v-spacer>
                <v-toolbar-items>

                </v-toolbar-items>
            </v-toolbar>
            <v-card>
                <v-container fluid>
                    <v-layout row wrap>
                        <v-flex xs6>
                            <p class="subheading">Informations personnelles</p>
                            <v-form ref="personnalInfo">
                                <v-container>
                                    <v-layout row wrap>
                                        <v-flex xs12 md6>
                                            <v-text-field v-model="me.name.lastname" label="Nom"
                                                          name="nom"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md6>
                                            <v-text-field v-model="me.name.firstname" label="Prénom"
                                                          name="prénom"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="me.address.street" label="Adresse ligne 1"
                                                          name="adresse ligne 1"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="me.address.street2" label="Adresse ligne 2"
                                                          name="adresse ligne 2"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="me.address.city" label="Ville"
                                                          name="ville"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="me.address.postalcode" label="Code postal"
                                                          name="code postal"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="me.address.country" label="Pays"
                                                          name="pays"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="me.phone" label="Téléphone"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-form>
                            <v-btn color="primary" @click="changeInfo">Modifier</v-btn>
                        </v-flex>
                        <v-flex xs6>
                            <p class="subheading">Informations sur l'activité</p>
                            <v-form ref="workInfo">
                                <v-container>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-text-field v-model="me.siret" label="Numéro de siret"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-switch v-model="me.useVAT" label="Assujetti à la TVA"></v-switch>
                                        </v-flex>
                                        <v-flex xs12 v-if="me.useVAT">
                                            <v-text-field v-model="me.VATnumber" label="Numéro de TVA"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-textarea v-model="me.paymentInfo" rows="3" no-resize
                                                        label="Information de paiement"
                                                        placeholder="Virement sur l'IBAN, Carte bancaire, Chèque à l'ordre de ..."></v-textarea>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="me.RCS"
                                                          label="Immatriculation au Registre du commerce et des sociétés"
                                                          hint="Pour les activités de commerces"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="me.RM"
                                                          label="Immatriculation au Répertoire des métiers"
                                                          hint="Pour les activités artisanales"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="me.commercialName" label="Nom commercial"
                                                          hint="Facultatif"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-textarea v-model="me.cgv" rows="4" no-resize
                                                        placeholder="Les conditions générales de vente décrites ci-après détaillent les droits et obligations de la société...."
                                                        label="Conditions générales de vente"></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-form>
                            <v-btn color="primary" @click="changeInfo">Modifier</v-btn>
                        </v-flex>
                        <v-flex xs6>
                            <p class="subheading">Informations de connexion</p>
                            <v-form ref="passwordInfo">
                                <v-container>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-text-field v-model="me.email" disabled label="Email"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="auth.oldpassword" label="Ancien mot de passe"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="auth.password" label="Nouveau mot de passe"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field label="Confirmer le nouveau mot de passe"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-form>
                            <v-btn color="primary" @click="changePassword">Modifier</v-btn>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
        </v-container>
    </div>
</template>

<script>
  import {User} from '../graphql'

  export default {
    name: "Settings",
    data() {
      return {
        auth: {
          oldpassword: '',
          password: '',
        },
        me: {
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
      })
      this.getMe()
    },

    methods: {
      getMe() {
        this.loaderController()
        this.$apollo.queries.me
            .refetch()
            .then(result => {
              this.loaderController()
              this.me = result.data.me
            })
            .catch(error => {
              this.loaderController()
              this.error = error
            })
      },

      loaderController() {
        this.loader = !this.loader
      },

      changeInfo() {
        if(!this.me.useVAT){
          this.me.VATnumber = ''
        }
        this.loaderController()
        this.$apollo.mutate({
          mutation: User.UPDATE,
          variables: {
            ...this.me
          }
        }).then(() => {
          this.loaderController()
          this.getMe()
        }).catch(error => {
          this.loaderController()
          this.error = error
        })
      },

      changeWorkInfo() {

      },

      changePassword() {
        this.loaderController()
        this.$apollo.mutate({
          mutation: User.UPDATE_PASSWORD,
          variables: {
            ...this.auth
          }
        }).then(() => {
          this.loaderController()
          this.getMe()
        }).catch(error => {
          this.loaderController()
          this.error = error
        })
      },
    }
  }
</script>

<style scoped>

</style>