<template>
  <div>
    <v-container fluid>
      <v-card>
        <v-toolbar flat color="white">
          <v-toolbar-title>Formes juridiques</v-toolbar-title>
          <v-divider class="mx-2" inset vertical></v-divider>
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
  import GET_LEGALFORMS from '../graphql/getLegalForm.gql'
  import CREATE_LEGALFORM from '../graphql/createLegalForm.gql'
  import UPDATE_LEGALFORM from '../graphql/updateLegalForm.gql'
  import DELETE_LEGALFORM from '../graphql/deleteLegalForm.gql'

  export default {
    data: () => ({
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
        query: GET_LEGALFORMS
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
            mutation: UPDATE_LEGALFORM,
            variables: {
              ...this.editedItem
            }
          }).then(() => {
            this.getLegalForms()
          }).catch(error => {
            console.log(error)
          })
        } else {
          this.$apollo.mutate({
            mutation: CREATE_LEGALFORM,
            variables: {
              ...this.editedItem
            }
          }).then(() => {
            this.getLegalForms()
          }).catch(error => {
            console.log(error)
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
          mutation: DELETE_LEGALFORM,
          variables: {id}
        }).then(() => {
          this.getLegalForms()
        }).catch(error => {
          console.log(error)
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

<style scoped>

</style>