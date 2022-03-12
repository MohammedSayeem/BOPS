import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import userReducer from './reducers/userReducer';
import cartReducer from './reducers/cartReducer';
import alertReducer from './reducers/alertReducer';

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  alert: alertReducer,
});
const composeEnhancers = composeWithDevTools({});
const reduxState = localStorage.getItem('reduxState');
const persistedState = reduxState ? JSON.parse(reduxState) : {};
export const store = createStore(
  rootReducer,
  persistedState,
  composeEnhancers(applyMiddleware(thunk))
);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
