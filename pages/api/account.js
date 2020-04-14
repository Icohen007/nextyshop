import nextConnect from 'next-connect';
import User from '../../models/User';
import authenticateAndAttachUser from './middlewares/authenticateAndAttachUser';

const handler = nextConnect();
handler.use(authenticateAndAttachUser());

handler.get(async (req, res) => {
  const user = await User.findOne({ _id: req.userId });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send('User not found');
  }
});

handler.put(async (req, res) => {
  const { userId, role } = req.body;
  await User.findOneAndUpdate({ _id: userId }, { role });
  res.status(203).send('User updated');
});

export default handler;
