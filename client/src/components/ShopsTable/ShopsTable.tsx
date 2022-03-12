import React from 'react';

import CustomTable from '../CustomTable/CustomTable';

// import { ShopType } from '../../graphql/types';

const shops = [
  {
    fullname: 'test owner',
    name: 'test shop',
    _id: '60bcffd33ed0900a10386fa9',
  },
  {
    fullname: 'test owner 2',
    name: 'test shop 2',
    _id: '60bd01143ed0900a10386fad',
  },
];

const ShopsTable: React.FC = () => {
  return <CustomTable data={shops} fields={['Owner', 'Shop Name', 'ID']} />;
};

export default ShopsTable;
