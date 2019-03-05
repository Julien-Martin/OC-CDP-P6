<template>
	<div>
		<v-container fluid>
			<v-toolbar flat color="white">
				<v-toolbar-title>My CRUD</v-toolbar-title>
				<v-divider
								class="mx-2"
								inset
								vertical
				></v-divider>
				<v-spacer></v-spacer>
				<v-dialog v-model="dialog" max-width="500px">
					<template v-slot:activator="{ on }">
						<v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
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
									<v-flex xs12 sm6 md4>
										<v-text-field v-model="editedItem.name" label="Dessert name"></v-text-field>
									</v-flex>
								</v-layout>
							</v-container>
						</v-card-text>

						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
							<v-btn color="blue darken-1" flat @click="save">Save</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-toolbar>
			<v-data-table
							:headers="headers"
							:items="desserts"
							class="elevation-1"
			>
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
		</v-container>
	</div>
</template>

<script>
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
			desserts: [],
			editedIndex: -1,
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
				return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
			}
		},

		watch: {
			dialog(val) {
				val || this.close()
			}
		},

		created() {
			this.initialize()
		},

		methods: {
			initialize() {
				this.desserts = [
					{
						name: {
							firstname: 'Elon',
							lastname: 'Musk'
						},
						company: 'Tesla',
						email: 'Tesla@tesla.com',
						phone: '5678°984567890',
					},
				]
			},

			editItem(item) {
				this.editedIndex = this.desserts.indexOf(item)
				this.editedItem = Object.assign({}, item)
				this.dialog = true
			},

			deleteItem(item) {
				const index = this.desserts.indexOf(item)
				confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
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
					Object.assign(this.desserts[this.editedIndex], this.editedItem)
				} else {
					this.desserts.push(this.editedItem)
				}
				this.close()
			}
		}
	}
</script>

<style scoped>

</style>