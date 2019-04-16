<template>
    <v-card>
        <Alert type="error" :message="error"></Alert>
        <v-card-text v-if="itemArg.id !== 0">
            <v-container>
                <v-layout row wrap>
                    <v-flex grow v-if="itemArg.staticUser">
                        <strong class="title ma-0">{{itemArg.staticUser.commercialName}}</strong>
                        <p class="subheading ma-0">{{itemArg.staticUser.name.firstname}}
                            {{itemArg.staticUser.name.lastname}}</p>
                        <p class="subheading ma-0">{{itemArg.staticUser.address.street}}</p>
                        <p class="subheading ma-0">{{itemArg.staticUser.address.street2}}</p>
                        <p class="subheading ma-0">{{itemArg.staticUser.address.postalcode}}
                            {{itemArg.staticUser.address.city}}</p>
                        <p class="subheading ma-0">{{itemArg.staticUser.address.country}}</p>
                    </v-flex>
                    <v-flex grow v-else>
                        <strong class="title ma-0">{{me.commercialName}}</strong>
                        <p class="subheading ma-0">{{me.name.firstname}} {{me.name.lastname}}</p>
                        <p class="subheading ma-0">{{me.address.street}}</p>
                        <p class="subheading ma-0">{{me.address.street2}}</p>
                        <p class="subheading ma-0">{{me.address.postalcode}} {{me.address.city}}</p>
                        <p class="subheading ma-0">{{me.address.country}}</p>
                    </v-flex>
                    <v-flex shrink>
                        <p v-if="itemArg.id !== 1 && itemArg.estimateNumber" class="title ma-0">Devis
                            n°{{itemArg.estimateNumber}}</p>
                        <p v-else class="title ma-0">BROUILLON</p>

                        <div v-if="item.state === 'DRAFT' && !!itemArg.client">
                            <v-btn @click="changeClient" small flat>Changer de client</v-btn>
                        </div>

                        <div v-if="!itemArg.client && !itemArg.staticClient">
                            <v-select v-model="itemArg.client" return-object :items="meClients" label="Client"
                                      class="mb-0">
                                <template v-slot:item="{item}">
                                    {{item.name.firstname}} {{item.name.lastname}}
                                </template>
                                <template v-slot:selection="{item}">
                                    {{item.name.firstname}} {{item.name.lastname}}
                                </template>
                            </v-select>
                        </div>

                        <div v-if="!!itemArg.client && !itemArg.staticClient">
                            <p class="subheading ma-0">
                                {{itemArg.client.name.firstname}}
                                {{itemArg.client.name.lastname}}
                            </p>
                            <p class="subheading ma-0">{{itemArg.client.company}}</p>
                            <p class="subheading ma-0">{{itemArg.client.address.street}}</p>
                            <p class="subheading ma-0">{{itemArg.client.address.street2}}</p>
                            <p class="subheading ma-0">{{itemArg.client.address.postalcode}}
                                {{itemArg.client.address.city}}</p>
                            <p class="subheading ma-0">{{itemArg.client.address.country}}</p>
                        </div>
                        <div v-else-if="itemArg.staticClient">
                            <p class="subheading ma-0">
                                {{itemArg.staticClient.name.firstname}}
                                {{itemArg.staticClient.name.lastname}}
                            </p>
                            <p class="subheading ma-0">{{itemArg.staticClient.company}}</p>
                            <p class="subheading ma-0">{{itemArg.staticClient.address.street}}</p>
                            <p class="subheading ma-0">{{itemArg.staticClient.address.street2}}</p>
                            <p class="subheading ma-0">{{itemArg.staticClient.address.postalcode}}
                                {{itemArg.staticClient.address.city}}</p>
                            <p class="subheading ma-0">{{itemArg.staticClient.address.country}}</p>
                        </div>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs12 md6>
                        <br/>
                        <br/>
                        <v-text-field v-if="itemArg.id !== 1" class="ma-0 pa-0" :value="cleanDate(itemArg.createdAt)"
                                      readonly label="Date d'émission" disabled></v-text-field>
                        <v-menu v-model="startedDateMenu" :close-on-content-click="false"
                                :nudge-right="40" lazy
                                transition="scale-transition" offset-y full-width min-width="290px">
                            <template v-slot:activator="{ on }">
                                <v-text-field class="ma-0 pa-0"
                                              :value="cleanDate(itemArg.startedDate)"
                                              label="Date de début"
                                              readonly v-on="on"
                                              :disabled="itemArg.state !== 'DRAFT'"></v-text-field>
                            </template>
                            <v-date-picker v-model="startedDate" @input="startedDateMenu = false"
                                           locale="fr"></v-date-picker>
                        </v-menu>
                        <v-menu v-model="deliveryDateMenu" :close-on-content-click="false"
                                :nudge-right="40" lazy transition="scale-transition" offset-y full-width
                                min-width="290px">
                            <template v-slot:activator="{ on }">
                                <v-text-field class="ma-0 pa-0"
                                              :value="cleanDate(itemArg.deliveryDate)"
                                              label="Date de livraison" readonly
                                              v-on="on"
                                              :disabled="itemArg.state !== 'DRAFT'"></v-text-field>
                            </template>
                            <v-date-picker v-model="deliveryDate"
                                           @input="deliveryDateMenu = false"
                                           locale="fr"></v-date-picker>
                        </v-menu>
                        <v-textarea v-if="itemArg.message || itemArg.state === 'DRAFT'"
                                    :disabled="itemArg.state !== 'DRAFT'" label="Informations générales" no-resize
                                    rows="3" v-model="itemArg.message"></v-textarea>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-container>
                <v-data-table hide-actions :headers="tableHeader" :items="staticProducts">
                    <template v-slot:items="props">
                        <td v-if="props.item.product.description">{{ props.item.product.description }}</td>
                        <td>{{ props.item.product.priceht }}</td>
                        <td>{{props.item.quantity}}</td>
                        <td>{{props.item.product.unit || 'N/A'}}</td>
                        <td>{{Math.round((props.item.product.priceht * props.item.quantity) * 100) / 100}}</td>
                        <td class="justify-center layout px-0" v-if="itemArg.state === 'DRAFT'">
                            <v-icon @click="deleteProduct(props.item)">delete</v-icon>
                        </td>
                    </template>
                    <template v-slot:no-data>
                        Aucun produits
                    </template>
                </v-data-table>
                <v-container fluid grid-list-sm v-if="item.state === 'DRAFT'">
                    <v-layout row wrap>
                        <v-flex xs12 md4>
                            <v-select v-model="tempProduct" return-object :items="meProducts" label="Produit"
                                      class="mb-0">
                                <template v-slot:item="{item}">
                                    {{item.description}}
                                </template>
                                <template v-slot:selection="{item}">
                                    {{item.description}}
                                </template>
                            </v-select>
                        </v-flex>
                        <v-flex xs12 md4>
                            <v-text-field type="number" min="1" step="1" v-model="tempQuantity"
                                          label="Quantité"></v-text-field>
                        </v-flex>
                        <v-flex xs12 md4>
                            <v-btn flat @click="addProduct">Ajouter un produit</v-btn>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-container>
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12 md6>
                        <v-menu v-model="validityDateMenu" :close-on-content-click="false"
                                :nudge-right="40" lazy
                                transition="scale-transition" offset-y full-width min-width="290px">
                            <template v-slot:activator="{ on }">
                                <v-text-field class="ma-0 pa-0"
                                              :value="cleanDate(itemArg.validityDate)"
                                              label="Date de validité" readonly
                                              v-on="on"
                                              :disabled="itemArg.state !== 'DRAFT'"></v-text-field>
                            </template>
                            <v-date-picker v-model="validityDate"
                                           @input="validityDateMenu = false"
                                           locale="fr"></v-date-picker>
                        </v-menu>
                        <p class="subheading ma-0" v-if="me.paymentInfo">Condition de règlement: {{me.paymentInfo}}</p>
                        <v-textarea v-if="itemArg.footNote || itemArg.state === 'DRAFT'"
                                    :disabled="itemArg.state !== 'DRAFT'" label="Informations supplémentaires" no-resize
                                    rows="3" v-model="itemArg.footNote"></v-textarea>
                    </v-flex>
                    <v-flex xs12 md6>
                        <p class="subheading ma-0 text-xs-right" v-if="!me.useVAT">TVA non applicable, article 293 B du
                            CGI</p>
                        <v-layout row>
                            <v-flex md6>
                                <p class="subheading ma-0 text-xs-right">Total HT</p>
                            </v-flex>
                            <v-flex md6>
                                <p class="subheading ma-0 text-xs-right">{{itemArg.price}}€</p>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex md6>
                                <p class="subheading ma-0 text-xs-right">Net à payer</p>
                            </v-flex>
                            <v-flex md6>
                                <p class="subheading ma-0 text-xs-right">{{itemArg.price}}€</p>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-container>
            <div v-if="itemArg.staticUser">
                <p class="body-1 text-xs-center mb-0">{{itemArg.staticUser.name.firstname}}
                    {{itemArg.staticUser.name.lastname}} - {{itemArg.staticUser.address.street}}
                    {{itemArg.staticUser.address.street2}} {{itemArg.staticUser.address.postalcode}}
                    {{itemArg.staticUser.address.city}} - {{itemArg.staticUser.email}}</p>
                <p class="body-1 text-xs-center">Siret: {{itemArg.staticUser.siret}} <span
                        v-if="itemArg.staticUser.rcs">- RCS: {{itemArg.staticUser.rcs}}</span><span
                        v-if="itemArg.staticUser.ape">- APE: {{itemArg.staticUser.ape}}</span><span
                        v-if="itemArg.staticUser.RM">- RM: {{itemArg.staticUser.RM}}</span></p>
            </div>
            <div v-else>
                <p class="body-1 text-xs-center mb-0">{{me.name.firstname}} {{me.name.lastname}} - {{me.address.street}}
                    {{me.address.street2}} {{me.address.postalcode}} {{me.address.city}} - {{me.email}}</p>
                <p class="body-1 text-xs-center">Siret: {{me.siret}} <span v-if="me.rcs">- RCS: {{me.rcs}}</span><span
                        v-if="me.ape">- APE: {{me.ape}}</span><span v-if="me.RM">- RM: {{me.RM}}</span></p>
            </div>

        </v-card-text>
        <v-card-text v-else>Veuillez sélectionner un devis.</v-card-text>
    </v-card>
