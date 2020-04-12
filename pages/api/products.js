import Product from '../../models/Product';
import dbConnection from '../../utils/dbConnection';

dbConnection();

async function getProductsOfGivenPage(pageSize, pageNumber) {
  const skips = pageSize * (pageNumber - 1);
  return Product.find().skip(skips).limit(pageSize);
}

async function getTotalPages(pageSize) {
  const totalDocs = await Product.countDocuments();
  return Math.ceil(totalDocs / pageSize);
}

export default async (req, res) => {
  const { page, size } = req.query;
  const pageNumber = Number(page);
  const pageSize = Number(size);

  const products = await getProductsOfGivenPage(pageSize, pageNumber);
  const totalPages = await getTotalPages(pageSize);

  res.status(200).json({ products, totalPages });
};
