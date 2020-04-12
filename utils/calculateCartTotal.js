function calculateCartTotal(products) {
  const cartTotal = products.reduce((acc, cur) => acc + cur.product.price * cur.quantity, 0);
  const formattedCartTotal = ((100 * cartTotal) / 100).toFixed(2);
  const formattedStripeTotal = Number((100 * cartTotal).toFixed(2));
  return { cartTotal: formattedCartTotal, stripeTotal: formattedStripeTotal };
}

export default calculateCartTotal;
