<template>
  <div>
    <v-container fluid>
      <v-card>
        <Alert type="error" :message="error"></Alert>
        <v-toolbar flat color="white">
          <v-toolbar-title>Formes juridiques</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Nouvelle forme juridique</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-text-field v-model="editedItem.form" label="Acronyme"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field v-model="editedItem.title" label="Nom complet"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="close">Annuler</v-btn>
                <v-btn color="blue darken-1" flat @click="save">Sauvegarder</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-data-table :headers="headers" :items="legalForms" class="elevation-1" hide-actions>
          <template v-slot:items="props">
            <td>{{ props.item.form }}</td>
            <td>{{ props.item.title }}</td>
            <td class="justify-center layout px-0">
              <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
              <v-icon small @click="deleteItem(props.item)">delete</v-icon>
            </td>
          </template>
          <template v-slot:no-data>
            Aucune donnée
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
  import {LegalForm} from "../graphql";

  export default {
    data: () => ({
      error: '',
      dialog: false,
      headers: [
        {text: 'Acronyme', value: 'form'},
        {text: 'Nom complet', value: 'title'},
        {text: 'Actions', value: 'name', sortable: false, align: 'center'}
      ],
      legalForms: [],
      editedIndex: -1,
      editedItem: {
        form: '',
        title: ''
      },
      defaultItem: {
        form: '',
        title: ''
      }
    }),

    apollo: {
      legalForms: {
        query: LegalForm.GET
      }
    },

    computed: {
      formTitle(){
        return this.editedIndex === -1 ? 'Nouvelle forme juridique' : 'Modifier'
      }
    },

    watch: {
      dialog(val){
        val || this.close()
      }
    },

    methods: {
      getLegalForms(){
        this.$apollo.queries.legalForms.refetch()
      },

      updateOrCreateLegalForm(){
        if(this.editedIndex > -1){
          this.$apollo.mutate({
            mutation: LegalForm.UPDATE,
            variables: {
              ...this.editedItem
            }
          }).then(() => {
            this.getLegalForms()
          }).catch(error => {
            this.error = error
          })
        } else {
          this.$apollo.mutate({
            mutation: LegalForm.CREATE,
            variables: {
              ...this.editedItem
            }
          }).then(() => {
            this.getLegalForms()
          }).catch(error => {
            this.error = error
          })
        }
      },

      editItem(item){
        this.editedIndex = this.legalForms.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem(item){
        const id = item.id
        this.$apollo.mutate({
          mutation: LegalForm.DELETE,
          variables: {id}
        }).then(() => {
          this.getLegalForms()
        }).catch(error => {
          this.error = error
        })
      },

      close(){
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save(){
        this.updateOrCreateLegalForm()
        this.close()
      }
    }
  }
</script>