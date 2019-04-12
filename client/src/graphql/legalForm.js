import gql from 'graphql-tag'

export const GET = gql`{
    legalForms {
        id
        form
        title
    }
}`;

export const CREATE = gql`
    mutation CreateLegalForm($form: String!, $title: String!){
        createLegalForm(form: $form, title: $title){
            id
        }
    }
`;

export const UPDATE = gql`
    mutation UpdateLegalForm($id: ID!, $form: String, $title: String){
        updateLegalForm(id: $id,form: $form,title: $title){
            id
        }
    }
`;

export const DELETE = gql`
    mutation DeleteLegalForm($id: ID!){
        deleteLegalForm(id: $id)
    }
`;