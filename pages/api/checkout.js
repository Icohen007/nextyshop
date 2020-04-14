import Stripe from 'stripe';
import uuidv4 from 'uuid/v4';
import nextConnect from 'next-connect';
import Cart from '../../models/Cart';
import Order from '../../models/Order';
import calculateCartTotal from '../../utils/calculateCartTotal';
import authenticateAndAttachUser from './middlewares/authenticateAndAttachUser';

const handler = nextConnect();
handler.use(authenticateAndAttachUser());

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function getPrevCustomerOrCreate({ email, id }) {
  const prevCustomer = await stripe.customers.list({ email, limit: 1 });
  const isExistingCustomer = prevCustomer.data.length > 0;

  if (isExistingCustomer) {
    return prevCustomer.data[0].id;
  }

  const newCustomer = await stripe.customers.create({ email, source: id });
  return newCustomer.id;
}


handler.post(async (req, res) => {
  const { paymentData } = req.body;
  const { userId } = req;

  try {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'products.product',
      model: 'Product',
    });

    const customer = await getPrevCustomerOrCreate(paymentData);

    const { cartTotal, stripeTotal } = calculateCartTotal(cart.products);
    await stripe.charges.create(
      {
        currency: 'usd',
        amount: stripeTotal,
        receipt_email: paymentData.email,
        customer,
        description: `Checkout | ${paymentData.email} | ${paymentData.id}`,
      },
      {
        idempotency_key: uuidv4(),
      },
    );

    await new Order({
      user: userId,
      email: paymentData.email,
      total: cartTotal,
      products: cart.products,
    }).save();

    await Cart.findOneAndUpdate({ _id: cart._id }, { $set: { products: [] } });

    res.status(200).send('Checkout successful');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing charge');
  }
});

export default handler;
