import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProductType } from '../../graphql/types';
import { createAlert } from '../../redux/Actions/AlertActions';

import { RootState } from '../../redux/store';

import './ProductsForm.scss';
interface FormProps {
  product?: ProductType;
  onEdit?: (args?: any) => any;
}

interface InputTypes {
  name: string;
  price: number;
  imagename: string;
  image: null | File;
}

const ProductsForm: React.FC<FormProps> = ({ product, onEdit }) => {
  let defaultValues = !product
    ? {
        name: '',
        price: 0,
        imagename: '',
        image: null,
      }
    : {
        name: product.name,
        imagename: product.image,
        price: product.price,
        image: null,
      };
  const statusRef = useRef<HTMLSelectElement | null>(null);
  const [productDetails, setProductDetails] =
    useState<InputTypes>(defaultValues);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

  let shopID = currentUser && currentUser.shop ? currentUser.shop[0]._id : '';

  const { image, imagename, name, price } = productDetails;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('name', name);
    formdata.append('price', `${price}`);
    if (shopID) formdata.append('shop', shopID);
    if (image) formdata.append('image', image);
    if (statusRef.current)
      formdata.append(
        'inStock',
        `${statusRef.current.options[statusRef.current.selectedIndex].value}`
      );

    try {
      dispatch(createAlert('Please Wait While We Add The Product', 'success'));
      !product
        ? await axios.post('/products', formdata)
        : await axios.patch(`/products/${product._id}`, formdata);
      dispatch(createAlert('product added successfully', 'success'));
      if (product && onEdit) onEdit();
      setProductDetails({
        name: '',
        price: 0,
        imagename: '',
        image: null,
      });
    } catch (err) {
      createAlert('Problem while adding product', 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductDetails({
        ...productDetails,
        image: e.target.files[0],
        imagename: URL.createObjectURL(e.target.files[0]),
      });
    } else {
      const { name, value } = e.target;
      setProductDetails({
        ...productDetails,
        [name]: value,
      });
    }
  };

  return (
    <div className='form-container'>
      {product && onEdit && (
        <button id='back-btn' onClick={() => onEdit()}>
          Cancel Edit
        </button>
      )}
      <form
        className='products-form'
        id='products-form'
        onSubmit={handleSubmit}
      >
        <div className='input-container'>
          <div className='custom-input-field'>
            <label>
              Product Name
              <input
                type='text'
                required
                name='name'
                id='name'
                value={name}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className='custom-input-field'>
            <label>
              Price
              <input
                type='number'
                name='price'
                id='price'
                required
                value={price}
                onChange={handleChange}
              />
            </label>
          </div>

          {!product ? (
            <div className='custom-input-field'>
              <label className='image-input'>
                Select Image
                <input
                  type='file'
                  required
                  name='productimage'
                  id='productimage'
                  accept='image/*'
                  onChange={handleChange}
                />
              </label>
            </div>
          ) : (
            <>
              <div className='custom-input-field'>
                <label className='image-input'>
                  Select Image
                  <input
                    type='file'
                    name='productimage'
                    id='productimage'
                    accept='image/*'
                    onChange={handleChange}
                  />
                </label>
              </div>
              <label htmlFor='status'>Status</label>
              <select name='status' id='status' ref={statusRef}>
                <option value='true'>In Stock</option>
                <option value='false' selected={!product.inStock}>
                  Out Of Stock
                </option>
              </select>
            </>
          )}
        </div>

        {imagename && (
          <div className='image-container'>
            <img src={imagename} alt='product' className='form-image' />
          </div>
        )}
        <input
          type='submit'
          id='add-btn'
          value={`${product ? 'Edit Product' : 'Add New Product'}`}
        />
      </form>
    </div>
  );
};

export default ProductsForm;
