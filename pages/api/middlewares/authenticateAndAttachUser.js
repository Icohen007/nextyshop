import jwt from 'jsonwebtoken';

function authenticateAndAttachUser() {
  return (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).send('No authorization token');
      return;
    }
    try {
      const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
      req.userId = userId;
    } catch (error) {
      res.status(403).send('Invalid Token');
      return;
    }
    next();
  };
}

export default authenticateAndAttachUser;
