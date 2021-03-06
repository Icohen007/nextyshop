import React from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import ProductList from '../components/Index/ProductList';
import baseUrl from '../utils/baseUrl';
import ProductPagination from '../components/Index/ProductsPagination';

const NUMBER_OF_PRODUCTS_PER_PAGE = 8;

function Home({ products, totalPages }) {
  return (
    <Container>
      <ProductList products={products} />
      <ProductPagination totalPages={totalPages} />
    </Container>
  );
}

Home.getInitialProps = async (ctx) => {
  const pageNumber = ctx.query.page || '1';
  const url = `${baseUrl}/api/products`;
  const payload = { params: { page: pageNumber, size: NUMBER_OF_PRODUCTS_PER_PAGE } };
  const response = await axios.get(url, payload);
  return response.data;
};

export default Home;
