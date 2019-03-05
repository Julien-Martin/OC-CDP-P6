<template>
	<div>
		<v-container fluid>
			<v-card>
				<v-toolbar flat color="white">
					<v-toolbar-title>Mes clients</v-toolbar-title>
					<v-divider class="mx-2" inset vertical></v-divider>
					<v-spacer></v-spacer>
					<v-dialog v-model="dialog" max-width="500px">
						<template v-slot:activator="{ on }">
							<v-btn color="primary" dark class="mb-2" v-on="on">Nouveau client</v-btn>
						</template>
						<v-card>
							<v-card-title>
								<span class="headline">{{ formTitle }}</span>
							</v-card-title>

							<v-card-text>
								<v-container grid-list-md>
									<v-layout wrap>
										<v-flex xs12 sm6>
											<v-text-field v-model="editedItem.name.firstname" label="Prénom"></v-text-field>
										</v-flex>
										<v-flex xs12 sm6>
											<v-text-field v-model="editedItem.name.lastname" label="Nom"></v-text-field>
										</v-flex>
										<v-flex xs12>
											{{editedItem.legalForm}}
										</v-flex>
										<v-flex xs12>
											<v-select v-model="editedItem.legalForm" :items="legalForms" item-text="title" item-value="id"
																label="Forme juridique"></v-select>
										</v-flex>
										<v-flex xs12>
											<v-text-field v-model="editedItem.company" label="Nom de l'entreprise"></v-text-field>
										</v-flex>
										<v-flex xs12 sm6>
											<v-text-field v-model="editedItem.email" label="Adresse email"></v-text-field>
										</v-flex>
										<v-flex xs12 sm6>
											<v-text-field v-model="editedItem.phone" label="Téléphone"></v-text-field>
										</v-flex>
										<v-flex xs12>
											<v-text-field v-model="editedItem.address.street" label="Adresse ligne 1"></v-text-field>
										</v-flex>
										<v-flex xs12>
											<v-text-field v-model="editedItem.address.street2" label="Adresse ligne 2"></v-text-field>
										</v-flex>
										<v-flex xs12 sm6>
											<v-text-field v-model="editedItem.address.city" label="Ville"></v-text-field>
										</v-flex>
										<v-flex xs12 sm6>
											<v-text-field v-model="editedItem.address.postalcode" label="Code postal"></v-text-field>
										</v-flex>
										<v-flex xs12>
											<v-text-field v-model="editedItem.address.country" label="Pays"></v-text-field>
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
				<v-data-table :headers="headers" :items="meClients" class="elevation-1" hide-actions>
					<template v-slot:items="props">
						<td>{{ props.item.name.firstname }} {{ props.item.name.lastname }}</td>
						<td>{{ props.item.company }}</td>
						<td>{{ props.item.email }}</td>
						<td>{{ props.item.phone }}</td>
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
	import CREATE_CLIENT from '../graphql/createClient.gql'
	import GET_CLIENTS from '../graphql/meClients.gql'
	import DELETE_CLIENT from '../graphql/deleteClient.gql'
	import UPDATE_CLIENT from '../graphql/updateClient.gql'

	export default {
		data: () => ({
			dialog: false,
			headers: [
				{
					text: 'Nom',
					value: 'name',
				},
				{
					text: 'Entreprise',
					value: 'company'
				},
				{
					text: 'Adresse e-mail',
					value: 'email'
				},
				{
					text: 'Téléphone',
					value: 'phone'
				},
				{text: 'Actions', value: 'name', sortable: false, align: 'center'}
			],
			meClients: [],
			legalForms: [],
			editedIndex: -1,
			clientId: '',
			editedItem: {
				name: {
					firstname: '',
					lastname: ''
				},
				legalForm: '',
				email: '',
				phone: '',
				address: {
					street: '',
					street2: '',
					postalcode: '',
					city: '',
					country: ''
				},
				company: ''
			},
			defaultItem: {
				name: {
					firstname: '',
					lastname: ''
				},
				legalForm: '',
				email: '',
				phone: '',
				address: {
					street: '',
					street2: '',
					postalcode: '',
					city: '',
					country: ''
				},
				company: ''
			}
		}),

		computed: {
			formTitle() {
				return this.editedIndex === -1 ? 'Nouveau client' : 'Modifier un client'
			}
		},

		watch: {
			dialog(val) {
				val || this.close()
			}
		},

		apollo: {
			legalForms: {
				query: GET_LEGALFORMS
			},
			meClients: {
				query: GET_CLIENTS
			}
		},

		methods: {

			getClients() {
				this.$apollo.queries.meClients.refetch()
			},

			updateClient(){
				const id = this.clientId
				const firstname = this.editedItem.name.firstname
				const lastname = this.editedItem.name.lastname
				const legalForm = this.editedItem.legalForm
				const email = this.editedItem.email
				const phone = this.editedItem.phone
				const street = this.editedItem.address.street
				const street2 = this.editedItem.address.street2
				const postalcode = this.editedItem.address.postalcode
				const city = this.editedItem.address.city
				const country = this.editedItem.address.country
				const company = this.editedItem.company
				this.$apollo.mutate({
					mutation: UPDATE_CLIENT,
					variables: {
						id, firstname, lastname, legalForm, email, phone, street, street2, postalcode, city, country, company
					}
				}).then(response => {
					this.getClients()
					console.log("Response : " + JSON.stringify(response))
				}).catch(error => {
					this.getClients()
					console.log("Erreur : " + error)
				})
			},

			createClient() {
				const firstname = this.editedItem.name.firstname
				const lastname = this.editedItem.name.lastname
				const legalForm = this.editedItem.legalForm
				const email = this.editedItem.email
				const phone = this.editedItem.phone
				const street = this.editedItem.address.street
				const street2 = this.editedItem.address.street2
				const postalcode = this.editedItem.address.postalcode
				const city = this.editedItem.address.city
				const country = this.editedItem.address.country
				const company = this.editedItem.company
				this.$apollo.mutate({
					mutation: CREATE_CLIENT,
					variables: {
						firstname, lastname, legalForm, email, phone, street, street2, postalcode, city, country, company
					}
				}).then((response) => {
					this.getClients()
					console.log("Response : " + JSON.stringify(response))
				}).catch((error) => {
					this.getClients()
					console.log("Erreur : " + error)
				})
			},

			editItem(item) {
				this.editedIndex = this.meClients.indexOf(item)
				this.clientId = item.id
				this.editedItem = Object.assign({}, item)
				this.dialog = true
			},

			deleteItem(item) {
				const id = item.id
				this.$apollo.mutate({
					mutation: DELETE_CLIENT,
					variables: {
						id
					}
				}).then(res => {
					this.getClients()
					console.log(res)
				}).catch(error => {
					console.log(error)
				})
			},

			close() {
				this.dialog = false
				setTimeout(() => {
					this.editedItem = Object.assign({}, this.defaultItem)
					this.editedIndex = -1
				}, 300)
			},

			save() {
				if (this.editedIndex > -1) {
					console.log('udpate')
					this.updateClient()
					//Object.assign(this.meClients[this.editedIndex], this.editedItem)
				} else {
					console.log('create')
					this.createClient()
				}
				this.close()
			}
		}
	}
</script>