import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Cart from '../../models/Cart';
import dbConnection from '../../utils/dbConnection';
import handleRequest from '../../utils/apiUtils';

dbConnection();

const { ObjectId } = mongoose.Types;

async function updateCart(productId, userId, quantity) {
  const cartToUpdate = await Cart.findOne({ user: userId });

  const productAlreadyExist = cartToUpdate.products
    .some((cartObject) => ObjectId(productId).equals(cartObject.product));
  console.log({ productAlreadyExist });
  if (productAlreadyExist) {
    await Cart.findOneAndUpdate(
      { _id: cartToUpdate._id, 'products.product': productId },
      { $inc: { 'products.$.quantity': quantity } },
    );
    return;
  }

  const newProduct = { quantity, product: productId };
  await Cart.findOneAndUpdate(
    { _id: cartToUpdate._id },
    { $addToSet: { products: newProduct } },
  );
}

async function handleGetRequest(req, res) {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).send('No authorization token');
    return;
  }
  try {
    const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
    const cart = await Cart
      .findOne({ user: userId })
      .populate({
        path: 'products.product',
        model: 'Product',
      });
    res.status(200).json(cart.products);
  } catch (error) {
    console.error(error);
    res.status(403).send('Please login again');
  }
}

async function handlePutRequest(req, res) {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).send('No authorization token');
    return;
  }
  try {
    const { quantity, productId } = req.body;
    const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
    await updateCart(productId, userId, quantity);
    res.status(200).send('Cart Updated');
  } catch (error) {
    console.error(error);
    res.status(403).send('Please login again');
  }
}

const handlerMap = { GET: handleGetRequest, PUT: handlePutRequest };

export default async (req, res) => {
  await handleRequest(handlerMap, req, res);
};