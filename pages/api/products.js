import Product from '../../models/Product';
import dbConnection from '../../utils/dbConnection';

dbConnection();

export default async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
};
