<template>
    <div>
        <Loader :visible="loader"></Loader>
        <Modal :visibility="modal.active" :title="modal.title" :message="modal.message" v-on:cancel="clearModal" v-on:submit="deleteProduct"></Modal>
        <v-container fluid>
            <v-card>
                <Alert type="error" :message="error"></Alert>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Mes produits/prestations</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark class="mb-2" v-on="on">Nouveau produit/prestation</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs12>
                                            <v-text-field v-model="editedItem.description"
                                                          v-validate="'required'" name="désignation"
                                                          :error-messages="errors.collect('désignation')"
                                                          label="Désignation"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 v-if="me.useVAT">
                                            <v-select v-model="editedItem.vat" :items="vat" label="TVA"></v-select>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field type="number" v-model.number="editedItem.pricettc"
                                                          v-validate="'required'" name="prix TTC"
                                                          :error-messages="errors.collect('prix TTC')"
                                                          label="Prix TTC"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-select v-model="editedItem.unit" :items="unit" label="Unitée"
                                                      hint="Facultatif"></v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click="close">Annuler</v-btn>
                                <v-btn color="blue darken-1" flat @click="save">Sauvegarder</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
                <v-data-table :headers="headers" :items="meProducts" class="elevation-1" hide-actions>
                    <template v-slot:items="props">
                        <td>{{ props.item.description }}</td>
                        <td>{{ props.item.vat }}</td>
                        <td>{{ props.item.pricettc }}</td>
                        <td>{{ props.item.unit || 'N/A' }}</td>
                        <td class="justify-center layout px-0">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-icon small class="mr-2" @click="editItem(props.item)" v-on="on">edit</v-icon>
                                </template>
                                <span>Modifier</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-icon small @click="deleteItem(props.item)" v-on="on">delete</v-icon>
                                </template>
                                <span>Supprimer</span>
                            </v-tooltip>
                        </td>
                    </template>
                    <template v-slot:no-data>
                        Aucune donnée
                    </template>
                </v-data-table>
            </v-card>
        </v-container>
    </div>
</template>

<script>
    import {Product} from "../graphql";
    import * as User from "../graphql/user";

    export default {
        data: () => ({
            error: '',
            dialog: false,
            meProducts: [],
            editedIndex: -1,
            productId: '',
            me: {},
            loader: false,
            vat: [0, 20, 10, 5.5, 2.1],
            unit: ["", "cm", "h", "pce", "kg", "km", "m"],
            headers: [
                {
                    text: 'Description',
                    value: 'description',
                },
                {
                    text: 'TVA',
                    value: 'vat'
                },
                {
                    text: 'Prix TTC',
                    value: 'pricettc'
                },
                {
                    text: 'Unitée',
                    value: 'unit',
                    sortable: false
                },
                {text: 'Actions', value: 'name', sortable: false, align: 'center'}
            ],
            modal: {
                active: false,
                title: '',
                message: ''
            },
            editedItem: {
                description: '',
                vat: '',
                pricettc: '',
                unit: ''
            },
            defaultItem: {
                description: '',
                vat: '',
                pricettc: '',
                unit: ''
            }
        }),

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'Nouveau produit/prestation' : 'Modifier un produit/prestation'
            }
        },

        watch: {
            dialog(val) {
                val || this.close()
            }
        },

        apollo: {
            meProducts: {
                query: Product.GET
            },
            me: {
                query: User.GET_TVA
            }
        },

        created() {
            this.getProducts()
        },

        methods: {
            /**
             * Change loader state
             */
            loaderController() {
                this.loader = !this.loader
            },

            getProducts() {
                this.loaderController();
                this.$apollo.queries.meProducts.refetch()
                    .then(() => {
                        this.loaderController()
                    }).catch(error => {
                        this.loaderController();
                    this.error = error
                })
            },

            updateOrCreateProduct() {
                if (!this.me.useVAT) {
                    this.editedItem.vat = 0
                }
                if (this.editedIndex > -1) {
                    this.$apollo.mutate({
                        mutation: Product.UPDATE,
                        variables: {
                            ...this.editedItem
                        }
                    }).then(() => {
                        this.getProducts()
                    }).catch(error => {
                        this.error = error
                    })
                } else {
                    this.$apollo.mutate({
                        mutation: Product.CREATE,
                        variables: {
                            ...this.editedItem
                        }
                    }).then(() => {
                        this.getProducts()
                    }).catch(error => {
                        this.error = error
                    })
                }
            },

            editItem(item) {
                this.editedIndex = this.meProducts.indexOf(item);
                this.productId = item.id;
                this.editedItem = Object.assign({}, item);
                this.dialog = true
            },

            clearModal() {
                this.modal.active = false;
                this.modal.title = '';
                this.modal.message = ''
            },

            deleteItem(item) {
                this.productId = item.id;
                this.modal.active = true;
                this.modal.title = 'Supprimer un produit';
                this.modal.message = "Êtes-vous sûr de vouloir supprimer ce produit ?"
            },

            deleteProduct() {
                this.clearModal();
                this.$apollo.mutate({
                    mutation: Product.DELETE,
                    variables: {
                        id: this.productId
                    }
                }).then(() => {
                    this.clearModal();
                    this.getProducts()
                }).catch(error => {
                    this.clearModal();
                    this.getProducts();
                    this.error = error.message
                })
            },

            close() {
                this.dialog = false;
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1
                }, 300)
            },

            save() {
                this.$validator.validateAll().then(valid => {
                    if(valid){
                        this.updateOrCreateProduct();
                        this.close()
                    }
                })
            }
        }
    }
</script>