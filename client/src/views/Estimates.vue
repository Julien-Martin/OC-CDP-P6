<template>
    <div>
        {{selectedEstimate}}
        <Loader :visible="loader"></Loader>
        <Modal :visibility="modal" :message="modalMessage" v-on:cancel="modal = $event"
               v-on:submit="deleteEstimate"></Modal>
        <v-snackbar v-model="editionMode" :timeout="snackTimeOut" color="primary" right>
            Mode édition
            <v-btn dark icon @click="updateOrCreateEstimate">
                <v-icon>save</v-icon>
            </v-btn>
        </v-snackbar>

        <v-container fluid>
            <v-toolbar dark color="primary" class="mb-2">
                <v-toolbar-items>
                    <v-text-field flat solo-inverted v-model="search" prepend-icon="search" label="Recherche"
                                  class="hidden-sm-and-down mt-2"></v-text-field>
                </v-toolbar-items>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-select v-if="selectedEstimate.state !== 'DRAFT' && selectedEstimate.id !== 0" flat solo-inverted
                              v-model="selectedEstimate.state" :items="states" label="État du devis"
                              class="hidden-sm-and-down mt-2" @input="changeEstimateState">
                        <template v-slot:item="{item}">
                            <v-chip :color="docStateColor(item)" text-color="white">{{item | docStateTranslation}}
                            </v-chip>
                        </template>
                        <template v-slot:selection="{item}">
                            <v-chip :color="docStateColor(item)" text-color="white">{{item | docStateTranslation}}
                            </v-chip>
                        </template>
                    </v-select>
                    <v-btn icon @click="print(selectedEstimate, 'Estimate')">
                        <v-icon>print</v-icon>
                    </v-btn>
                    <v-btn icon v-if="selectedEstimate.state === 'DRAFT'" @click="validateEstimate">
                        <v-icon>done</v-icon>
                    </v-btn>
                    <v-btn icon @click="addEstimate" v-if="selectedEstimate.id !== 1">
                        <v-icon>add</v-icon>
                    </v-btn>
                    <v-btn icon v-if="selectedEstimate.id !== 0 && editionMode && selectedEstimate.state === 'DRAFT'"
                           @click="updateOrCreateEstimate">
                        <v-icon>save</v-icon>
                    </v-btn>
                    <v-btn icon
                           v-if="selectedEstimate.id !== 1 && selectedEstimate.id !== 0 && selectedEstimate.state === 'DRAFT'"
                           @click="modalDelete">
                        <v-icon>delete</v-icon>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-layout>
                <v-flex>
                    <List :items="filteredSearch" type="Estimate" v-on:itemSelection="itemSelection($event)"
                          :selected-item="selectedEstimate"></List>
                </v-flex>
                <v-flex>
                    <EstimateDoc :item="selectedEstimate" id="printMe"></EstimateDoc>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import {Estimate} from "../graphql";
    import List from "../components/List"
    import EstimateDoc from '../components/EstimateDoc'
    import jsPDF from 'jspdf'
    import html2canvas from 'html2canvas'
    import rasterizehtml from 'rasterizehtml'

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
                unwatch: '',
                loader: false,
                watchObject: {},
                output: null,
                selectedEstimate: {id: 0},
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
                states: ["PENDING", "SEND", "DONE"]
            }
        },
        apollo: {
            meEstimates: {
                query: Estimate.GET
            },
        },

        created() {
            this.getEstimates()
        },

        methods: {
            print(item, type) {
                let doc = new jsPDF('portrait', 'mm', 'a4')
                let name = ''
                let el = document.getElementById('printMe')
                if (type === 'Estimate') {
                    name = `Devis-${item.estimateNumber}`
                    //doc.text('Facture n°' + item.estimateNumber, 145, 10)
                } else {
                    name = `Facture-${item.invoiceNumber}`
                    //doc.text('Facture n°' + item.invoiceNumber, 135, 50)
                }
                html2canvas(el).then(canvas => {
                    this.setpixelated(canvas.getContext('2d'));
                    let imgData = canvas.toDataURL()
                    doc.addImage(imgData, 'JPEG', 0, 0, canvas.width * 0.25, canvas.height * 0.25)
                    doc.save(name + '.pdf')
                })

                /*doc.setFont("helvetica")
                //USER
                doc.text(item.staticUser.commercialName, 10, 10)
                doc.text(item.staticUser.name.firstname + ' ' + item.staticUser.name.lastname, 10, 15)
                doc.text(item.staticUser.address.street, 10, 20)
                //doc.text(item.staticUser.address.street2, 10, 27)
                doc.text(item.staticUser.address.postalcode + ' ' + item.staticUser.address.city, 10, 25)
                doc.text(item.staticUser.address.country, 10, 30)
                //CLIENT
                doc.text(item.staticClient.company, 145, 15)
                doc.text(item.staticClient.name.firstname + " " + item.staticClient.name.lastname, 145, 20)
                doc.save(name+'.pdf')*/

                /*html2canvas(el).then(canvas => {
                    this.output = canvas.toDataURL()
                    pdf.addImage(this.output, 'JPEG', 0, 0, canvas.width*0.25, canvas.height*0.25)
                    pdf.save('devis.pdf')
                })*/


            },

            setpixelated(context) {
                context['imageSmoothingEnabled'] = false;
                context['mozImageSmoothingEnabled'] = false;
                context['oImageSmoothingEnabled'] = false;
                context['webkitImageSmoothingEnabled'] = false;
                context['msImageSmoothingEnabled'] = false;
            },


            printWithScreen() {
                let pdf = new jsPDF('portrait', 'mm', 'a4')
                let el = document.getElementById('printMe')
                html2canvas(el).then(canvas => {
                    this.output = canvas.toDataURL()
                    pdf.addImage(this.output, 'JPEG', 0, 0, canvas.width * 0.25, canvas.height * 0.25)
                    pdf.save('devis.pdf')
                })
            },

            /**
             * Change loader state
             */
            loaderController() {
                this.loader = !this.loader
            },

            /**
             * Unselect estimate
             */
            resetEstimate() {
                this.editionMode = false
                this.defaultEstimate.products = []
                this.selectedEstimate = {...this.defaultEstimate}
            },

            /**
             * Select estimate and start watching change
             * @param item
             */
            itemSelection(item) {
                this.editionMode = false
                this.selectedEstimate = item
                this.watchObject = this.selectedEstimate
                this.watchModification()
            },

            /**
             * Change UI for create a new estimate
             */
            addEstimate() {
                this.resetEstimate()
                this.editionMode = true
                this.selectedEstimate.state = 'DRAFT'
                this.selectedEstimate.id = 1
            },

            /**
             * Call apollo to create estimate
             * @param estimate
             */
            createEstimate(estimate) {
                delete estimate.id
                this.loaderController()
                this.$apollo.mutate({
                    mutation: Estimate.CREATE,
                    variables: {
                        ...estimate
                    }
                }).then(() => {
                    this.loaderController()
                    this.getEstimates()
                }).catch(error => {
                    this.loaderController()
                    this.error = error
                })
            },

            /**
             * Call apollo to update estimate
             * @param estimate
             */
            updateEstimate(estimate) {
                this.loaderController()
                this.$apollo.mutate({
                    mutation: Estimate.UPDATE,
                    variables: {
                        ...estimate
                    }
                }).then(() => {
                    this.loaderController()
                    this.getEstimates()
                }).catch(error => {
                    this.loaderController()
                    this.error = error
                })
            },

            /**
             * Check if is a new estimate or a modified
             */
            updateOrCreateEstimate() {
                if (!this.selectedEstimate.client) {
                    this.error = "Vous n'avez pas sélectionner de client."
                    return
                } else if (this.selectedEstimate.products.length <= 0) {
                    this.error = "Vous n'avez pas sélectionner de produit."
                    return;
                }
                let estimate = this.selectedEstimate
                estimate.clientId = estimate.client.id
                delete estimate.client

                if (this.selectedEstimate.id === 1) {
                    this.createEstimate(estimate)
                } else if (this.selectedEstimate.id !== 0 && this.selectedEstimate.id !== 1) {
                    this.updateEstimate(estimate)
                }
            },

            /**
             * Change estimate state ("PENDING", "DONE")
             */
            changeEstimateState() {
                this.loaderController()
                let state = this.selectedEstimate.state
                if (state === "PENDING") {
                    state = 1
                } else if (state === "SEND") {
                    state = 2
                } else if (state === "DONE") {
                    state = 3
                }
                this.$apollo.mutate({
                    mutation: Estimate.CHANGE_STATE,
                    variables: {
                        id: this.selectedEstimate.id,
                        state
                    }
                }).then(() => {
                    this.loaderController()
                    this.getEstimates()
                }).catch(error => {
                    this.loaderController()
                    this.error = error
                })
            },

            /**
             * Format date to ISO for Date picker
             * @param date
             * @returns {string}
             */
            formatDateToISO(date) {
                return new Date(date).toISOString().substr(0, 10)
            },

            /**
             * Call apollo to get all estimates
             */
            getEstimates() {
                this.loaderController()
                this.$apollo.queries.meEstimates.refetch()
                    .then(() => {
                        this.loaderController()
                        this.resetEstimate()
                    }).catch(error => {
                    this.loaderController()
                    this.error = error
                })
            },

            /**
             * Change estimate state to "PENDING", data cannot be modified
             */
            validateEstimate() {
                this.loaderController()
                this.$apollo.mutate({
                    mutation: Estimate.VALIDATE_ESTIMATE,
                    variables: {
                        id: this.selectedEstimate.id
                    }
                }).then(() => {
                    this.loaderController()
                    this.getEstimates()
                }).catch(error => {
                    this.loaderController()
                    this.error = error
                })
            },

            /**
             * Handle modal on delete
             */
            modalDelete() {
                this.modal = true
                this.modalMessage = "Voulez vous supprimer ce devis ?"
            },

            /**
             * Call apollo to delete selected estimate
             */
            deleteEstimate() {
                this.modal = false
                this.loaderController()
                this.$apollo.mutate({
                    mutation: Estimate.DELETE,
                    variables: {
                        id: this.selectedEstimate.id
                    }
                }).then(() => {
                    this.loaderController()
                    this.getEstimates()
                }).catch(error => {
                    this.loaderController()
                    this.error = error
                })
            },

            /**
             * Watch all modification on the selected estimate
             */
            watchModification() {
                if (this.unwatch !== '') {
                    this.unwatch()
                }
                this.unwatch = this.$watch('watchObject', () => {
                    this.editionMode = true
                    this.unwatch()
                }, {deep: true})
            },

            /**
             * Search Method between estimate data and search bar
             * @param item
             * @returns {boolean}
             */
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

            /**
             * Change the chip color
             * @param item
             * @returns {string}
             */
            docStateColor(item) {
                switch (item) {
                    case "DRAFT":
                        return "grey"
                    case "PENDING":
                        return "info"
                    case "SEND":
                        return "warning"
                    case "DONE":
                        return "success"
                }
            }
        },
        computed: {
            /**
             * Return filtered search
             * @returns {*[]|Array}
             */
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
        filters: {
            /**
             * Translate state
             * @param value
             * @returns {string}
             */
            docStateTranslation(value) {
                switch (value) {
                    case "PENDING":
                        return "EN ATTENTE"
                    case "SEND":
                        return "ENVOYÉ"
                    case "DONE":
                        return "VALIDÉ"
                }
            }
        }
    }
</script>

<style scoped>
    #custom-list {
        overflow-y: auto;
        max-height: calc(100vh - 88px)
    }
</style>