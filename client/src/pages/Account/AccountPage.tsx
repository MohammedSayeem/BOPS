import React, { useState } from 'react';
import OrdersTable from '../../components/OrdersTable/OrdersTable';
import PasswordChangeForm from '../../components/PasswordChangeForm/PasswordChangeForm';
import UserDetailsForm from '../../components/UserDetailsForm/UserDetailsForm';
import ProductsForm from '../../components/ProductsForm/ProductsForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import ProductsList from '../../components/ProductsList/ProductsList';
import OrdersOverview from '../../components/OrdersOverview/OrdersOverview';

type tabnumber = '1' | '2' | '3' | '4' | '5';

const AccountPage: React.FC = () => {
  const [tabnum, setTabnum] = useState<tabnumber>('1');
  const { currentUser } = useSelector((state: RootState) => state.user);
  const renderAccountPage = () => {
    switch (tabnum) {
      case '1':
        return <UserDetailsForm />;

      case '2':
        return currentUser?.role === 'shopOwner' ? (
          <OrdersTable />
        ) : (
          <OrdersOverview />
        );
      case '3':
        return <PasswordChangeForm />;
      case '4':
        return <ProductsForm />;
      case '5':
        return <ProductsList />;
      default:
        return <UserDetailsForm />;
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
    <div className='account-page'>
      <div className='account-nav' id='admin-nav'>
        <ul>
          <li onClick={(e) => setCurrentTab(e, '1')} className='current'>
            My Account
          </li>
          <li onClick={(e) => setCurrentTab(e, '2')}>Orders</li>
          <li onClick={(e) => setCurrentTab(e, '3')}>Change Password</li>
          {currentUser && currentUser.role === 'shopOwner' && (
            <>
              <li onClick={(e) => setCurrentTab(e, '4')}>Add Product</li>
              <li onClick={(e) => setCurrentTab(e, '5')}>All Products</li>
            </>
          )}
        </ul>
      </div>
      <div className='account-window-container'>
        <div className='account-window'>
          {renderAccountPage()}
          {/* <Dashboard /> */}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
