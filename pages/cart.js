import { Segment } from 'semantic-ui-react';
import { parseCookies } from 'nookies';
import axios from 'axios';
import { useState } from 'react';
import cookie from 'js-cookie';
import CartItems from '../components/Cart/CartItems';
import CartSummary from '../components/Cart/CartSummary';
import baseUrl from '../utils/baseUrl';


function Cart({ products, user }) {
  const [cartProducts, setCartProducts] = useState(products);

  async function handleRemoveFromCart(productId) {
    const url = `${baseUrl}/api/cart`;
    const token = cookie.get('token');
    const payload = { params: { productId }, headers: { Authorization: token } };
    const response = await axios.delete(url, payload);
    setCartProducts(response.data);
  }

  async function handleCheckout() {}

  console.log(products);
  return (
    <Segment>
      <CartItems handleRemoveFromCart={handleRemoveFromCart} products={cartProducts} user={user} />
      <CartSummary products={cartProducts} handleCheckout={handleCheckout} />
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
