import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import dbConnection from '../../utils/dbConnection';

dbConnection();

export default async (req, res) => {
  const { email, password } = req.body;
  try {
    const loginUser = await User.findOne({ email }).select('+password');
    if (!loginUser) {
      res.status(404).send(`No user exist with email: ${email}`);
    }
    const isPasswordValid = await bcrypt.compare(password, loginUser.password);
    if (isPasswordValid) {
      const token = jwt.sign({ userId: loginUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.status(200).json(token);
    } else {
      res.status(401).send('Invalid Password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in user');
  }
};
