<template>
    <div>
        {{selectedEstimate}}
        {{error}}
        <Modal :visibility="modal" :message="modalMessage" v-on:cancel="modal = $event" v-on:submit="deleteEstimate"></Modal>
        <v-snackbar v-model="editionMode" :timeout="snackTimeOut" color="primary" right>
            Mode édition
            <v-btn dark icon @click="updateOrCreateEstimate">
                <v-icon>save</v-icon>
            </v-btn>
        </v-snackbar>
        <v-container fluid>
            <v-toolbar dark color="primary" class="mb-2">
                <v-toolbar-items>
                    <v-text-field flat solo-inverted v-model="search" prepend-icon="search" label="Recherche" class="hidden-sm-and-down mt-2"></v-text-field>
                </v-toolbar-items>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn icon @click="addEstimate" v-if="selectedEstimate.id !== 1">
                        <v-icon>add</v-icon>
                    </v-btn>
                    <v-btn icon v-if="selectedEstimate.id !== 0 && editionMode && selectedEstimate.state === 'DRAFT'" @click="updateOrCreateEstimate">
                        <v-icon>save</v-icon>
                    </v-btn>
                    <v-btn icon v-if="selectedEstimate.id !== 1 && selectedEstimate.id !== 0 && selectedEstimate.state === 'DRAFT'" @click="modalDelete">
                        <v-icon>delete</v-icon>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-layout>
                <v-flex>
                    <List :items="filteredSearch" type="Estimate" v-on:itemSelection="selectedEstimate = $event"
                          :selected-item="selectedEstimate"></List>
                </v-flex>
                <v-flex>
                    <EstimateDoc :item="selectedEstimate"></EstimateDoc>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import {Estimate, User} from "../graphql";
    import * as moment from 'moment'
    import List from "../components/List"
    import EstimateDoc from '../components/EstimateDoc'

    export default {
        name: "Estimate",
        components: {List, EstimateDoc},
        data() {
            return {
                search: '',
                isDraft: true,
                snackTimeOut: 0,
                editionMode: false,
                modal: false,
                modalMessage: '',
                selectedEstimate: {
                    id: 0
                },
                defaultEstimate: {
                    id: 0,
                    startedDate: this.formatDateToISO(Date.now()),
                    deliveryDate: this.formatDateToISO(Date.now()),
                    validityDate: this.formatDateToISO(Date.now()),
                    message: '',
                    footNote: '',
                    products: [],
                    price: 0,
                },
                meEstimates: [],
                error: '',
            }
        },
        apollo: {
            meEstimates: {
                query: Estimate.GET
            },
        },

        methods: {
            addEstimate() {
                this.editionMode = true
                this.selectedEstimate = Object.assign({}, this.defaultEstimate)
                this.selectedEstimate.state = 'DRAFT'
                this.selectedEstimate.id = 1
            },

            updateOrCreateEstimate() {
                if (!this.selectedEstimate.client) {
                    this.error = "Vous n'avez pas sélectionner de client."
                } else if (this.selectedEstimate.products.length <= 0) {
                    this.error = "Vous n'avez pas sélectionner de produit."
                }
                let estimate = this.selectedEstimate
                estimate.clientId = estimate.client.id
                delete estimate.client
                estimate.products.forEach(item => {
                    item.productId = item.product.id
                    item.quantity = parseInt(item.quantity)
                    delete item.product
                })
                estimate.startedDate = new Date(estimate.startedDate).toISOString()
                estimate.deliveryDate = new Date(estimate.deliveryDate).toISOString()
                estimate.validityDate = new Date(estimate.validityDate).toISOString()
                if (this.selectedEstimate.id === 1) {
                    delete estimate.id
                    this.$apollo.mutate({
                        mutation: Estimate.CREATE,
                        variables: {
                            ...estimate
                        }
                    }).then(() => {
                        this.getEstimates()
                        this.editionMode = false
                    }).catch(error => {
                        this.error = error
                    })
                } else if(this.selectedEstimate.id !== 0 && this.selectedEstimate.id !== 1) {
                    this.$apollo.mutate({
                        mutation: Estimate.UPDATE,
                        variables: {
                            ...estimate
                        }
                    }).then(() => {
                        this.getEstimates()
                        this.editionMode = false
                    }).catch(error => {
                        this.error = error
                    })
                }
            },

            formatDateToISO(date) {
                return new Date(date).toISOString().substr(0, 10)
            },

            getEstimates() {
                this.$apollo.queries.meEstimates.refetch()
            },

            changeEstimateState() {

            },

            modalDelete() {
                this.modal = true
                this.modalMessage = "Voulez vous supprimer ce devis ?"
            },

            deleteEstimate() {
                this.modal = false
                this.$apollo.mutate({
                    mutation: Estimate.DELETE,
                    variables: {
                        id: this.selectedEstimate.id
                    }
                }).then(() => {
                    this.getEstimates()
                    this.resetEstimate()
                }).catch(error => {
                    this.error = error
                })
            },

            resetEstimate() {
                this.selectedEstimate = Object.assign({}, this.defaultEstimate)
            },

            watchModification() {
                this.editionMode = false
                this.$watch('selectedEstimate.client', () => {
                    this.editionMode = true
                })
                this.$watch('selectedEstimate.startedDate', () => {
                    this.editionMode = true
                })
                this.$watch('selectedEstimate.deliveryDate', () => {
                    this.editionMode = true
                })
                this.$watch('selectedEstimate.validityDate', () => {
                    this.editionMode = true
                })
                this.$watch('selectedEstimate.message', () => {
                    this.editionMode = true
                })
                this.$watch('selectedEstimate.products', () => {
                    this.editionMode = true
                })
                this.$watch('selectedEstimate.footNote', () => {
                    this.editionMode = true
                })
            },

            searchMethod(item) {
                let tempSearch = this.search.toLowerCase()
                if (item.estimateNumber.toString().toLowerCase().match(tempSearch)) {
                    return true
                } else if (item.client.name.firstname.toString().toLowerCase().match(tempSearch)) {
                    return true
                } else if (item.client.name.lastname.toString().toLowerCase().match(tempSearch)) {
                    return true
                } else if (item.client.company.toString().toLowerCase().match(tempSearch)) {
                    return true
                }
            },
        },
        computed: {
            filteredSearch() {
                if (this.search) {
                    return this.meEstimates.filter((estimate) => {
                        return this.searchMethod(estimate)
                    })
                } else {
                    return this.meEstimates
                }
            }
        },
    }
</script>

<style scoped>
    #custom-list {
        overflow-y: auto;
        max-height: calc(100vh - 88px)
    }
</style>