<template>
  <div>
    <v-container fluid>
      <v-layout>
        <v-flex>
          <div id="custom-list">
            <v-item-group v-model="window" class="shrink mr-4" mandatory tag="v-flex">
              <v-item v-for="n in length" :key="n">
                <div slot-scope="{ active, toggle }">
                  <v-btn :input-value="active" flat large @click="toggle">
                    <v-icon>security</v-icon>
                    Test
                    test
                  </v-btn>
                </div>
              </v-item>
            </v-item-group>
          </div>
        </v-flex>
        <v-flex>
          <v-window v-model="window" class="elevation-1" vertical>
            <v-window-item v-for="n in length" :key="n">
              <v-card flat>
                <v-card-text>
                  <v-layout align-center mb-3>
                    <v-avatar color="grey" class="mr-3"></v-avatar>
                    <strong class="title">Title {{ n }}</strong>
                    <v-spacer></v-spacer>
                    <v-btn icon>
                      <v-icon>clear</v-icon>
                    </v-btn>
                  </v-layout>

                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                    officia deserunt mollit anim id est laborum.
                  </p>

                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                    officia deserunt mollit anim id est laborum.
                  </p>

                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                    officia deserunt mollit anim id est laborum.
                  </p>
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
        meEstimates: [],
        meClients: [],
        me: {}
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
    }
  }
</script>

<style scoped>
  #custom-list {
    overflow-y: auto;
    max-height: calc(100vh - 88px)
  }
</style>