import React, { useState } from 'react';

import './AdminPage.scss';
import NewShopForm from '../../components/NewShopForm/NewShopForm';
import OrdersTable from '../../components/OrdersTable/OrdersTable';
import Dashboard from '../../components/Dashboard/Dashboard';
import UsersTable from '../../components/UsersTable/UsersTable';
import ShopsTable from '../../components/ShopsTable/ShopsTable';
import NewUserForm from '../../components/NewUserForm/NewUserForm';

type tabnumber = '1' | '2' | '3' | '4' | '5' | '6';

const AdminPage: React.FC = () => {
  const [tabnum, setTabnum] = useState<tabnumber>('1');

  const renderAdminComponent = () => {
    switch (tabnum) {
      case '1':
        return <Dashboard />;
      case '2':
        return <UsersTable />;
      case '3':
        return <ShopsTable />;
      case '4':
        return <OrdersTable />;
      case '5':
        return <NewUserForm />;
      case '6':
        return <NewShopForm />;
      default:
        return <Dashboard />;
    }
  };
  const setCurrentTab = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    tabnum: tabnumber
  ) => {
    setTabnum(tabnum);
    const list = e.currentTarget.parentNode?.children;
    if (list)
      for (let i = 0; i < list?.length; i++) {
        list[i].classList.remove('current');
      }
    e.currentTarget.classList.add('current');
  };
  return (
    <div className='account-page' id='admin-page'>
      <div className='account-nav' id='admin-nav'>
        <ul>
          <li onClick={(e) => setCurrentTab(e, '1')} className='current'>
            Dashboard
          </li>
          <li onClick={(e) => setCurrentTab(e, '2')}>All Users</li>
          <li onClick={(e) => setCurrentTab(e, '3')}>All Shops</li>
          <li onClick={(e) => setCurrentTab(e, '4')}>All Orders</li>
          <li onClick={(e) => setCurrentTab(e, '5')}>Add a User</li>
          <li onClick={(e) => setCurrentTab(e, '6')}>Add a Shop</li>
        </ul>
      </div>
      <div className='account-window-container'>
        <div className='account-window'>
          {renderAdminComponent()}
          {/* <Dashboard /> */}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
