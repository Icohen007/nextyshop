import nextConnect from 'next-connect';
import Order from '../../models/Order';
import authenticateAndAttachUser from './middlewares/authenticateAndAttachUser';

const handler = nextConnect();
handler.use(authenticateAndAttachUser());

handler.get(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: 'desc' })
      .populate({
        path: 'products.product',
        model: 'Product',
      });
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting orders');
  }
});

export default handler;
