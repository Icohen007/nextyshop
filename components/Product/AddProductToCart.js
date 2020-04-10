import { Input } from 'semantic-ui-react';
import { useState, useReducer, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import cookie from 'js-cookie';
import baseUrl from '../../utils/baseUrl';
import errorHandler from '../../utils/errorHandler';

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

function AddProductToCart({ user, productId }) {
  const [quantity, setQuantity] = useState(1);
  const [{ loading, success, error }, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const handleQuantityChange = (event) => setQuantity(+event.target.value);
  const displayError = (err) => dispatch({ type: ActionTypes.ERROR, payload: err });

  async function handleAddProductToCart() {
    try {
      dispatch({ type: ActionTypes.LOADING });
      const url = `${baseUrl}/api/cart`;
      const payload = { quantity, productId };
      const token = cookie.get('token');
      const headers = { headers: { Authorization: token } };
      await axios.put(url, payload, headers);
      dispatch({ type: ActionTypes.SUCCESS });
    } catch (err) {
      errorHandler(err, displayError);
    }
  }

  const getActionObject = () => {
    if (user && success) {
      return {
        color: 'blue',
        content: 'Item Added!',
        icon: 'plus cart',
        disabled: true,
      };
    }

    if (user) {
      return {
        color: 'orange',
        content: 'Add to Cart',
        icon: 'plus cart',
        loading,
        disabled: loading,
        onClick: handleAddProductToCart,
      };
    }

    return {
      color: 'blue',
      content: 'Sign Up To Purchase',
      icon: 'signup',
      onClick: () => router.push('/signup'),
    };
  };


  useEffect(() => {
    if (error) {
      window.alert(error);
    }
  }, [error]);

  useEffect(() => {
    let timeoutId;
    if (success) {
      timeoutId = setTimeout(() => { dispatch({ type: ActionTypes.RESET }); }, 3000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [success]);


  return (
    <Input
      type="number"
      min="1"
      placeholder="Quantity"
      value={quantity}
      onChange={handleQuantityChange}
      action={getActionObject()}
    />
  );
}

export default AddProductToCart;
