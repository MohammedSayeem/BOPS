import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useSelector } from 'react-redux';
import { OrderType } from '../../graphql/types';
import { RootState } from '../../redux/store';

// import { OrderType, UserType } from '../../graphql/types';

import Spinner from '../Spinner/Spinner';

import './OrdersTable.scss';

// interface TableProps {
//   orders: OrderType[];
//   user: UserType;
// }

const FETCH_ORDERS = gql`
  query FETCH_SHOP_ORDERS($shopId: String) {
    orders(shopId: $shopId) {
      _id
      placedAt
      items {
        product {
          name
        }
      }
      user
      status
      amount
    }
  }
`;
const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($orderId: String!, $status: String!) {
    updateOrderStatus(orderId: $orderId, status: $status) {
      status
    }
  }
`;

const OrdersTable: React.FC = () => {
  let shopId: any = '';
  const {
    user: { currentUser, token },
  } = useSelector((state: RootState) => state);

  shopId =
    currentUser && currentUser.shop && currentUser.shop.length > 0
      ? currentUser.shop[0]._id
      : '';
  const { data, refetch, loading } = useQuery<{ orders: OrderType[] }>(
    FETCH_ORDERS,
    {
      variables: {
        shopId,
      },
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      nextFetchPolicy: 'cache-and-network',
    }
  );
  const activeOrders = data?.orders.filter(
    (order) => order.status !== 'completed'
  );
  const completedOrders = data?.orders.filter(
    (order) => order.status === 'completed'
  );
  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS);
  const handleOrderStatus = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    orderId: string | undefined
  ) => {
    const status = e.target.selectedOptions[0].value;
    const { data } = await updateOrderStatus({
      variables: {
        orderId,
        status,
      },
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      refetchQueries: [
        {
          query: FETCH_ORDERS,
          variables: {
            shopId,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        },
      ],
    });
  };
  return (
    <div className='orders-table-container'>
      <button
        className='refresh-btn'
        onClick={() => {
          refetch();
        }}
      >
        Refresh
      </button>
      <>
        {!loading && activeOrders && activeOrders?.length > 0 && (
          <h1 style={{ color: 'teal' }}>Active Orders</h1>
        )}
        {loading && <Spinner />}
        {activeOrders && activeOrders?.length > 0 && data && (
          <>
            <table className='orders-table'>
              <thead className='table-header'>
                <tr>
                  <th style={{ width: '20%' }}>Order Id</th>
                  <th style={{ width: '15%' }}>Created At</th>
                  {currentUser?.role === 'shopOwner' ? (
                    <React.Fragment>
                      <th style={{ width: '20%' }}>Items</th>
                    </React.Fragment>
                  ) : null}

                  <th style={{ width: '10%' }}>Customer Id</th>
                  <th style={{ width: '10%' }}>Status</th>
                  <th style={{ width: '10%' }}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {activeOrders.map((order) => (
                  <>
                    <tr>
                      <td>{order._id}</td>
                      <td>
                        {order.placedAt
                          ? new Date(order.placedAt).toLocaleString()
                          : ''}
                      </td>
                      <>
                        {currentUser?.role === 'shopOwner' && (
                          <td>
                            {order.items && order.items?.length > 3
                              ? `${order.items[0].product.name}, ${
                                  order.items[1].product.name
                                }, ${order.items[2].product.name},+${
                                  order.items.length - 3
                                }`
                              : order.items?.reduce((iv, cv) => {
                                  iv += cv.product.name + ', ';
                                  return iv;
                                }, '')}
                          </td>
                        )}
                      </>
                      <td>{order.user}</td>
                      <>
                        {currentUser?.role === 'shopOwner' ? (
                          <td>
                            <select
                              name='status'
                              id='status'
                              onChange={(e) => handleOrderStatus(e, order._id)}
                            >
                              <option
                                value='created'
                                selected={order.status === 'created'}
                              >
                                Created
                              </option>
                              <option
                                value='processing'
                                selected={order.status === 'processing'}
                              >
                                Processing
                              </option>
                              <option
                                value='ready'
                                selected={order.status === 'ready'}
                              >
                                Ready
                              </option>
                              <option
                                value='completed'
                                selected={order.status === 'completed'}
                              >
                                Completed
                              </option>
                            </select>
                          </td>
                        ) : (
                          <td>{order.status}</td>
                        )}
                      </>
                      <td>{order.amount}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </>
        )}
      </>
      <>
        <h1 style={{ color: 'teal' }}>Completed Orders</h1>
        {loading && <Spinner />}
        {completedOrders && data && (
          <>
            <table className='orders-table'>
              <thead className='table-header'>
                <tr>
                  <th style={{ width: '20%' }}>Order Id</th>
                  <th style={{ width: '15%' }}>Created At</th>
                  {currentUser?.role === 'shopOwner' ? (
                    <React.Fragment>
                      <th style={{ width: '20%' }}>Items</th>
                      <th style={{ width: '10%' }}>Customer Id</th>
                    </React.Fragment>
                  ) : (
                    <th style={{ width: '10%' }}>Customer Id</th>
                  )}
                  <th style={{ width: '10%' }}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {completedOrders.map((order) => (
                  <>
                    <tr>
                      <td>{order._id}</td>
                      <td>
                        {order.placedAt
                          ? new Date(order.placedAt).toLocaleString()
                          : ''}
                      </td>
                      <>
                        {currentUser?.role === 'shopOwner' && (
                          <td>
                            {order.items && order.items?.length > 3
                              ? `${order.items[0].product.name}, ${
                                  order.items[1].product.name
                                }, ${order.items[2].product.name},+${
                                  order.items.length - 3
                                }`
                              : order.items?.reduce((iv, cv) => {
                                  iv += cv.product.name + ', ';
                                  return iv;
                                }, '')}
                          </td>
                        )}
                      </>
                      <td>{order.user}</td>
                      <td>{order.amount}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </>
        )}
      </>
    </div>
  );
};

export default OrdersTable;
