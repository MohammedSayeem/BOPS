import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import App from './App';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';

import './index.css';
import { store } from './redux/store';
declare global {
  interface Window {
    Razorpay?: any;
  }
}

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      products: {
        keyFields: ['_id'],
      },
    },
  }),
  uri: '/graphql',
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <App />
        </Provider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
