<template>
  <div>
    {{me}}
    <v-divider></v-divider>
    {{meClients}}
    <v-divider></v-divider>
    {{meEstimates}}
    <v-divider></v-divider>
    {{window}} {{length}}
    <v-container fluid>
      <v-toolbar dark color="primary" class="mb-2">
        <v-toolbar-items>
          <v-text-field flat solo-inverted v-model="search" prepend-icon="search" label="Recherche" class="hidden-sm-and-down mt-2"></v-text-field>
        </v-toolbar-items>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon>
            <v-icon @click="">add</v-icon>
          </v-btn>
          <v-btn icon>
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
              <v-list-tile v-for="n in length" :key="n" @click="window = n-1; active = true" :color="window === n-1 ? 'primary' : ''">
                <v-list-tile-content>
                  <v-list-tile-title>
                    Devis 2019-03-00{{n}}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    Elon Musk
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-chip disabled>Done</v-chip>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </div>
        </v-flex>
        <v-flex>
          <v-window v-model="window" class="elevation-1" vertical>
            <v-window-item v-for="n in length" :key="n">
              {{window}}
              <v-card flat>
                <v-card-text>
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
                        <p class="title ma-0">Devis n°2019-03-00{{n}}</p>
                        <p class="subheading mt-4 mb-0">Michel Blanc</p>
                        <p class="subheading ma-0">Entreprise</p>
                        <p class="subheading ma-0">7 rue de n'importe où</p>
                        <p class="subheading ma-0">14000 Caen</p>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex grow>
                        <p class="subheading ma-0">Date d'émission : 07/03/2019</p>
                        <p class="subheading ma-0">Date de début : 07/03/2019</p>
                        <p class="subheading ma-0">Date de livraison : 07/03/2019</p>
                      </v-flex>
                    </v-layout>
                  </v-container>
                  <v-container>
                    <v-data-table hide-actions :headers="headers" :items="desserts">
                      <template v-slot:items="props">
                        <td>{{ props.item.name }}</td>
                        <td class="text-xs-right">{{ props.item.calories }}</td>
                        <td class="text-xs-right">{{ props.item.fat }}</td>
                        <td class="text-xs-right">{{ props.item.carbs }}</td>
                        <td class="text-xs-right">{{ props.item.protein }}</td>
                        <td class="text-xs-right">{{ props.item.iron }}</td>
                        <td class="justify-center layout px-0">
                          <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                          <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                        </td>
                      </template>
                      <template v-slot:no-data>
                        Aucune donnée
                      </template>
                    </v-data-table>
                  </v-container>
                  <v-container>
                    <v-layout row>
                      <v-flex grow>
                        <p class="subheading ma-0">Date de validité : 07/03/2019</p>
                        <p class="subheading ma-0">Condition de règlement: 30% à la commande ...</p>
                      </v-flex>
                      <v-flex shrink>
                        <p class="subheading ma-0">Sous-total HT xx€</p>
                        <p class="subheading ma-0">TVA 10% xx€</p>
                        <p class="subheading ma-0">Montant TTC xx€</p>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import {Estimate, Client, User} from "../graphql";

  export default {
    name: "Estimate",
    data() {
      return {
        length: 20,
        window: 0,
        search: '',
        meEstimates: [],
        meClients: [],
        desserts: [],
        me: {
          name: {},
          address: {}
        },
        headers: [
          {text: 'Désignation', sortable: false, value: 'description'},
          {text: 'Prix unitaire', sortable: false, value: 'priceht'},
          {text: 'Quantité', sortable: false, value: 'quantity'},
          {text: 'Unité', sortable: false, value: 'unit'},
          {text: 'TVA', sortable: false, value: 'vat'},
          {text: 'Montant HT', sortable: false, value: 'priceht'},
          {text: 'Actions', value: 'name', sortable: false}
        ],
        editedItem: {
          clientId: '',
          startedDate: '',
          deliveryDate: '',
          validityDate: '',
        },
        defaultItem: {
          clientId: '',
          startedDate: '',
          deliveryDate: '',
          validityDate: '',
        }
      }
    },
    apollo: {
      meEstimates: {
        query: Estimate.GET
      },
      meClients: {
        query: Client.GET
      },
      me: {
        query: User.GET
      }
    },

    methods: {
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
        if (item.invoiceNumber.toString().toLowerCase().match(tempSearch)) {
          return true
        } else if (item.name.firstname.toString().toLowerCase().match(tempSearch)) {
          return true
        } else if (item.name.lastname.toString().toLowerCase().match(tempSearch)) {
          return true
        }
      },

    },
    computed: {
      filteredSearch(){
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
      fullName(value) {
        return `${value.firstname} ${value.lastname}`
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