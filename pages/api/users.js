import nextConnect from 'next-connect';
import User from '../../models/User';
import authenticateAndAttachUser from './middlewares/authenticateAndAttachUser';

const handler = nextConnect();
handler.use(authenticateAndAttachUser());

handler.get(async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).sort({ role: 'asc' });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting users');
  }
});

export default handler;
