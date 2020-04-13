import axios from 'axios';
import ProductReview from '../components/Product/ProductReview';
import ProductActions from '../components/Product/ProductActions';
import baseUrl from '../utils/baseUrl';

function Product({ product, user }) {
  return (
    <>
      <ProductReview {...product} user={user} />
      <ProductActions {...product} user={user} />
    </>
  );
}

Product.getInitialProps = async ({ query: { _id } }) => {
  const url = `${baseUrl}/api/product`;
  const payload = { params: { _id } }; // same as concating ?_id=
  const response = await axios.get(url, payload);
  return { product: response.data };
};

export default Product;
