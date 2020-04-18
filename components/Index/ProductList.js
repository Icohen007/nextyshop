import { Card, Responsive } from 'semantic-ui-react';

function mapProductsToItems(products) {
  return products.map(({
    _id, mediaUrl, name, price,
  }) => ({
    header: name,
    image: mediaUrl,
    meta: `$${price}`,
    color: 'teal',
    fluid: true,
    key: _id,
    href: `/product?_id=${_id}`,
  }));
}

function ProductList({ products }) {
  const items = mapProductsToItems(products);

  return (
    <>
      <Responsive minWidth={768}>
        <Card.Group
          itemsPerRow="4"
          centered
          items={items}
        />
      </Responsive>
      <Responsive maxWidth={768}>
        <Card.Group
          itemsPerRow="2"
          centered
          items={items}
        />
      </Responsive>
    </>
  );
}

export default ProductList;
