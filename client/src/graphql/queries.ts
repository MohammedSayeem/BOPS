import { gql } from '@apollo/client';

export const FETCH_ORDERS = gql`
  query GET_ORDERS {
    orders {
      _id
      shop {
        name
      }
      placedAt
      status
      items {
        product {
          name
          price
        }
        quantity
      }
      amount
    }
  }
`;
