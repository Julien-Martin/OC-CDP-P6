<template>
	<div>
		<v-container fluid>
			<v-card>
				<v-dialog v-model="modal.active" persistent max-width="290">
					<v-card>
						<v-card-title class="headline">{{modal.title}}</v-card-title>
						<v-card-text>{{modal.message}}</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn dark class="error" flat @click="clearModal">Annuler</v-btn>
							<v-btn dark class="green" flat @click="deleteClient">Accepter</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
				<Alert type="error" :message="error"></Alert>
				<v-toolbar flat color="white">
					<v-toolbar-title>Mes clients</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
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
	import {LegalForm, Client} from "../graphql";

	export default {
		data: () => ({
			error: '',
			dialog: false,
			modal: {
				active: false,
				title: '',
				message: ''
			},
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
				query: LegalForm.GET
			},
			meClients: {
				query: Client.GET
			}
		},

		methods: {

			getClients() {
				this.$apollo.queries.meClients.refetch()
			},

			updateOrCreateClient() {
				this.editedItem.legalForm = this.editedItem.legalForm.id ? this.editedItem.legalForm.id : this.editedItem.legalForm
				this.editedItem.name = {create: {...this.editedItem.name}}
				this.editedItem.address = {create: {...this.editedItem.address}}
				if (this.editedIndex > -1) {
					this.$apollo.mutate({
						mutation: Client.UPDATE,
						variables: {
							...this.editedItem
						}
					}).then(() => {
						this.getClients()
					}).catch(error => {
						this.error = error
					})
				} else {
					this.$apollo.mutate({
						mutation: Client.CREATE,
						variables: {
							...this.editedItem
						}
					}).then(() => {
						this.getClients()
					}).catch((error) => {
						this.error = error
					})
				}
			},

			editItem(item) {
				this.editedIndex = this.meClients.indexOf(item)
				this.clientId = item.id
				this.editedItem = Object.assign({}, item)
				this.dialog = true
			},

			clearModal(){
				this.modal.active = false
				this.modal.title = ''
				this.modal.message = ''
			},

			deleteItem(item) {
				this.clientId = item.id
				this.modal.active = true
				this.modal.title = `Supprimer ${item.name.firstname} ${item.name.lastname}`
				this.modal.message = "Êtes-vous sûr de vouloir supprimer ce client ?"
			},

			deleteClient(){
				this.$apollo.mutate({
					mutation: Client.DELETE,
					variables: {
						id: this.clientId
					}
				}).then(() => {
					this.clearModal()
					this.getClients()
				}).catch(error => {
					this.error = error
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
				this.updateOrCreateClient()
				this.close()
			}
		}
	}
</script>