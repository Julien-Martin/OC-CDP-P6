<template>
    <div>
        <v-container>
            <v-toolbar dark color="primary" class="mb-2 hidden-print-only">
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn icon @click="print">
                        <v-icon>print</v-icon>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-layout justify-center>
                <EstimatePrint :item="meEstimate" id="printMe"></EstimatePrint>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import {Estimate} from "../graphql";
    import EstimatePrint from '../components/EstimatePrint'
    export default {
        name: "Estimate",
        components: {EstimatePrint},
        data(){
            return {
                id: this.$route.params.id,
                meEstimate: {}
            }
        },
        mounted(){
          this.getEstimate()
        },
        methods: {
            print(){

            },

            getEstimate(){
                this.$apollo.query({
                    query: Estimate.GET_ONE,
                    variables: {
                        id: this.id
                    }
                }).then(result => {
                    this.meEstimate = result.data.meEstimate
                })
            }
        },
    }
</script>