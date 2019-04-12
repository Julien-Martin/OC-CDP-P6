import gql from 'graphql-tag'

export const GET = gql`
    {
        meInvoices {
            id
            state
            client {
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
                phone
                email
                company
            }
            user {
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
            }
            staticUser
            staticClient
            staticProducts {
                product
                quantity
            }
            invoiceNumber
            billingDate
            paymentCondition
            deadline
            lateFee
            message
            products {
                product {
                    id
                    description
                    pricettc
                    priceht
                    vat
                    unit
                }
                quantity
            }
            price
            footNote
            createdAt
        }
    }

`;
export const GET_ONE = gql`
    query invoice($id: ID!) {
        meInvoice(id: $id) {
            state
            staticUser
            staticClient
            staticProducts {
                product
                quantity
            }
            estimateNumber
            billingDate
            deadline
            paymentCondition
            lateFee
            message
            price
            footNote
            createdAt
        }
    }

`;
export const CREATE = gql`
    mutation CreateInvoice($clientId: ID!, $billingDate: DateTime!, $paymentCondition: Float!, $lateFee: Float!, $message: String, $footNote: String, $products: [JSON!]!){
        createInvoice(
            clientId: $clientId,
            billingDate: $billingDate,
            paymentCondition: $paymentCondition,
            lateFee: $lateFee,
            message: $message,
            products: $products,
            footNote: $footNote
        ){id}
    }
`;

export const UPDATE = gql`
    mutation UpdateInvoice($id: ID!, $billingDate: DateTime, $paymentCondition: Float, $lateFee: Float, $message: String, $products: [JSON], $footNote: String){
        updateInvoice(
            id: $id,
            billingDate: $billingDate,
            lateFee: $lateFee,
            paymentCondition: $paymentCondition,
            message: $message,
            products: $products,
            footNote: $footNote
        ){id}
    }
`;

export const VALIDATE_INVOICE = gql`
    mutation ValidateInvoice($id: ID!){
        validateInvoice(id: $id){
            id
        }
    }
`;

export const CHANGE_STATE = gql`
    mutation ChangeInvoiceState($id: ID!, $state: Int!){
        changeInvoiceState(id: $id, state: $state){
            id
        }
    }
`;

export const DELETE = gql`
    mutation DeleteInvoice($id: ID!){
        deleteInvoice(id: $id)
    }
`;