import mongoose from 'mongoose';
import nextConnect from 'next-connect';
import authenticateAndAttachUser from './middlewares/authenticateAndAttachUser';
import Cart from '../../models/Cart';

const handler = nextConnect();
handler.use(authenticateAndAttachUser());

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

handler.get(async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate({
      path: 'products.product',
      model: 'Product',
    });
    res.status(200).json(cart.products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting Cart');
  }
});

handler.put(async (req, res) => {
  try {
    const { quantity, productId } = req.body;
    await updateCart(productId, req.userId, quantity);
    res.status(200).send('Cart Updated');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error Cart change');
  }
});

handler.delete(async (req, res) => {
  try {
    const { productId } = req.query;
    const cart = await Cart.findOneAndUpdate(
      { user: req.userId },
      { $pull: { products: { product: productId } } },
      { new: true },
    ).populate({
      path: 'products.product',
      model: 'Product',
    });
    res.status(200).json(cart.products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error Cart delete product');
  }
});

export default handler;
