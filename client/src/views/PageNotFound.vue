<template>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <v-card-title class="error white--text subheading" primary-title>
                        <span class="title">Oops!</span>
                    </v-card-title>
                    <v-card-text>
                        Vous essayer d'accéder à une page qui n'existe pas?
                    </v-card-text>
                    <v-card-actions>
                        <v-btn flat class="error white--text" to="/estimates">Retour</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "PageNotFound"
    }
</script>

<style scoped>

</style>