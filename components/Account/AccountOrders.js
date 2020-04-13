import {
  Header, Accordion, Label, Segment, Icon, Button, List, Image, Container,
} from 'semantic-ui-react';
import { useRouter } from 'next/router';
import formatDate from '../../utils/formatDate';

const OrderItem = ({ product, quantity }) => (
  <List.Item>
    <Image avatar src={product.mediaUrl} />
    <List.Content>
      <List.Header>{product.name}</List.Header>
      <List.Description>
        {`${quantity} x $${product.price}`}
      </List.Description>
    </List.Content>
    <List.Content floated="right">
      <Label tag color="red" size="tiny">
        {product.sku}
      </Label>
    </List.Content>
  </List.Item>
);

function mapOrdersToPanels(orders) {
  return orders.map(({
    _id, createdAt, email, products, total,
  }) => ({
    key: _id,
    title: {
      content: <Label color="blue" content={formatDate(createdAt)} />,
    },
    content: {
      content: (
        <Container>
          <List.Header as="h3">
            {`Total: $${total}`}
            <Label
              content={email}
              icon="mail"
              basic
              horizontal
              style={{ marginLeft: '1em' }}
            />
          </List.Header>
          <List>
            {products.map(({ product, quantity }) => (
              <OrderItem product={product} quantity={quantity} />
            ))}
          </List>
        </Container>
      ),
    },
  }));
}

function AccountOrders({ orders }) {
  const router = useRouter();

  return (
    <>
      <Header as="h2">
        <Icon name="folder open" />
        Order History
      </Header>
      {orders.length ? (
        <Accordion
          fluid
          styled
          exclusive={false}
          panels={mapOrdersToPanels(orders)}
        />
      ) : (
        <Segment inverted tertiary color="grey" textAlign="center">
          <Header icon>
            <Icon name="copy outline" />
            No past orders.
          </Header>
          <div>
            <Button onClick={() => router.push('/')} color="orange">
              View Products
            </Button>
          </div>
        </Segment>
      )}
    </>
  );
}

export default AccountOrders;
