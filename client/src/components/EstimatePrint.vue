<template>
    <v-card width="827">
        <v-card-text v-if="itemArg.id !== 0">
            <v-container v-if="Object.keys(itemArg).length > 0">
                <v-layout row>
                    <v-flex grow>
                        <strong class="title ma-0">{{itemArg.staticUser.commercialName}}</strong>
                        <p class="subheading ma-0">{{itemArg.staticUser.name.firstname}}
                            {{itemArg.staticUser.name.lastname}}</p>
                        <p class="subheading ma-0">{{itemArg.staticUser.address.street}}</p>
                        <p class="subheading ma-0">{{itemArg.staticUser.address.street2}}</p>
                        <p class="subheading ma-0">{{itemArg.staticUser.address.postalcode}}
                            {{itemArg.staticUser.address.city}}</p>
                        <p class="subheading ma-0">{{itemArg.staticUser.address.country}}</p>
                    </v-flex>
                    <v-flex shrink>
                        <p class="title ma-0">Devis n°{{itemArg.estimateNumber}}</p>
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
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs6>
                        <p>Date d'émission : {{cleanDate(itemArg.createdAt)}}</p>
                        <p>Date de début: {{cleanDate(itemArg.startedDate)}}</p>
                        <p>Date de livraison: {{cleanDate(itemArg.deliveryDate)}}</p>
                        <p class="mb-0">Informations générales :</p>
                        <p>{{itemArg.message}}</p>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-container>
                <v-data-table hide-actions :headers="headers" :items="itemArg.staticProducts">
                    <template v-slot:items="props">
                        <td v-if="props.item.product.description">{{ props.item.product.description }}</td>
                        <td>{{ props.item.product.priceht }}</td>
                        <td>{{props.item.quantity}}</td>
                        <td>{{props.item.product.unit || 'N/A'}}</td>
                        <td>{{Math.round((props.item.product.priceht * props.item.quantity) * 100) / 100}}</td>
                    </template>
                    <template v-slot:no-data>
                        Aucun produits
                    </template>
                </v-data-table>
            </v-container>
            <v-container>
                <v-layout row>
                    <v-flex md6>
                        <p>Date de validité: {{cleanDate(itemArg.validityDate)}}</p>
                        <!--<p class="subheading ma-0" v-if="me.paymentInfo">Condition de règlement: {{me.paymentInfo}}</p>-->
                        <p class="mb-0">Informations supplémentaires : </p>
                        <p>{{itemArg.footNote}}</p>
                    </v-flex>
                    <v-flex md6>
                        <!--<p class="subheading ma-0 text-md-right" v-if="!me.useVAT">TVA non applicable, article 293 B du CGI</p>-->
                        <v-layout row wrap>
                            <v-flex md6>
                                <p class="subheading ma-0 text-xs-right">Total HT</p>
                            </v-flex>
                            <v-flex md6>
                                <p class="subheading ma-0 text-xs-right">{{itemArg.price}}€</p>
                            </v-flex>
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
        </v-card-text>
        <v-card-text v-else>Veuillez sélectionner un devis.</v-card-text>
    </v-card>
</template>

<script>
    import * as moment from 'moment'
    export default {
        name: "EstimatePrint",
        props: {
            item: Object
        },
        data() {
            return {
                itemArg: this.item,
                headers: [
                    {text: 'Désignation', sortable: false, value: 'description'},
                    {text: 'Prix unitaire', sortable: false, value: 'priceht'},
                    {text: 'Quantité', sortable: false, value: 'quantity'},
                    {text: 'Unité', sortable: false, value: 'unit'},
                    {text: 'Montant HT', sortable: false, value: 'priceht'},
                ]
            }
        },
        methods: {
            cleanDate(date) {
                return moment(date).format('L')
            },
        },
        watch: {
            item(value) {
                this.itemArg = value
            }
        }
    }
</script>