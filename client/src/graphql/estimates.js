import gql from 'graphql-tag'

export const GET = gql`
    {
        meEstimates {
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
            estimateNumber
            startedDate
            deliveryDate
            validityDate
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
    query estimate($id: ID!) {
        meEstimate(id: $id) {
            state
            staticUser
            staticClient
            staticProducts {
                product
                quantity
            }
            estimateNumber
            startedDate
            deliveryDate
            validityDate
            message
            price
            footNote
            createdAt
        }
    }

`;
export const CREATE = gql`
    mutation CreateEstimate($clientId: ID!, $startedDate: DateTime!, $deliveryDate: DateTime!, $validityDate: DateTime!, $message: String, $footNote: String, $products: [JSON!]!){
        createEstimate(
            clientId: $clientId,
            startedDate: $startedDate,
            deliveryDate: $deliveryDate,
            validityDate: $validityDate,
            message: $message,
            products: $products,
            footNote: $footNote
        ){id}
    }
`;

export const UPDATE = gql`
    mutation UpdateEstimate($id: ID!, $startedDate: DateTime, $deliveryDate: DateTime, $validityDate: DateTime, $message: String, $products: [JSON], $footNote: String){
        updateEstimate(
            id: $id,
            startedDate: $startedDate,
            deliveryDate: $deliveryDate,
            validityDate: $validityDate,
            message: $message,
            products: $products,
            footNote: $footNote
        ){id}
    }
`;

export const VALIDATE_ESTIMATE = gql`
    mutation ValidateEstimate($id: ID!){
        validateEstimate(id: $id){
            id
        }
    }
`;

export const CHANGE_STATE = gql`
    mutation ChangeEstimateState($id: ID!, $state: Int!){
        changeEstimateState(id: $id, state: $state){
            id
        }
    }
`;

export const DELETE = gql`
    mutation DeleteEstimate($id: ID!){
        deleteEstimate(id: $id)
    }
`;