import jwt from 'jsonwebtoken';
import Order from '../../models/Order';
import dbConnection from '../../utils/dbConnection';

dbConnection();

export default async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).send('No authorization token');
    return;
  }
  try {
    const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: 'desc' })
      .populate({
        path: 'products.product',
        model: 'Product',
      });
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(403).send('Please login again');
  }
};
