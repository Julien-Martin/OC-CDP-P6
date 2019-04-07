import gql from 'graphql-tag'

export const GET = gql`
    {
        me {
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
            phone
            siret
            useVAT
            paymentInfo
            VATnumber
            RCS
            RM
            commercialName
            ape
            cgv
        }
    }

`

export const GET_TVA = gql`
    {
        me {
            useVAT
            VATnumber
        }
    }
`

export const UPDATE = gql`
    mutation UpdateMe($name: JSON, $address: JSON, $phone: String, $siret: String, $useVAT: Boolean, $paymentInfo: String, $VATnumber: String, $RCS: String, $RM: String, $commercialName: String, $ape: String, $cgv: String){
        updateMe(
            name: $name,
            address: $address,
            phone: $phone,
            siret: $siret,
            useVAT: $useVAT,
            paymentInfo: $paymentInfo,
            VATnumber: $VATnumber,
            RCS: $RCS,
            RM: $RM,
            commercialName: $commercialName,
            ape: $ape,
            cgv: $cgv
        ){id}
    }
`

export const UPDATE_PASSWORD = gql`
    mutation UpdatePassword($oldpassword: String!, $password: String!){
        updatePassword(
            oldpassword: $oldpassword,
            password: $password
        )
    }
`

export const DELETE = gql`
    mutation DeleteMe($password: String){
        deleteMe(password: $password)
    }
`