import {
  Header, Segment, Button, Icon, Item,
} from 'semantic-ui-react';
import { useRouter } from 'next/router';

function CartItems({ products, user }) {
  const router = useRouter();

  function mapCartProductsToItems(cartProducts) {
    return cartProducts.map(({ product, quantity }) => ({
      childKey: product._id,
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
          onClick={() => console.log(product._id)}
        />
      ),
    }));
  }

  if (!products.length) {
    return (
      <Segment secondary color="violet" inverted textAlign="center" placeholder>
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
