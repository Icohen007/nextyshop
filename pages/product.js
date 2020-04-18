import axios from 'axios';
import { Container } from 'semantic-ui-react';
import ProductReview from '../components/Product/ProductReview';
import ProductActions from '../components/Product/ProductActions';
import baseUrl from '../utils/baseUrl';

function Product({ product, user }) {
  return (
    <Container>
      <ProductReview {...product} user={user} />
      <ProductActions {...product} user={user} />
    </Container>
  );
}

Product.getInitialProps = async ({ query: { _id } }) => {
  const url = `${baseUrl}/api/product`;
  const payload = { params: { _id } }; // same as concating ?_id=
  const response = await axios.get(url, payload);
  return { product: response.data };
};

export default Product;
