import gql from 'graphql-tag'

export const CAPTURE = gql`
    mutation captureEmail($email: String!) {
        captureEmail(email: $email){
            id
        }
    }
`;

export const LOGIN = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password){
            token
            user {
                role
            }
        }
    }
`;

export const SIGNUP = gql`
    mutation Signup($id: ID!, $password: String!, $firstname: String!, $lastname: String!, $street: String!, $street2: String, $postalcode: String!, $city: String!, $country: String!, $siret: String!, $useVAT: Boolean!, $paymentInfo: String!, $VATnumber: String, $RCS: String, $RM: String, $commercialName: String, $ape: String, $cgv: String) {
        signup(id: $id, password: $password, name: {create: {firstname: $firstname, lastname: $lastname}}, address: {create: {street: $street, street2: $street2, postalcode: $postalcode, city: $city, country: $country}}, siret: $siret, useVAT: $useVAT, paymentInfo: $paymentInfo, VATnumber: $VATnumber, RCS: $RCS, RM: $RM, commercialName: $commercialName, ape: $ape, cgv: $cgv){
            token
        }
    }
`;

export const FORGOT_PASSWORD = gql`
    mutation forgotPassword($email: String!){
        forgotPassword(email: $email)
    }
`;

export const FORGOT_PASSWORD_CHANGE = gql`
    mutation forgotPasswordChange($id: ID!, $password: String!){
        forgotPasswordChange(id: $id, password: $password)
    }
`;