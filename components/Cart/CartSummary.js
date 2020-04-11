import { Button, Segment, Divider } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';

function calculateCartTotal(products) {
  const cartTotal = products.reduce((acc, cur) => acc + cur.product.price * cur.quantity, 0);
  const formattedCartTotal = ((100 * cartTotal) / 100).toFixed(2);
  const formattedStripeTotal = Number((100 * cartTotal).toFixed(2));
  return { cartTotal: formattedCartTotal, stripeTotal: formattedStripeTotal };
}

function CartSummary({ products, handleCheckout }) {
  const [cartAmount, setCartAmount] = useState(0);
  const [stripeAmount, setStripeAmount] = useState(0);

  useEffect(() => {
    const { cartTotal, stripeTotal } = calculateCartTotal(products);
    setCartAmount(cartTotal);
    setStripeAmount(stripeTotal);
  }, [products]);

  return (
    <>
      <Divider />
      <Segment clearing size="large">
        <strong>Sub total:</strong>
        $
        {cartAmount}
        <StripeCheckout
          name="NextShop"
          amount={stripeAmount}
          image={products.length ? products[0].product.mediaUrl : ''}
          currency="USD"
          shippingAddress
          billingAddress
          zipCode
          token={handleCheckout}
          trriger="onClick"
        >
          <Button
            icon="cart"
            disabled={!products.length}
            color="teal"
            floated="right"
            content="Checkout"
          />
        </StripeCheckout>
      </Segment>
    </>
  );
}

export default CartSummary;
