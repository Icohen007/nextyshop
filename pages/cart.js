import { Segment } from 'semantic-ui-react';
import { parseCookies } from 'nookies';
import axios from 'axios';
import { useEffect, useReducer, useState } from 'react';
import cookie from 'js-cookie';
import CartItems from '../components/Cart/CartItems';
import CartSummary from '../components/Cart/CartSummary';
import baseUrl from '../utils/baseUrl';
import errorHandler from '../utils/errorHandler';

const initialState = {
  loading: false,
  success: false,
  error: '',
};

const ActionTypes = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  RESET: 'RESET',
};

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.LOADING:
      return { ...state, loading: true, error: '' };
    case ActionTypes.SUCCESS:
      return {
        ...state, loading: false, success: true, error: '',
      };
    case ActionTypes.ERROR:
      return {
        ...state, loading: false, success: false, error: action.payload,
      };
    case ActionTypes.RESET:
      return initialState;
    default:
      throw new Error();
  }
}

function Cart({ products, user }) {
  const [cartProducts, setCartProducts] = useState(products);
  const [{ loading, success, error }, dispatch] = useReducer(reducer, initialState);

  const displayError = (err) => dispatch({ type: ActionTypes.ERROR, payload: err });

  useEffect(() => {
    if (error) {
      window.alert(error);
    }
  }, [error]);

  async function handleRemoveFromCart(productId) {
    const url = `${baseUrl}/api/cart`;
    const token = cookie.get('token');
    const payload = { params: { productId }, headers: { Authorization: token } };
    const response = await axios.delete(url, payload);
    setCartProducts(response.data);
  }

  async function handleCheckout(paymentData) {
    try {
      dispatch({ type: ActionTypes.LOADING });
      const url = `${baseUrl}/api/checkout`;
      const token = cookie.get('token');
      const payload = { paymentData };
      const headers = { headers: { Authorization: token } };
      await axios.post(url, payload, headers);
      dispatch({ type: ActionTypes.SUCCESS });
    } catch (err) {
      errorHandler(err, displayError);
    }
  }

  return (
    <Segment loading={loading}>
      <CartItems
        handleRemoveFromCart={handleRemoveFromCart}
        products={cartProducts}
        user={user}
        success={success}
      />
      <CartSummary
        products={cartProducts}
        handleCheckout={handleCheckout}
        success={success}
      />
    </Segment>
  );
}

// cart is not a protected route
Cart.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { products: [] };
  }
  const url = `${baseUrl}/api/cart`;
  const payload = { headers: { Authorization: token } };
  const response = await axios.get(url, payload);
  return { products: response.data };
};

export default Cart;
