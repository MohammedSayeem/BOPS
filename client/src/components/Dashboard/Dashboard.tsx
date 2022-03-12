import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { useSelector } from 'react-redux';
import { OrderType, UserType } from '../../graphql/types';
import { RootState } from '../../redux/store';

import './Dashboard.scss';

const FETCH_DATA = gql`
  query FETCH_ADMIN_DATA {
    users {
      fullname
      email
      role
    }
    orders {
      amount
      user
      shop {
        name
      }
      placedAt
    }
  }
`;

const Dashboard: React.FC = () => {
  const {
    user: { token },
  } = useSelector((state: RootState) => state);
  const { data, loading } = useQuery<{
    users: UserType[];
    orders: OrderType[];
  }>(FETCH_DATA, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
  return (
    <div className='dashboard'>
      <div className='user-count count-container'>
        Total Users: {data?.users.length || 0}
      </div>
      <div className='order-count count-container'>
        Total Orders: {data?.orders.length || 0}
      </div>
      <div className='user-table custom-table'>
        <h3>New Users</h3>
        <table>
          <>
            <thead>
              <tr>
                <td>Name</td>
                <td>Role</td>
                <td>Email</td>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.users.map((user) => (
                  <tr>
                    <td>{user.fullname}</td>
                    <td>{user.role}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
            </tbody>
          </>
        </table>
      </div>
      <div className='order-table custom-table'>
        <h3>Latest Orders</h3>
        <table>
          <thead>
            <tr>
              <td>Customer Id</td>
              <td>Shop</td>
              <td>Date</td>
              <td>Amount</td>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.orders.map((order) => (
                <tr>
                  <td>{order.user}</td>
                  <td>{order.shop?.name}</td>
                  <td>
                    {order.placedAt
                      ? new Date(order.placedAt).toLocaleString()
                      : ''}
                  </td>
                  <td>{order.amount}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
