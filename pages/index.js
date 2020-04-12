import React from 'react';
import axios from 'axios';
import ProductList from '../components/Index/ProductList';
import baseUrl from '../utils/baseUrl';
import ProductPagination from '../components/Index/ProductsPagination';

const NUMBER_OF_PRODUCTS_PER_PAGE = 6;

const getProducts = async (ctx) => {
  const pageNumber = ctx.query.page || '1';
  const url = `${baseUrl}/api/products`;
  const payload = { params: { page: pageNumber, size: NUMBER_OF_PRODUCTS_PER_PAGE } };
  const response = await axios.get(url, payload);
  return response.data;
};

function Home({ products, totalPages }) {
  return (
    <>
      <ProductList products={products} />
      <ProductPagination totalPages={totalPages} />
    </>
  );
}

Home.getInitialProps = getProducts;

export default Home;
