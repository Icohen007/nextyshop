import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import User from '../../models/User';
import Cart from '../../models/Cart';
import dbConnection from '../../utils/dbConnection';

dbConnection();

async function generateFieldError(name, password, email) {
  let errorMessage = '';
  if (!isLength(name, { min: 3, max: 10 })) {
    errorMessage = 'Name must be 3-10 characters long';
  } else if (!isLength(password, { min: 6 })) {
    errorMessage = 'Password must be at least 6 characters';
  } else if (!isEmail(email)) {
    errorMessage = 'Email must be valid';
  } else if (await User.findOne({ email })) {
    errorMessage = `User already exists with email ${email}`;
  }
  return errorMessage;
}

export default async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const errorMessage = await generateFieldError(name, password, email);
    if (errorMessage) {
      res.status(422).send(errorMessage);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
    }).save();

    await new Cart({ user: newUser._id }).save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET, {
        expiresIn: '7d',
      },
    );

    res.status(201).json(token);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error signing up user. Please try again later');
  }
};
