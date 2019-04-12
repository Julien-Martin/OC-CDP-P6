<template>
    <div>
        <Loader :visible="loader"></Loader>
        <Modal :visibility="modal.active" :title="modal.title" :message="modal.message" v-on:cancel="clearModal" v-on:submit="deleteClient"></Modal>
        <v-container fluid>
            <v-card>
                <Alert type="error" :message="error"></Alert>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Mes clients</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark class="mb-2" v-on="on">Nouveau client</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs12 sm6>
                                            <v-text-field v-model="editedItem.name.firstname"
                                                          v-validate="'required'" name="prénom"
                                                          :error-messages="errors.collect('prénom')"
                                                          label="Prénom"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6>
                                            <v-text-field v-model="editedItem.name.lastname"
                                                          v-validate="'required'" name="nom"
                                                          :error-messages="errors.collect('nom')"
                                                          label="Nom"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-select v-model="editedItem.legalForm" :items="legalForms"
                                                      item-text="title" item-value="id"
                                                      v-validate="'required'" name="forme juridique"
                                                      :error-messages="errors.collect('forme juridique')"
                                                      label="Forme juridique"></v-select>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="editedItem.company"
                                                          label="Nom de l'entreprise"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6>
                                            <v-text-field v-model="editedItem.email" type="email"
                                                          v-validate="'email'" name="adresse email"
                                                          :error-messages="errors.collect('adresse email')"
                                                          label="Adresse email"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6>
                                            <v-text-field v-model="editedItem.phone" type="tel" label="Téléphone"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="editedItem.address.street"
                                                          v-validate="'required'" name="adresse ligne 1"
                                                          :error-messages="errors.collect('adresse ligne 1')"
                                                          label="Adresse ligne 1"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="editedItem.address.street2"
                                                          label="Adresse ligne 2"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6>
                                            <v-text-field v-model="editedItem.address.city"
                                                          v-validate="'required'" name="ville"
                                                          :error-messages="errors.collect('ville')"
                                                          label="Ville"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6>
                                            <v-text-field v-model="editedItem.address.postalcode"
                                                          v-validate="'required'" name="code postal"
                                                          :error-messages="errors.collect('code postal')"
                                                          label="Code postal"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="editedItem.address.country"
                                                          v-validate="'required'" name="pays"
                                                          :error-messages="errors.collect('pays')"
                                                          label="Pays"></v-text-field>
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
                <v-data-table :headers="headers" :items="meClients" class="elevation-1" hide-actions>
                    <template v-slot:items="props">
                        <td>{{ props.item.name.firstname }} {{ props.item.name.lastname }}</td>
                        <td>{{ props.item.company }}</td>
                        <td>{{ props.item.email }}</td>
                        <td>{{ props.item.phone }}</td>
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
    import {LegalForm, Client} from "../graphql";

    export default {
        data: () => ({
            error: '',
            dialog: false,
            loader: false,
            modal: {
                active: false,
                title: '',
                message: ''
            },
            headers: [
                {
                    text: 'Nom',
                    value: 'name',
                },
                {
                    text: 'Entreprise',
                    value: 'company'
                },
                {
                    text: 'Adresse e-mail',
                    value: 'email'
                },
                {
                    text: 'Téléphone',
                    value: 'phone'
                },
                {text: 'Actions', value: 'name', sortable: false, align: 'center'}
            ],
            meClients: [],
            legalForms: [],
            editedIndex: -1,
            clientId: '',
            editedItem: {
                name: {
                    firstname: '',
                    lastname: ''
                },
                legalForm: '',
                email: '',
                phone: '',
                address: {
                    street: '',
                    street2: '',
                    postalcode: '',
                    city: '',
                    country: ''
                },
                company: ''
            },
            defaultItem: {
                name: {
                    firstname: '',
                    lastname: ''
                },
                legalForm: '',
                email: '',
                phone: '',
                address: {
                    street: '',
                    street2: '',
                    postalcode: '',
                    city: '',
                    country: ''
                },
                company: ''
            }
        }),

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'Nouveau client' : 'Modifier un client'
            }
        },

        watch: {
            dialog(val) {
                val || this.close()
            }
        },

        apollo: {
            legalForms: {
                query: LegalForm.GET
            },
            meClients: {
                query: Client.GET
            }
        },
        created() {
            this.getClients()
        },

        methods: {

            /**
             * Change loader state
             */
            loaderController() {
                this.loader = !this.loader
            },

            getClients() {
                this.loaderController();
                this.$apollo.queries.meClients.refetch()
                    .then(() => {
                        this.loaderController()
                    })
                    .catch(error => {
                        this.loaderController()
                        this.error = error
                    })
            },

            updateOrCreateClient() {
                this.editedItem.legalForm = this.editedItem.legalForm.id ? this.editedItem.legalForm.id : this.editedItem.legalForm;
                this.editedItem.name = {create: {...this.editedItem.name}};
                this.editedItem.address = {create: {...this.editedItem.address}};
                if (this.editedIndex > -1) {
                    this.loaderController();
                    this.$apollo.mutate({
                        mutation: Client.UPDATE,
                        variables: {
                            ...this.editedItem
                        }
                    }).then(() => {
                        this.loaderController();
                        this.getClients()
                    }).catch(error => {
                        this.loaderController();
                        this.error = error
                    })
                } else {
                    this.loaderController();
                    this.$apollo.mutate({
                        mutation: Client.CREATE,
                        variables: {
                            ...this.editedItem
                        }
                    }).then(() => {
                        this.loaderController();
                        this.getClients()
                    }).catch((error) => {
                        this.loaderController();
                        this.error = error
                    })
                }
            },

            editItem(item) {
                this.editedIndex = this.meClients.indexOf(item);
                this.clientId = item.id;
                this.editedItem = Object.assign({}, item);
                this.dialog = true
            },

            clearModal() {
                this.modal.active = false;
                this.modal.title = '';
                this.modal.message = ''
            },

            deleteItem(item) {
                this.clientId = item.id;
                this.modal.active = true;
                this.modal.title = `Supprimer ${item.name.firstname} ${item.name.lastname}`;
                this.modal.message = "Êtes-vous sûr de vouloir supprimer ce client ?"
            },

            deleteClient() {
                this.loaderController();
                this.$apollo.mutate({
                    mutation: Client.DELETE,
                    variables: {
                        id: this.clientId
                    }
                }).then(() => {
                    this.loaderController();
                    this.clearModal();
                    this.getClients()
                }).catch(error => {
                    this.loaderController();
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
                        this.updateOrCreateClient();
                        this.close()
                    }
                })
            }
        }
    }
</script>