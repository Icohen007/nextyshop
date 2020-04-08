import { Segment } from 'semantic-ui-react';
import CartItems from '../components/Cart/CartItems';
import CartSummary from '../components/Cart/CartSummary';

function Cart() {
  return (
    <Segment>
      <CartItems />
      <CartSummary />
    </Segment>
  );
}

export default Cart;
