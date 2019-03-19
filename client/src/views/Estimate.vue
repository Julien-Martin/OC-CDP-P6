<template>
  <div>
    <v-container fluid>
      <v-toolbar dark color="primary" class="mb-2">
        <v-toolbar-items>
          <v-text-field flat solo-inverted v-model="search" prepend-icon="search" label="Recherche"
                        class="hidden-sm-and-down mt-2"></v-text-field>
        </v-toolbar-items>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon>
            <v-icon>add</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>save</v-icon>
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>delete</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-layout>
        <v-flex>
          <div id="custom-list" class="elevation-1 mr-4">
            <v-list subheader two-line class="shrink elevation-1">
              <v-list-tile v-for="estimate in filteredSearch" :key="estimate.id" @click="selectItem(estimate)" :class="selectedEstimate === estimate ? 'grey lighten-3' : ''">
                <v-list-tile-content>
                  <v-list-tile-title>Devis {{estimate.estimateNumber}}</v-list-tile-title>
                  <v-list-tile-sub-title v-if="estimate.client.company">{{ estimate.client.company }}</v-list-tile-sub-title>
                  <v-list-tile-sub-title v-else>{{estimate.client.name.firstname}} {{estimate.client.name.lastname}}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-chip dark color="primary">{{estimate.state}}</v-chip>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </div>
        </v-flex>
        <v-flex>
          <v-card>
            <v-card-text v-if="selectedEstimate.id !== 0">
              <v-container>
                <v-layout row>
                  <v-flex grow>
                    <strong class="title ma-0">{{me.commercialName}}</strong>
                    <p class="subheading ma-0">{{me.name.firstname}} {{me.name.lastname}}</p>
                    <p class="subheading ma-0">{{me.address.street}}</p>
                    <p class="subheading ma-0">{{me.address.street2}}</p>
                    <p class="subheading ma-0">{{me.address.postalcode}} {{me.address.city}}</p>
                    <p class="subheading ma-0">{{me.address.country}}</p>
                  </v-flex>
                  <v-flex shrink>
                    <p class="title ma-0">Devis n°{{selectedEstimate.estimateNumber}}</p>
                    <div v-if="isDraft">
                      <v-btn @click="changeClient" small flat>Changer de client</v-btn>
                    </div>

                    <div v-if="!selectedEstimate.client">
                      <v-select v-model="selectedEstimate.client" return-object :items="meClients" label="Client" class="mb-0">
                        <template v-slot:item="{item}">
                          {{item.name.firstname}} {{item.name.lastname}}
                        </template>
                        <template v-slot:selection="{item}">
                          {{item.name.firstname}} {{item.name.lastname}}
                        </template>
                      </v-select>
                    </div>

                    <div v-if="!!selectedEstimate.client">
                      <p class="subheading ma-0">
                        {{selectedEstimate.client.name.firstname}}
                        {{selectedEstimate.client.name.lastname}}
                      </p>
                      <p class="subheading ma-0">{{selectedEstimate.client.company}}</p>
                      <p class="subheading ma-0">{{selectedEstimate.client.address.street}}</p>
                      <p class="subheading ma-0">{{selectedEstimate.client.address.street2}}</p>
                      <p class="subheading ma-0">{{selectedEstimate.client.address.postalcode}}
                        {{selectedEstimate.client.address.city}}</p>
                      <p class="subheading ma-0">{{selectedEstimate.client.address.country}}</p>
                    </div>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs6>
                    <v-text-field class="ma-0 pa-0" :value="formatDate(selectedEstimate.createdAt)" readonly
                                  label="Date d'émission" disabled></v-text-field>
                    <v-menu v-model="startedDateMenu" :close-on-content-click="false" :nudge-right="40" lazy
                            transition="scale-transition" offset-y full-width min-width="290px">
                      <template v-slot:activator="{ on }">
                        <v-text-field class="ma-0 pa-0" :value="formatDate(selectedEstimate.startedDate)" label="Date de début"
                                      readonly v-on="on"></v-text-field>
                      </template>
                      <v-date-picker v-model="selectedEstimate.startedDate"
                                     @input="startedDateMenu = false" locale="fr"></v-date-picker>
                    </v-menu>
                    <v-menu v-model="deliveryDateMenu" :close-on-content-click="false" :nudge-right="40" lazy
                            transition="scale-transition" offset-y full-width min-width="290px">
                      <template v-slot:activator="{ on }">
                        <v-text-field class="ma-0 pa-0" :value="formatDate(selectedEstimate.deliveryDate)"
                                      label="Date de livraison" readonly
                                      v-on="on"></v-text-field>
                      </template>
                      <v-date-picker v-model="selectedEstimate.deliveryDate"
                                     @input="deliveryDateMenu = false" locale="fr"></v-date-picker>
                    </v-menu>
                    <v-textarea label="Information générale" no-resize rows="3" :value="selectedEstimate.message"></v-textarea>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-container>
                <v-data-table hide-actions :headers="headers" :items="selectedEstimate.products">
                  <template v-slot:items="props">
                    <td>{{ props.item.product.description }}</td>
                    <td>{{ props.item.product.priceht }}</td>
                    <td>{{props.item.quantity}}</td>
                    <td>{{props.item.product.unit || 'N/A'}}</td>
                    <td>{{props.item.product.priceht * props.item.quantity}}</td>
                  </template>
                  <template v-slot:no-data>
                    Aucune donnée
                  </template>
                </v-data-table>
              </v-container>
              <v-container>
                <v-layout row>
                  <v-flex grow>
                    <v-menu v-model="validityDateMenu" :close-on-content-click="false" :nudge-right="40" lazy transition="scale-transition" offset-y full-width min-width="290px">
                      <template v-slot:activator="{ on }">
                        <v-text-field class="ma-0 pa-0" :value="formatDate(selectedEstimate.validityDate)"
                                      label="Date de validité" readonly v-on="on"></v-text-field>
                      </template>
                      <v-date-picker v-model="selectedEstimate.validityDate" @input="validityDateMenu = false" locale="fr"></v-date-picker>
                    </v-menu>
                    <p class="subheading ma-0">Condition de règlement: {{me.paymentInfo}}</p>
                    <v-textarea label="Information supplémentaire" no-resize rows="3" :value="selectedEstimate.footNote"></v-textarea>
                  </v-flex>
                  <v-flex shrink>
                    <p class="subheading ma-0">TVA non applicable, article 293 B du CGI</p>
                    <v-layout row wrap>
                      <v-flex md6>
                        <p class="subheading ma-0 text-xs-right">Total HT</p>
                      </v-flex>
                      <v-flex md6>
                        <p class="subheading ma-0 text-xs-right">{{selectedEstimate.price}}€</p>
                      </v-flex>
                      <v-flex md6>
                        <p class="subheading ma-0 text-xs-right">Net à payer</p>
                      </v-flex>
                      <v-flex md6>
                        <p class="subheading ma-0 text-xs-right">{{selectedEstimate.price}}€</p>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-text v-else>Nothing to show</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import {Estimate, Client, User} from "../graphql";
  import * as moment from 'moment'

  export default {
    name: "Estimate",
    data() {
      return {
        startedDateMenu: false,
        deliveryDateMenu: false,
        validityDateMenu: false,
        search: '',
        isDraft: true,
        selectedEstimate: {
          id: 0,
        },
        meEstimates: [],
        meClients: [],
        products: [],
        me: {
          name: {},
          address: {}
        },
        headers: [
          {text: 'Désignation', sortable: false, value: 'description'},
          {text: 'Prix unitaire', sortable: false, value: 'priceht'},
          {text: 'Quantité', sortable: false, value: 'quantity'},
          {text: 'Unité', sortable: false, value: 'unit'},
          {text: 'Montant HT', sortable: false, value: 'priceht'},
        ],
      }
    },
    apollo: {
      meEstimates: {
        query: Estimate.GET
      },
      meClients: {
        query: Client.GET_FOR_DOC
      },
      me: {
        query: User.GET
      }
    },

    methods: {
      changeClient() {
        let estimate = Object.assign({}, this.selectedEstimate)
        delete estimate.client
        this.selectedEstimate = Object.assign({}, estimate)
      },
      formatDate(date) {
        return moment(date).format('L')
      },

      formatDateToISO(date){
        return new Date(date).toISOString().substr(0, 10)
      },

      selectItem(item) {
        item.startedDate = this.formatDateToISO(item.startedDate)
        item.deliveryDate = this.formatDateToISO(item.deliveryDate)
        item.validityDate = this.formatDateToISO(item.validityDate)
        if(item.state === 'DRAFT'){
          this.isDraft = true
          this.selectedEstimate = Object.assign({}, item)
        } else {
          this.isDraft = false
          this.selectedEstimate = Object.assign({}, item)
        }
      },

      getEstimates() {
        this.$apollo.queries.meEstimates.refetch()
      },

      updateOrCreateEstimate() {

      },

      changeEstimateState() {

      },

      deleteEstimate() {

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