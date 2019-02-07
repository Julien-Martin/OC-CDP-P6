export const fragment = {
	fragmentUser: `
		fragment CleanUser on User {
			name {
				firstname 
				lastname
			} 
			address {
				street 
				street2 
				postalcode 
				city 
				country
			} 
			commercialName 
			siret 
			RCS 
			RM
		}
	`,
	fragmentProduct: `
		fragment CleanProduct on Product { 
			description 
			priceht 
			pricettc 
			vat 
			unit 
		}
	`,
	fragmentClient: `
		fragment CleanClient on Client {
			name {
				firstname
				lastname
			}
			address {
				street
				street2
				postalcode
				city
				country
			}
			legalForm {
				form
				title
			}
			company
			phone
		}
	`,
	fragmentEstimateState: `
		fragment EstimateState on Estimate {
			state
		}
	`,
	fragmentInvoiceState: `
		fragment InvoiceState on Invoice {
			state
		}
	`
};