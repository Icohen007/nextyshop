import Product from '../../models/Product';
import handleRequest from '../../utils/apiUtils';

async function handleGetRequest(req, res) {
  const { _id } = req.query;
  const website = await Product.findOne({ _id });
  res.status(200).json(website);
}

async function handleDeleteRequest(req, res) {
  const { _id } = req.query;
  await Product.findOneAndDelete({ _id });
  res.status(204).json({});
}

const handlerMap = { GET: handleGetRequest, DELETE: handleDeleteRequest };

export default async (req, res) => {
  await handleRequest(handlerMap, req, res);
};
