import { Button, Segment, Divider } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import calculateCartTotal from '../../utils/calculateCartTotal';

function CartSummary({ products, handleCheckout, success }) {
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
          stripeKey="pk_test_8HkOtV2i3ql6AXqHVDO6RDim00xze9gBKa"
          token={handleCheckout}
          trriger="onClick"
        >
          <Button
            icon="cart"
            disabled={!products.length || success}
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
