import products from '../../static/products.json';
import dbConnection from '../../utils/dbConnection';

dbConnection();

export default (req, res) => {
    res.status(200).json(products);
};