</template>

<script>
    import * as moment from 'moment'
    import {Client, User, Product} from "../graphql";

    export default {
        name: "EstimateDoc",
        props: {
            item: Object,
        },
        data() {
            return {
                itemArg: this.item,
                me: {},
                meClients: [],
                meProducts: [],
                startedDateMenu: false,
                deliveryDateMenu: false,
                validityDateMenu: false,
                startedDate: new Date().toISOString().substr(0, 10),
                deliveryDate: new Date().toISOString().substr(0, 10),
                validityDate: new Date().toISOString().substr(0, 10),
                tempProduct: {},
                tempQuantity: 1,
                error: ''
            }
        },

        apollo: {
            meClients: {
                query: Client.GET_FOR_DOC
            },
            meProducts: {
                query: Product.GET
            },
            me: {
                query: User.GET
            }
        },
        methods: {
            changeClient() {
                let estimate = Object.assign({}, this.itemArg);
                delete estimate.client;
                this.itemArg = Object.assign({}, estimate)
            },

            cleanDate(date) {
                return moment(date).format('L')
            },

            deleteProduct(item) {
                const index = this.itemArg.products.indexOf(item);
                this.itemArg.products.splice(index, 1);
                this.updatePrice()
            },

            updatePrice() {
                let tempPrice = 0;
                for (let i = 0; i < this.itemArg.products.length; i++) {
                    tempPrice += this.itemArg.products[i].product.pricettc * this.itemArg.products[i].quantity
                }
                this.itemArg.price = tempPrice
            },

            addProduct() {
                if (this.tempQuantity <= 0) {
                    this.error = "Impossible d'ajouter un produit sans quantité."
                } else if (!Object.keys(this.tempProduct).length) {
                    this.error = "Vous n'avez pas sélectionner de produit."
                } else {
                    let tempProduct = this.tempProduct;
                    let quantity = this.tempQuantity;
                    let product = {product: tempProduct, quantity: quantity};
                    this.itemArg.products.push(product);
                    this.updatePrice()
                }
            },
        },
        computed: {
            staticProducts() {
                if (this.itemArg.state !== "DRAFT") {
                    return this.itemArg.staticProducts
                } else {
                    return this.itemArg.products
                }
            },
            tableHeader() {
                let headers = [];
                if (this.itemArg.state !== "DRAFT") {
                    headers = [
                        {text: 'Désignation', sortable: false, value: 'description'},
                        {text: 'Prix unitaire', sortable: false, value: 'priceht'},
                        {text: 'Quantité', sortable: false, value: 'quantity'},
                        {text: 'Unité', sortable: false, value: 'unit'},
                        {text: 'Montant HT', sortable: false, value: 'priceht'},
                    ]
                } else {
                    headers = [
                        {text: 'Désignation', sortable: false, value: 'description'},
                        {text: 'Prix unitaire', sortable: false, value: 'priceht'},
                        {text: 'Quantité', sortable: false, value: 'quantity'},
                        {text: 'Unité', sortable: false, value: 'unit'},
                        {text: 'Montant HT', sortable: false, value: 'priceht'},
                        {text: 'Actions', sortable: false, align: 'center'}
                    ]
                }
                return headers
            }
        },
        watch: {
            item(value) {
                this.itemArg = value
            },
            startedDate(value) {
                this.itemArg.startedDate = value
            },
            deliveryDate(value) {
                this.itemArg.deliveryDate = value
            },
            validityDate(value) {
                this.itemArg.validityDate = value
            },
        }
    }
</script>