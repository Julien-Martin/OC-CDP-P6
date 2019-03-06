import gql from 'graphql-tag'

export const GET = gql`
    {
        meEstimates {
            id
            user
            client
            state
            estimateNumber
            startedDate
            deliveryDate
            validityDate
            message
            products {product quantity}
            price
            footNote
            createdAt
        }
    }

`

export const CREATE = gql`
    mutation CreateEstimate($clientId: ID!, $startedDate: DateTime!, $deliveryDate: DateTime!, $validityDate: DateTime!, $message: String, $footNote: String, $products: [ItemCreateInput!]!){
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
`

export const UPDATE = gql`
    mutation UpdateEstimate($id: ID!, $startedDate: DateTime, $deliveryDate: DateTime, $validityDate: DateTime, $message: String, $products: [ItemCreateInput], $footNote: String){
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
`

export const CHANGE_STATE = gql`
    mutation ChangeEstimateState($id: ID!, $state: Int!){
        changeEstimateState(id: $id, state: $state){
            id
        }
    }
`

export const DELETE = gql`
    mutation DeleteEstimate($id: ID!){
        deleteEstimate(id: $id)
    }
`