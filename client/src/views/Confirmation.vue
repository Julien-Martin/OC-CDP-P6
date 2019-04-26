<template>
    <div id="signup" class="backgroundCover" :style="{ backgroundImage: `url('${images[0]}')` }">
        <v-container fluid>
            <v-layout row wrap justify-center class="white--text">
                <v-flex xs12>
                    <p class="text-xs-center display-2" router to="/">ME-Assistant</p>
                    <p class="text-xs-center headline">Confirmation de votre compte</p>
                </v-flex>
                <v-flex xs12 sm4>
                    <Alert type="error" :message="error"></Alert>
                    <v-stepper v-model="stepper" vertical>
                        <v-stepper-step :complete="stepper > 1" step="1">Information de connexion</v-stepper-step>
                        <v-stepper-content step="1">
                            <v-card v-if="stepper === 1" flat>
                                <v-container grid-list-md fluid>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-text-field type="password" v-model="signup.password" prepend-icon="lock"
                                                          v-validate="'required'" name="Mot de passe" ref="mot de passe"
                                                          :error-messages="errors.collect('Mot de passe')"
                                                          label="Mot de passe"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field type="password" v-model="signup.confirmedPassword"
                                                          prepend-icon="lock"
                                                          v-validate="'required|confirmed:mot de passe'"
                                                          data-vv-as="confirmation"
                                                          name="confirmation"
                                                          :error-messages="errors.collect('confirmation')"
                                                          label="Confirmer le mot de passe"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                            <v-btn color="primary" @click="submit">Continuer</v-btn>
                        </v-stepper-content>

                        <v-stepper-step :complete="stepper > 2" step="2">Informations personnelles</v-stepper-step>
                        <v-stepper-content step="2">
                            <v-card v-if="stepper === 2" flat>
                                <v-container grid-list-md fluid>
                                    <v-layout row wrap>
                                        <v-flex xs12 md6>
                                            <v-text-field v-model="signup.name.lastname" v-validate="'required'"
                                                          label="Nom" name="nom"
                                                          :error-messages="errors.collect('nom')"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md6>
                                            <v-text-field v-model="signup.name.firstname" v-validate="'required'"
                                                          label="Prénom"
                                                          name="prénom"
                                                          :error-messages="errors.collect('prénom')"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="signup.address.street" v-validate="'required'"
                                                          label="Adresse ligne 1"
                                                          name="adresse ligne 1"
                                                          :error-messages="errors.collect('adresse ligne 1')"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="signup.address.street2" label="Adresse ligne 2"
                                                          name="adresse ligne 2"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="signup.address.city" v-validate="'required'"
                                                          label="Ville" name="ville"
                                                          :error-messages="errors.collect('ville')"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="signup.address.postalcode" v-validate="'required'"
                                                          label="Code postal"
                                                          name="code postal"
                                                          :error-messages="errors.collect('code postal')"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="signup.address.country" v-validate="'required'"
                                                          label="Pays"
                                                          name="pays"
                                                          :error-messages="errors.collect('pays')"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="signup.phone" label="Téléphone"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                            <v-btn color="primary" @click="submit">Continuer</v-btn>
                            <v-btn flat @click="stepper = 1">Retour</v-btn>
                        </v-stepper-content>

                        <v-stepper-step :complete="stepper > 3" step="3">Informations sur l'activité</v-stepper-step>
                        <v-stepper-content step="3">
                            <v-card v-if="stepper === 3" flat>
                                <v-container grid-list-xs12 fluid>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-text-field v-model="signup.siret" v-validate="'required'"
                                                          name="numéro de siret"
                                                          :error-messages="errors.collect('numéro de siret')"
                                                          label="Numéro de siret"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-switch class="xs12" v-model="signup.useVAT"
                                                      label="Assujetti à la TVA"></v-switch>
                                        </v-flex>
                                        <v-flex xs12 v-if="signup.useVAT">
                                            <v-text-field v-model="signup.VATnumber" v-validate="'required'"
                                                          name="numéro de TVA"
                                                          :error-messages="errors.collect('numéro de TVA')"
                                                          label="Numéro de TVA"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-textarea v-model="signup.paymentInfo" rows="3" no-resize
                                                        label="Information de paiement"
                                                        placeholder="Virement sur l'IBAN, Carte bancaire, Chèque à l'ordre de ..."></v-textarea>
                                        </v-flex>
                                        <TextField class="xs12" v-model="signup.RCS"
                                                   hint="Pour les activités de commerces"
                                                   label="Immatriculation au Registre du commerce et des sociétés"></TextField>
                                        <TextField class="xs12" v-model="signup.RM"
                                                   hint="Pour les activités artisanales"
                                                   label="Immatriculation au Répertoire des métiers"></TextField>
                                        <TextField class="xs12" v-model="signup.commercialName" hint="Facultatif"
                                                   label="Nom commercial"></TextField>
                                        <v-flex xs12>
                                            <v-textarea rows="4" no-resize v-model="signup.cgv"
                                                        placeholder="Les conditions générales de vente décrites ci-après détaillent les droits et obligations de la société...."
                                                        label="Conditions générales de vente"></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                            <v-btn color="primary" @click="submit">Continuer</v-btn>
                            <v-btn flat @click="stepper = 2">Retour</v-btn>
                        </v-stepper-content>

                        <v-stepper-step :complete="stepper === 4" step="4">Validation</v-stepper-step>
                        <v-stepper-content step="4">
                            <v-card flat>
                                <p class="headline">Votre compte est créé.</p>
                                <p class="subheading">Vous pouvez maintenant vous connectez et utilisez
                                    l'application.</p>
                            </v-card>
                            <v-btn color="primary" router to="/">Connexion</v-btn>
                        </v-stepper-content>
                    </v-stepper>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import {Auth} from "../graphql";
    import section1 from '@/assets/section1.png'

    export default {
        data() {
            return {
                images: [section1],
                error: '',
                stepper: 1,
                signup: {
                    password: '',
                    confirmedPassword: '',
                    name: {
                        firstname: '',
                        lastname: '',
                    },
                    address: {
                        street: '',
                        street2: '',
                        postalcode: '',
                        city: '',
                        country: ''
                    },
                    phone: '',
                    siret: '',
                    useVAT: false,
                    VATnumber: '',
                    paymentInfo: '',
                    RCS: '',
                    RM: '',
                    commercialName: '',
                    cgv: ''
                }
            }
        },
        methods: {
            createAccount() {
                const id = this.$route.params.id;
                const firstname = this.signup.name.firstname;
                const lastname = this.signup.name.lastname;

                const street = this.signup.address.street;
                const street2 = this.signup.address.street2;
                const city = this.signup.address.city;
                const postalcode = this.signup.address.postalcode;
                const country = this.signup.address.country;

                delete this.signup.confirmedPassword;
                delete this.signup.name;
                delete this.signup.address;
                this.$apollo.mutate({
                    mutation: Auth.SIGNUP,
                    variables: {
                        ...this.signup,
                        id,
                        firstname,
                        lastname,
                        street,
                        street2,
                        city,
                        postalcode,
                        country,
                    }
                }).then(() => {
                    this.stepper = 4
                }).catch(error => {
                    this.error = error.message
                })
            },
            submit() {
                this.$validator.validateAll().then(valid => {
                    console.log(valid);
                    if (valid) {
                        if (this.stepper === 3) {
                            this.createAccount()
                        } else {
                            this.stepper++
                        }
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