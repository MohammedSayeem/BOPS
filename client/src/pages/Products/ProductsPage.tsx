import React, { useEffect, useRef } from 'react';
import { useQuery, gql } from '@apollo/client';
import mapboxgl from 'mapbox-gl';

import ProductCard from '../../components/ProductCard/ProductCard';

import './ProductsPage.scss';
import { ProductType } from '../../graphql/types';
import Spinner from '../../components/Spinner/Spinner';
import { useParams } from 'react-router-dom';
import ErrorPage from '../Error/ErrorPage';

const FETCH_PRODUCTS = gql`
  query FetchProductsByShop($shopId: String!) {
    shop(shopId: $shopId) {
      _id
      image
      location {
        coordinates
      }
      name
      products {
        name
        _id
        inStock
        price
        image
        shop
      }
    }
  }
`;
interface ShopDetailsType {
  shop: {
    _id: string;
    name: string;
    image: string;
    location: { type: string; coordinates: number[] };
    products: ProductType[];
  };
}
mapboxgl.accessToken =
  'pk.eyJ1IjoiaWZ6YWxrb2xhIiwiYSI6ImNrZWw5a3gycTBsdWIzNWs3eXlpcDNjM3EifQ.Yrp1LNFxajQ8o06ytfB7eA';

const ProductsPage: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const { data, error, loading } = useQuery<ShopDetailsType>(FETCH_PRODUCTS, {
    variables: {
      shopId,
    },
  });

  let sortedProducts;
  let center: any;

  if (data?.shop.products) {
    sortedProducts = data.shop.products
      .slice()
      .sort((a, b) => Number(a.inStock) - Number(b.inStock))
      .reverse();
  }
  const map = useRef<null | mapboxgl.Map>(null);
  const mapContainer = useRef<null | HTMLDivElement>(null);
  const marker = document.createElement('div');
  if (data)
    center = {
      lng: data.shop.location?.coordinates[0] || 55,
      lat: data.shop.location?.coordinates[1] || 100,
    };
  marker.className = 'marker';
  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
  }, []);
  useEffect(() => {
    if (map.current) return;
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        center,
        zoom: 14,
        maxZoom: 14,
        minZoom: 13,
        style: 'mapbox://styles/ifzalkola/ckqzhm6pn5sgv17mcxh1d115q',
      });
      new mapboxgl.Marker(marker, {
        anchor: 'bottom',
      })
        .setLngLat(center)
        .setPopup(
          new mapboxgl.Popup({
            offset: 25,
          }).setHTML(`<h3>${data?.shop.name}</h3>`)
        )
        .addTo(map.current);
    }
  });

  return (
    <div className='products-page'>
      {loading && <Spinner />}
      {error && <ErrorPage message={error.message} />}
      {sortedProducts && (
        <>
          <div className='shop-details'>
            <div className='details-container'>
              <h2>Shop Name: {data?.shop.name}</h2>
            </div>
            <div className='map-container' id='map' ref={mapContainer}></div>
          </div>
          <div className='heading'>
            <h2>Products</h2>
          </div>
        </>
      )}
      {sortedProducts && (
        <div className='products'>
          {sortedProducts.map((product) => (
            <ProductCard item={product} key={product._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
