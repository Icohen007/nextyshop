import { Button, Segment, Divider } from 'semantic-ui-react';
import { useState, useEffect } from 'react';

function calculateCartTotal(products) {
  const cartTotal = products.reduce((acc, cur) => acc + cur.product.price * cur.quantity, 0);
  const formattedCartTotal = ((100 * cartTotal) / 100).toFixed(2);
  const formattedStripeTotal = Number((100 * cartTotal).toFixed(2));
  return { cartTotal: formattedCartTotal, stripeTotal: formattedStripeTotal };
}

function CartSummary({ products }) {
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
        <Button
          icon="cart"
          disabled={!products.length}
          color="teal"
          floated="right"
          content="Checkout"
        />
      </Segment>
    </>
  );
}

export default CartSummary;
