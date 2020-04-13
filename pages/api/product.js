import Product from '../../models/Product';
import Cart from '../../models/Cart';
import handleRequest from '../../utils/apiUtils';
import dbConnection from '../../utils/dbConnection';

dbConnection();

async function handleGetRequest(req, res) {
  const { _id } = req.query;
  const website = await Product.findOne({ _id });
  res.status(200).json(website);
}

async function handlePostRequest(req, res) {
  const {
    name, price, description, mediaUrl,
  } = req.body;
  let insertedProduct;

  if (!name || !price || !description || !mediaUrl) {
    res.status(422).send('Product missing one or more fields');
    return;
  }

  try {
    insertedProduct = await new Product({
      name, price, description, mediaUrl,
    }).save();
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error in creating product');
  }

  res.status(201).json(insertedProduct);
}

async function handleDeleteRequest(req, res) {
  const { _id } = req.query;
  try {
    await Product.findOneAndDelete({ _id });
    await Cart.updateMany({ 'products.product': _id }, { $pull: { products: { product: _id } } });
    res.status(204).json({});
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error in deleting product');
  }
}

const handlerMap = { GET: handleGetRequest, DELETE: handleDeleteRequest, POST: handlePostRequest };

export default async (req, res) => {
  await handleRequest(handlerMap, req, res);
};
