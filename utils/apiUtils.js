import axios from 'axios';

export default async function handleRequest(handlerMap, req, res) {
  const handlerFunction = handlerMap[req.method];
  if (handlerFunction) {
    await handlerFunction(req, res);
  } else {
    res.status(405).send(`Method ${req.method} not allowed`);
  }
}
