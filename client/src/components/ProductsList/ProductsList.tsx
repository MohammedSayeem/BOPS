import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ProductType } from '../../graphql/types';
import { RootState } from '../../redux/store';
import ProductsForm from '../ProductsForm/ProductsForm';
import Spinner from '../Spinner/Spinner';

import './ProductsList.scss';

const FETCH_PRODUCTS = gql`
  query FetchProducts($shopId: String!) {
    shop(shopId: $shopId) {
      products {
        name
        _id
        inStock
        price
        image
      }
    }
  }
`;

const ProductsList: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [search, setSearch] = useState('');
  let shopId: any = '';
  if (currentUser && currentUser.shop) {
    shopId = currentUser.shop[0]._id;
  }
  const { data, error, loading, refetch } = useQuery<{
    shop: {
      products: ProductType[];
    };
  }>(FETCH_PRODUCTS, {
    variables: {
      shopId,
    },
  });
  const [editable, setEditable] = useState(false);
  const [currentProduct, setCurrentProduct] =
    useState<ProductType | undefined>(undefined);
  return (
    <div className='products-list-container'>
      {loading && <Spinner />}
      {!editable && data ? (
        <>
          <div
            className='search-container'
            style={{
              margin: 'auto',
              width: '300px',
              padding: '15px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <label htmlFor='search' style={{ color: 'teal' }}>
              Search
            </label>
            <input
              type='search'
              name='search'
              id='search'
              value={search}
              placeholder='Enter the product name'
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              style={{
                padding: '5px 15px',
                border: '3px teal solid',
                outline: 'none',
                borderRadius: '5px',
              }}
            />
          </div>
          <ul className='products-list'>
            <li>
              <span>Image</span>
              <span>Name</span>
              <span>Price</span>
              <span>Status</span>
              <span>Edit</span>
            </li>
            {data.shop.products
              .filter((product) =>
                product.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((product) => (
                <li>
                  <div className='image-container'>
                    <img src={product.image} alt={product.name} />
                  </div>
                  <span>{product.name}</span>
                  <span>{product.price}</span>
                  <span>{product.inStock ? 'In Stock' : 'Out Of Stock'}</span>
                  <span
                    id='edit-btn'
                    onClick={() => {
                      setCurrentProduct(product);
                      setEditable(true);
                    }}
                  >
                    Edit details
                  </span>
                </li>
              ))}
          </ul>
        </>
      ) : (
        <ProductsForm
          product={currentProduct}
          onEdit={() => {
            setEditable(false);
            setCurrentProduct(undefined);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default ProductsList;
