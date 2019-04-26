<template>
    <div>
        <Loader :visible="loader"></Loader>
        <Modal :visibility="modal.visibility" :message="modal.message" v-on:cancel="modal.visibility = $event"
               v-on:submit="deleteItem"></Modal>
        <v-snackbar v-model="editionMode" :timeout="snackTimeOut" color="primary" right>
            Mode édition
            <v-btn dark icon @click="updateOrCreateItem">
                <v-icon>save</v-icon>
            </v-btn>
        </v-snackbar>

        <v-container fluid>
            <v-toolbar dark color="primary" class="mb-2 hidden-print-only">
                <v-toolbar-items>
                    <v-text-field flat solo-inverted v-model="search" prepend-icon="search" label="Recherche"
                                  class="hidden-sm-and-down mt-2"></v-text-field>
                </v-toolbar-items>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-select v-if="selectedItem.state !== 'DRAFT' && selectedItem.id !== 0" flat solo-inverted
                              v-model="selectedItem.state" :items="states" label="État du devis"
                              class="mt-2" @input="changeItemState">
                        <template v-slot:item="{item}">
                            <v-chip :color="docStateColor(item)" text-color="white">{{item | docStateTranslation}}
                            </v-chip>
                        </template>
                        <template v-slot:selection="{item}">
                            <v-chip :color="docStateColor(item)" text-color="white">{{item | docStateTranslation}}
                            </v-chip>
                        </template>
                    </v-select>
                    <v-btn icon v-if="selectedItem.id !== 0 && selectedItem.state !== 'DRAFT'" @click="print">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on">print</v-icon>
                            </template>
                            <span>Imprimer</span>
                        </v-tooltip>
                    </v-btn>

                    <v-btn icon v-if="selectedItem.state === 'DRAFT' && selectedItem.id !== 1"
                           @click="validateItem">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on">done</v-icon>
                            </template>
                            <span>Valider</span>
                        </v-tooltip>
                    </v-btn>

                    <v-btn icon @click="addItem" v-if="selectedItem.id !== 1">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on">add</v-icon>
                            </template>
                            <span>Nouveau document</span>
                        </v-tooltip>
                    </v-btn>

                    <v-btn icon v-if="selectedItem.id !== 0 && editionMode && selectedItem.state === 'DRAFT'"
                           @click="updateOrCreateItem">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on">save</v-icon>
                            </template>
                            <span>Sauvegarder</span>
                        </v-tooltip>
                    </v-btn>

                    <v-btn icon v-if="selectedItem.id !== 1 && selectedItem.id !== 0 && selectedItem.state === 'DRAFT'"
                           @click="modalDelete">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on">delete</v-icon>
                            </template>
                            <span>Supprimer</span>
                        </v-tooltip>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-layout row wrap>
                <v-flex xs12 md6 class="hidden-print-only" order-xs2 order-md1>
                    <List :items="filteredSearch" :type="typeArg" v-on:itemSelection="itemSelection($event)"
                          :selected-item="selectedItem"></List>
                </v-flex>
                <v-flex xs12 md6 order-xs1 order-md2>
                    <Alert type="error" :message="error"></Alert>
                    <EstimateDoc v-if="typeArg === 'Estimate'" :item="selectedItem"></EstimateDoc>
                    <InvoiceDoc v-else :item="selectedItem"></InvoiceDoc>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import {Estimate, Invoice} from "../graphql";
    import InvoiceDoc from "./InvoiceDoc";
    import EstimateDoc from "./EstimateDoc";
    import List from "./List"

    export default {
        name: "DocPage",
        components: {InvoiceDoc, EstimateDoc, List},
        props: {
            type: String,
        },
        data() {
            return {
                typeArg: this.type,
                loader: false,
                editionMode: false,
                snackTimeOut: 0,
                search: '',
                error: '',
                unwatch: '',
                watchObject: {},
                items: [],
                states: ["PENDING", "SEND", "DONE"],
                selectedItem: {
                    id: 0
                },
                defaultEstimate: {
                    id: 0,
                    message: '',
                    footNote: '',
                    deliveryDate: new Date().toISOString(),
                    startedDate: new Date().toISOString(),
                    validityDate: new Date().toISOString(),
                    products: [],
                    price: 0
                },
                defaultInvoice: {
                    id: 0,
                    message: '',
                    footNote: '',
                    products: [],
                    price: 0,
                    billingDate: new Date().toISOString(),
                    lateFee: 0
                },
                modal: {
                    visibility: false,
                    message: ''
                }
            }
        },

        created() {
            if (this.typeArg === "Estimate") {
                this.$apollo.addSmartQuery('meEstimates', {
                    query: Estimate.GET
                });
                this.getEstimates()
            } else {
                this.$apollo.addSmartQuery('meInvoices', {
                    query: Invoice.GET
                });
                this.getInvoices()
            }
        },
        methods: {
            docStateColor(item) {
                switch (item) {
                    case "DRAFT":
                        return "grey";
                    case "PENDING":
                        return "info";
                    case "SEND":
                        return "warning";
                    case "DONE":
                        return "success"
                }
            },

            loaderController() {
                this.loader = !this.loader
            },

            resetItem() {
                this.error = '';
                this.editionMode = false;
                if (this.typeArg === "Estimate") {
                    this.defaultEstimate.products = [];
                    this.selectedItem = {...this.defaultEstimate}
                } else {
                    this.defaultInvoice.products = [];
                    this.selectedItem = {...this.defaultInvoice}
                }
            },

            itemSelection(item) {
                this.editionMode = false;
                this.selectedItem = item;
                this.watchObject = this.selectedItem;
                this.watchModification()
            },
            getEstimates() {
                this.resetItem();
                this.loaderController();
                this.$apollo.queries.meEstimates
                    .refetch()
                    .then(result => {
                        this.loaderController();
                        this.items = result.data.meEstimates
                    })
                    .catch(error => {
                        this.loaderController();
                        this.error = error.message
                    })
            },

            createEstimate(estimate) {
                this.loaderController();
                this.$apollo.mutate({
                    mutation: Estimate.CREATE,
                    variables: {
                        ...estimate
                    },
                }).then(() => {
                    this.loaderController();
                    this.getEstimates()
                }).catch(error => {
                    this.loaderController();
                    this.error = error
                })
            },

            updateEstimate(estimate) {
                this.loaderController();
                this.$apollo.mutate({
                    mutation: Estimate.UPDATE,
                    variables: {
                        ...estimate
                    }
                }).then(() => {
                    this.loaderController();
                    this.getEstimates()
                }).catch(error => {
                    this.loaderController();
                    this.error = error.message
                })
            },

            changeEstimateState(id, state) {
                this.loaderController();
                this.$apollo.mutate({
                    mutation: Estimate.CHANGE_STATE,
                    variables: {
                        id: id,
                        state: state
                    }
                }).then(() => {
                    this.loaderController();
                    this.getEstimates()
                }).catch(error => {
                    this.loaderController();
                    this.error = error.message
                })
            },

            validateEstimate(id) {
                this.loaderController();
                this.$apollo.mutate({
                    mutation: Estimate.VALIDATE_ESTIMATE,
                    variables: {
                        id: id
                    }
                }).then(() => {
                    this.loaderController();
                    this.getEstimates()
                }).catch(error => {
                    this.loaderController();
                    this.error = error.message
                })
            },

            deleteEstimate(id) {
                this.loaderController();
                this.$apollo.mutate({
                    mutation: Estimate.DELETE,
                    variables: {
                        id: id
                    },
                }).then(() => {
                    this.loaderController();
                    this.getEstimates()
                }).catch(error => {
                    this.loaderController();
                    this.error = error.message
                })
            },

            getInvoices() {
                this.resetItem();
                this.loaderController();
                this.$apollo.queries.meInvoices
                    .refetch()
                    .then(result => {
                        this.loaderController();
                        this.items = result.data.meInvoices
                    })
                    .catch(error => {
                        this.loaderController();
                        this.error = error.message
                    })
            },

            createInvoice(invoice) {
                this.loaderController();
                this.$apollo.mutate({
                    mutation: Invoice.CREATE,
                    variables: {
                        ...invoice
                    }
                }).then(() => {
                    this.loaderController();
                    this.getInvoices()
                }).catch(error => {
                    this.loaderController();
                    this.error = error.message
                })
            },

            updateInvoice(invoice) {
                this.loaderController();
                this.$apollo.mutate({
                    mutation: Invoice.UPDATE,
                    variables: {
                        ...invoice
                    }
                }).then(() => {
                    this.loaderController();
                    this.getInvoices()
                }).catch(error => {
                    this.loaderController();
                    this.error = error.message
                })
            },

            changeInvoiceState(id, state) {
                this.loaderController();
                this.$apollo.mutate({
                    mutation: Invoice.CHANGE_STATE,
                    variables: {
                        id: id,
                        state: state
                    }
                }).then(() => {
                    this.loaderController();
                    this.getInvoices()
                }).catch(error => {
                    this.loaderController();
                    this.error = error.message
                })
            },

            validateInvoice(id) {
                this.loaderController();
                this.$apollo.mutate({
                    mutation: Invoice.VALIDATE_INVOICE,
                    variables: {
                        id: id
                    }
                }).then(() => {
                    this.loaderController();
                    this.getInvoices()
                }).catch(error => {
                    this.loaderController();
                    this.error = error.message
                })
            },

            deleteInvoice(id) {
                this.loaderController();
                this.$apollo.mutate({
                    mutation: Invoice.DELETE,
                    variables: {
                        id: id
                    }
                }).then(() => {
                    this.loaderController();
                    this.getInvoices()
                }).catch(error => {
                    this.loaderController();
                    this.error = error.message
                })
            },

            changeItemState() {
                let state = this.selectedItem.state;
                if (state === "PENDING") {
                    state = 1
                } else if (state === "SEND") {
                    state = 2
                } else if (state === "DONE") {
                    state = 3
                }
                if (this.typeArg === "Estimate") {
                    this.changeEstimateState(this.selectedItem.id, state)
                } else {
                    this.changeInvoiceState(this.selectedItem.id, state)
                }
            },

            validateItem() {
                if (this.typeArg === "Estimate") {
                    this.validateEstimate(this.selectedItem.id)
                } else {
                    this.validateInvoice(this.selectedItem.id)
                }
            },

            deleteItem() {
                this.modal.visibility = false;
                this.modal.message = '';
                if (this.typeArg === "Estimate") {
                    this.deleteEstimate(this.selectedItem.id)
                } else {
                    this.deleteInvoice(this.selectedItem.id)
                }
            },

            addItem() {
                this.resetItem();
                this.editionMode = true;
                this.selectedItem.state = 'DRAFT';
                this.selectedItem.id = 1
            },

            formatDateToISO(date) {
                return new Date(date).toISOString().substr(0, 10)
            },

            updateOrCreateItem() {
                if (!this.selectedItem.client) {
                    this.error = "Vous n'avez pas sélectionné de client.";
                    return
                } else if (this.selectedItem.products.length <= 0) {
                    this.error = "Vous n'avez pas sélectionné de produit.";
                    return
                }
                let item = this.selectedItem;
                item.clientId = item.client.id;
                delete item.client;
                if (this.typeArg === "Estimate") {
                    item.startedDate = this.formatDateToISO(item.startedDate);
                    item.deliveryDate = this.formatDateToISO(item.deliveryDate);
                    item.validityDate = this.formatDateToISO(item.validityDate);
                    if (item.id === 1) {
                        delete item.id;
                        this.createEstimate(item)
                    } else if (item.id !== 0 && item.id !== 1) {
                        this.updateEstimate(item)
                    }
                } else {
                    if(!this.selectedItem.paymentCondition && this.selectedItem.paymentCondition !== 0){
                        this.error = "Vous n'avez pas choisi de condition de paiement.";
                        return;
                    }
                    if (item.id === 1) {
                        delete item.id;
                        this.createInvoice(item)
                    } else if (item.id !== 0 && item.id !== 1) {
                        this.updateInvoice(item)
                    }
                }
            },
            modalDelete() {
                this.modal.visibility = true;
                this.modal.message = "Voulez vous supprimer ?"
            },

            watchModification() {
                if (this.unwatch !== '') {
                    this.unwatch()
                }
                this.unwatch = this.$watch('watchObject', () => {
                    this.editionMode = true;
                    this.unwatch()
                }, {deep: true})
            },

            print() {
                window.print()
            },

            searchMethod(item) {
                let tempSearch = this.search.toLowerCase();
                if (item.state !== "DRAFT") {
                    if (this.typeArg === "Estimate") {
                        if (item.estimateNumber.toString().toLowerCase().match(tempSearch)) return true
                    } else {
                        if (item.invoiceNumber.toString().toLowerCase().match(tempSearch)) return true
                    }
                    if (item.staticClient.name.firstname.toString().toLowerCase().match(tempSearch)) return true;
                    if (item.staticClient.name.lastname.toString().toLowerCase().match(tempSearch)) return true;
                    if (item.staticClient.company.toString().toLowerCase().match(tempSearch)) return true
                } else {
                    if (item.client.name.firstname.toString().toLowerCase().match(tempSearch)) return true;
                    if (item.client.name.lastname.toString().toLowerCase().match(tempSearch)) return true;
                    if (item.client.company.toString().toLowerCase().match(tempSearch)) return true
                }
            },
        },
        computed: {
            filteredSearch() {
                if (this.search) {
                    return this.items.filter(item => {
                        return this.searchMethod(item)
                    })
                } else {
                    return this.items
                }
            },
        },
        watch: {
            type(value) {
                this.typeArg = value
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
                        return "EN ATTENTE";
                    case "SEND":
                        return "ENVOYÉ";
                    case "DONE":
                        return "VALIDÉ"
                }
            }
        }
    }
</script>