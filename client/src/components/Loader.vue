<template>
    <v-dialog v-model="visibleArg" hide-overlay persistent width="300">
        <v-card color="primary" dark>
            <v-card-text>
                Chargement
                <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: "Loader",
        props: {
            visible: Boolean,
        },
        data(){
            return {
                visibleArg: this.visible
            }
        },
        watch: {
            visible(value){
                this.visibleArg = value
            }
        }
    }
</script>

<style scoped>

</style>