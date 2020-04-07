import Product from '../../models/Product';
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
  if (!name || !price || !description || !mediaUrl) {
    res.status(422).send('Product missing one or more fields');
    return;
  }
  const insertedProduct = await new Product({
    name, price, description, mediaUrl,
  }).save();
  res.status(201).json(insertedProduct);
}

async function handleDeleteRequest(req, res) {
  const { _id } = req.query;
  await Product.findOneAndDelete({ _id });
  res.status(204).json({});
}

const handlerMap = { GET: handleGetRequest, DELETE: handleDeleteRequest, POST: handlePostRequest };

export default async (req, res) => {
  await handleRequest(handlerMap, req, res);
};
