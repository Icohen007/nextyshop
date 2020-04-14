import { Card } from 'semantic-ui-react';

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
  return (
    <Card.Group
      stackable
      itemsPerRow="4"
      centered
      items={mapProductsToItems(products)}
    />
  );
}

export default ProductList;
