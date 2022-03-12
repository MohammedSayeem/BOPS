import React from 'react';

import CustomTable from '../CustomTable/CustomTable';

import { UserType } from '../../graphql/types';

const users: UserType[] = [
  {
    _id: '60bb715e161dd11ad49924f6',
    email: 'ifzalkola@gmail.com',
    fullname: 'ifzal kola',
    role: 'admin',
  },
  {
    _id: '60bcfece3ed0900a10386fa6',
    email: 'testowner@gmail.com',
    fullname: 'test owner',
    role: 'shopOwner',
  },
  {
    _id: '60bd01013ed0900a10386fac',
    email: 'testowner2@gmail.com',
    fullname: 'test owner 2',
    role: 'shopOwner',
  },
  {
    _id: '60bdfab1806668514ce6fa4a',
    email: 'testemail@email.com',
    fullname: 'Test User23',
    role: 'user',
  },
];

const UsersTable: React.FC = () => {
  return (
    <CustomTable
      data={users}
      fields={['User Id', 'Email', 'Full Name', 'Role']}
    />
  );
};

export default UsersTable;
