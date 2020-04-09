import jwt from 'jsonwebtoken';
import User from '../../models/User';
import dbConnection from '../../utils/dbConnection';

dbConnection();

export default async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).send('No authorization token');
    return;
  }

  try {
    const { userId } = jwt.verify(authorization, process.env.JWT_SECRET); // throws error if not valid
    const user = await User.findOne({ _id: userId });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(403).send('Invalid Token');
  }
};
