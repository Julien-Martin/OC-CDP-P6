"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fragment = {
    fragmentUser: `
		fragment CleanUser on User {
			name {
				firstname 
				lastname
			}
			email
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
    fragmentProductOnlyPrice: `
		fragment ProductPrice on Product { 
			pricettc 
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
			email
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
	`,
    fragmentEnsureProduct: `
		fragment EnsureProduct on Estimate {
			product {
				description 
				priceht 
				pricettc 
				vat 
				unit
			}
			quantity
		}
	`,
};
