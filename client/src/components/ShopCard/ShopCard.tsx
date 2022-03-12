import React from 'react';
import { useHistory } from 'react-router-dom';

import './ShopCard.scss';

const ShopCard: React.FC<{ _id?: string; shopname?: string; image?: string }> =
  ({ _id, image, shopname }) => {
    const history = useHistory();
    return (
      <div className='shop-card'>
        <div className='shop-image'>
          <img src={image} alt={shopname} />
        </div>
        <div className='shop-details'>
          <div className='details-wrapper'>
            <h2 className='shop-name'>{shopname}</h2>
            <button onClick={() => history.push(`/shop/${_id}`)}>
              View Products
            </button>
          </div>
        </div>
      </div>
    );
  };

export default ShopCard;
