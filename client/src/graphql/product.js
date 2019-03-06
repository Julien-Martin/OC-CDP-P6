import gql from 'graphql-tag'

export const GET = gql`
    {
        meProducts {
            id
            vat
            unit
            description
            priceht
            pricettc
        }
    }
`

export const CREATE = gql`
  mutation CreateProduct($description: String!, $vat: Float!, $pricettc: Float!, $unit: String){
      createProduct(
          description: $description,
          vat: $vat,
          pricettc: $pricettc,
          unit: $unit
      ){
          id
      }
  }
`

export const UPDATE = gql`
  mutation UpdateProduct($id: ID!, $description: String!, $vat: Float!, $pricettc: Float!, $unit: String){
      updateProduct(
          id: $id,
          description: $description,
          vat: $vat,
          pricettc: $pricettc,
          unit: $unit
      ){
          id
      }
  }
`

export const DELETE = gql`
  mutation DeleteProduct($id: ID!){
      deleteProduct(id: $id)
  }
`