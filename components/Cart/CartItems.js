import {
  Header, Segment, Button, Icon, Item, Message,
} from 'semantic-ui-react';
import { useRouter } from 'next/router';

function CartItems({
  products, user, handleRemoveFromCart, success,
}) {
  const router = useRouter();

  function mapCartProductsToItems(cartProducts) {
    return cartProducts.map(({ product, quantity }) => ({
      key: product._id,
      header: (
        <Item.Header as="a" onClick={() => router.push(`/product?_id=${product._id}`)}>
          {product.name}
        </Item.Header>
      ),
      image: product.mediaUrl,
      meta: `${quantity} x $${product.price}`,
      fluid: 'true',
      extra: (
        <Button
          basic
          icon="remove"
          floated="right"
          onClick={() => handleRemoveFromCart(product._id)}
        />
      ),
    }));
  }

  if (success) {
    return (
      <Message
        success
        header="Success!"
        content="Your order and payment has been accepted"
        icon="star outline"
      />
    );
  }

  if (!products.length) {
    return (
      <Segment inverted textAlign="center" placeholder className="cart-items">
        <Header icon>
          <Icon name="shopping basket" />
          No products in your cart. Add some!
        </Header>
        <div>
          {user ? (
            <Button color="orange" onClick={() => router.push('/')}>View Products</Button>
          ) : (
            <Button color="blue" onClick={() => router.push('/login')}>Login to Add Products</Button>
          )}
        </div>
      </Segment>
    );
  }

  return <Item.Group divided items={mapCartProductsToItems(products)} />;
}

export default CartItems;
