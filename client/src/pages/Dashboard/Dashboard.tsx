import React, { useRef } from 'react';

import './Dashboard.scss';

import ShopCard from '../../components/ShopCard/ShopCard';
import { gql, useQuery } from '@apollo/client';
import Spinner from '../../components/Spinner/Spinner';
import { ShopType } from '../../graphql/types';
import { ReactComponent as Wave } from '../../assets/waveAsset 1.svg';

const FETCH_SHOPS = gql`
  query FetchShops {
    shops {
      name
      _id
      image
    }
  }
`;

const Dashboard: React.FC = () => {
  const shopsRef = useRef<HTMLHeadingElement>(null);
  const { data, loading } = useQuery<{ shops: ShopType[] }>(FETCH_SHOPS);
  return (
    <>
      <div className='info'>
        <div className='info-1'>
          <div className='img-ctnr'>
            <img src='images/delivery.jpg' alt='' />
          </div>
          <div className='details'>
            <h1>Contact-less Delivery</h1>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque
              consequatur impedit doloribus deleniti officia illum ad inventore,
              natus distinctio ab voluptate, exercitationem fugiat ex cumque
              voluptatibus recusandae dolor iusto laborum.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (shopsRef.current) {
              shopsRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'center',
              });
            }
          }}
        >
          View Shops
        </button>
        <div className='info-2'>
          <div className='img-ctnr'>
            <img src='images/shopping.jpg' alt='' />
          </div>
          <div className='details'>
            <h1>Pick Up At Store</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque
              odit quas reprehenderit aliquid placeat ab cupiditate consectetur,
              natus quibusdam accusantium similique vitae sint officia expedita
              suscipit recusandae nihil commodi illo.
            </p>
          </div>
        </div>
      </div>
      {loading && <Spinner />}
      <h1 ref={shopsRef}>Shops</h1>
      {data && (
        <div className='dashboard-page' id='shops'>
          {data.shops.map((shop) => (
            <ShopCard
              _id={shop._id}
              image={shop.image}
              key={shop._id}
              shopname={shop.name}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Dashboard;
