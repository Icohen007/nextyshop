import { Segment } from 'semantic-ui-react';
import { parseCookies } from 'nookies';
import axios from 'axios';
import { useEffect, useState } from 'react';
import cookie from 'js-cookie';
import CartItems from '../components/Cart/CartItems';
import CartSummary from '../components/Cart/CartSummary';
import baseUrl from '../utils/baseUrl';
import errorHandler from '../utils/errorHandler';
import useFormState from '../hooks/useFormState';

function Cart({ products, user }) {
  const [cartProducts, setCartProducts] = useState(products);
  const {
    error, loading, setError, setLoading, setSuccess, success,
  } = useFormState();

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
      setLoading();
      const url = `${baseUrl}/api/checkout`;
      const token = cookie.get('token');
      const payload = { paymentData };
      const headers = { headers: { Authorization: token } };
      await axios.post(url, payload, headers);
      setSuccess();
    } catch (err) {
      errorHandler(err, setError);
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
