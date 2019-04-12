<template>
    <div>
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
            <v-toolbar dark color="primary" class="mb-2 hidden-print-only">
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
                    <v-btn icon v-if="selectedEstimate.id !== 0 && selectedEstimate.state !== 'DRAFT'" @click="print(selectedEstimate, 'Estimate')">
                        <v-icon>print</v-icon>
                    </v-btn>
                    <v-btn icon v-if="selectedEstimate.state === 'DRAFT' && selectedEstimate.id !== 1" @click="validateEstimate">
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
                <v-flex class="hidden-print-only">
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
  export default {
    name: "test"
  }
</script>

<style scoped>

</style>