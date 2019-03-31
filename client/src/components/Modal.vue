<template>
    <v-dialog v-model="visibilityArg" persistent max-width="290">
        <v-card>
            <v-card-text class="subheading">{{messageArg}}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" flat @click="cancel">Annuler</v-btn>
                <v-btn color="primary darken-1" flat @click="submit">Valider</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: "Modal",
        props: {
            visibility: Boolean,
            message: String
        },
        data() {
            return {
                visibilityArg: this.visibility,
                messageArg: this.message
            }
        },
        methods: {
            cancel() {
                this.visibilityArg = false
                this.$emit('cancel', this.visibilityArg)
            },
            submit() {
                this.visibilityArg = false
                this.$emit('submit')
            }
        },
        watch: {
            visibility(value) {
                this.visibilityArg = value
            },
            message(value) {
                this.messageArg = value
            }
        }
    }
</script>

<style scoped>

</style>