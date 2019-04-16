<template>
    <div id="custom-list" class="elevation-1 mr-4">
        <v-list subheader two-line class="shrink elevation-1">
            <v-list-tile v-if="itemsArg.length === 0">
                <v-list-tile-content>
                    <v-list-tile-title v-if="typeArg === 'Estimate'">Aucun devis trouvé.</v-list-tile-title>
                    <v-list-tile-title v-else>Aucune facture trouvée.</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-else v-for="item in itemsArg" :key="item.id" @click="itemSelection(item)"
                         :class="selectedItem === item ? 'grey lighten-3' : ''">
                <v-list-tile-content>
                    <v-list-tile-title v-if="typeArg === 'Estimate'">Devis {{item.estimateNumber}}</v-list-tile-title>
                    <v-list-tile-title v-else>Facture {{item.invoiceNumber}}</v-list-tile-title>

                    <div v-if="!!item.staticClient">
                        <v-list-tile-sub-title v-if="item.staticClient.company">{{item.staticClient.company}}</v-list-tile-sub-title>
                        <v-list-tile-sub-title v-else>{{item.staticClient.name.firstname}} {{item.staticClient.name.lastname}}</v-list-tile-sub-title>
                    </div>
                    <div v-else>
                        <v-list-tile-sub-title v-if="item.client.company">{{ item.client.company }}</v-list-tile-sub-title>
                        <v-list-tile-sub-title v-else>{{item.client.name.firstname}} {{item.client.name.lastname}}</v-list-tile-sub-title>
                    </div>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-chip dark :color="docStateColor(item.state)">{{docState(item.state)}}</v-chip>
                </v-list-tile-action>
            </v-list-tile>
        </v-list>
    </div>
</template>

<script>
    export default {
        name: "List",
        props: {
            items: Array,
            type: String,
            selectedItem: Object
        },
        data() {
            return {
                itemsArg: this.items,
                typeArg: this.type,
                selectedItemArg: this.selectedItem,
                itemSelected: {}
            }
        },
        methods: {
            itemSelection(item) {
                this.$emit('itemSelection', item)
            },
            docState(state) {
                switch (state) {
                    case "DRAFT":
                        return "BROUILLON";
                    case "PENDING":
                        return "EN ATTENTE";
                    case "SEND":
                        return "ENVOYÉ";
                    case "DONE":
                        return "VALIDÉ"
                }
            },
            docStateColor(state){
                switch (state) {
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
        },
        watch: {
            items(value) {
                this.itemsArg = value
            },
            selectedItem(value) {
                this.selectedItemArg = value
            }
        }
    }
</script>

<style scoped>
    #custom-list {
        overflow-y: auto;
        max-height: calc(100vh - 168px);
    }
</style>