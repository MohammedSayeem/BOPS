import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import './NewShopForm.scss';

import CustomInput from '../CustomInput/CustomInput';
import { RootState } from '../../redux/store';

interface InputTypes {
  shopname: string;
  ownerid: string;
  location: string;
  image: null | File;
}

const NewShopForm: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.user);
  const [shopDetails, setShopDetails] = useState<InputTypes>({
    shopname: '',
    ownerid: '',
    location: '',
    image: null,
  });
  const { location, ownerid, shopname, image } = shopDetails;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setShopDetails({
        ...shopDetails,
        image: e.target.files[0],
      });
    } else {
      const { name, value } = e.target;
      setShopDetails({
        ...shopDetails,
        [name]: value,
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('name', shopname);
    if (image) {
      formdata.append('image', image);
    }
    formdata.append(
      'location',
      `{
      "type": "Point",
      "coordinates" : [${location.split(',')[1]},${location.split(',')[0]}]
    }`
    );
    formdata.append('owner', ownerid);
    axios
      .post('http://localhost:4000/shops', formdata, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) =>
        setShopDetails({
          shopname: '',
          ownerid: '',
          location: '',
          image: null,
        })
      )
      .catch((err) => console.log(err));
  };
  return (
    <div className='custom-form-container'>
      <form id='new-shop-form' className='custom-form' onSubmit={handleSubmit}>
        <CustomInput
          name='shopname'
          id='shopname'
          label='Shop Name'
          onChange={handleChange}
          value={shopname}
        />
        <CustomInput
          name='ownerid'
          id='owner'
          label='Owner ID'
          onChange={handleChange}
          value={ownerid}
        />
        <CustomInput
          name='location'
          id='location'
          label='location'
          onChange={handleChange}
          value={location}
        />
        <div className='image-container'>
          <label htmlFor='image' className='shop-image'>
            Select Shop Image
          </label>
          <span>{image?.name}</span>
        </div>
        <input
          type='file'
          required
          name='image'
          id='image'
          accept='image/*'
          onChange={handleChange}
        />
        <input type='submit' value='Add Shop'></input>
      </form>
    </div>
  );
};

export default NewShopForm;
