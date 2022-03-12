import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { OrderType } from '../../graphql/types';
import { RootState } from '../../redux/store';
import { FETCH_ORDERS } from '../../graphql/queries';

import Spinner from '../Spinner/Spinner';

import './OrdersOverview.scss';

const OrderItem: React.FC<{ order: OrderType }> = ({ order }) => {
  const [showDetails, toggleShowDetails] = useState(false);

  const { _id, amount, placedAt, shop, status, items } = order;
  return (
    <div className='order-item'>
      <span>Order Id: {_id}</span>
      <span>Order Date: {placedAt && new Date(placedAt).toLocaleString()}</span>
      <span>Order Amount: {amount}</span>
      {status !== 'completed' && <span>Order Status: {status}</span>}
      <span>Shop Name: {shop?.name}</span>
      <span
        className='details-btn'
        onClick={() => toggleShowDetails(!showDetails)}
      >
        {showDetails ? 'Hide Details' : 'Show Details'}
      </span>
      {showDetails && (
        <div className='order-items'>
          <h3>Order Items</h3>
          {items?.map((item) => (
            <>
              <span>
                {item.product.name} x {item.quantity}
              </span>
            </>
          ))}
        </div>
      )}
    </div>
  );
};

const OrdersOverview: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.user);
  const { data, error, loading } = useQuery<{ orders: OrderType[] }>(
    FETCH_ORDERS,
    {
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      fetchPolicy: 'cache-and-network',
    }
  );
  return (
    <div className='orders-overview'>
      {loading && <Spinner />}
      {data && data.orders && data.orders.length > 0 ? (
        <>
          {!loading && <h2 className='dark-heading'>Active Orders</h2>}
          {data &&
            data.orders.map(
              (order) =>
                order.status !== 'completed' && (
                  <OrderItem key={order._id} order={order} />
                )
            )}
          {!loading && <h2 className='dark-heading'>Completed Orders</h2>}
          {data &&
            data.orders.map(
              (order) =>
                order.status === 'completed' && (
                  <OrderItem key={order._id} order={order} />
                )
            )}
        </>
      ) : (
        !loading && (
          <h2 className='dark-heading'>You Have not ordered anything yet</h2>
        )
      )}
    </div>
  );
};

export default OrdersOverview;
