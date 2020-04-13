import jwt from 'jsonwebtoken';
import User from '../../models/User';
import dbConnection from '../../utils/dbConnection';
import handleRequest from '../../utils/apiUtils';

dbConnection();

async function handleGetRequest(req, res) {
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
}

async function handlePutRequest(req, res) {
  const { userId, role } = req.body;
  await User.findOneAndUpdate({ _id: userId }, { role });
  res.status(203).send('User updated');
}

const handlerMap = { GET: handleGetRequest, PUT: handlePutRequest };

export default async (req, res) => {
  await handleRequest(handlerMap, req, res);
};
