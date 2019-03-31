import gql from 'graphql-tag'

export const GET = gql`
    {
        meClients {
            id
            name {
                firstname
                lastname
            }
            email
            phone
            legalForm {
                id
            }
            address {
                street
                street2
                postalcode
                city
                country
            }
            company
        }
    }
`

export const GET_FOR_DOC = gql`
    query meClientForDoc {
        meClients {
            id
            name {
                firstname
                lastname
            }
            email
            phone
            address {
                street
                street2
                postalcode
                city
                country
            }
            company
        }
    }
`

export const CREATE = gql`
    mutation CreateClient($name: NameCreateOneInput!, $legalForm: ID!, $email: String, $phone: String, $address: AddressCreateOneInput!, $company: String) {
        createClient(
            name: $name,
            legalForm: $legalForm,
            email: $email,
            phone: $phone,
            address: $address,
            company: $company
        ) {
            id
        }
    }
`

export const UPDATE = gql`
    mutation UpdateClient($id: ID!, $name: NameCreateOneInput!, $legalForm: ID, $phone: String, $email: String, $address: AddressCreateOneInput!, $company: String){
        updateClient(
            id: $id,
            name: $name,
            legalForm: $legalForm,
            phone: $phone,
            email: $email,
            address: $address
            company: $company
        ){id}
    }
`

export const DELETE = gql`
    mutation deleteClient($id: ID!) {
        deleteClient(id: $id)
    }
`