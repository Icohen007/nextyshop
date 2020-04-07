import React from 'react';
import axios from 'axios';
import ProductList from '../components/Index/ProductList';

const getProducts = async () => {
  const url = 'http://localhost:3000/api/products';
  const products = await axios.get(url);
  return { products: products.data };
};

function Home({ products }) {
  return <ProductList products={products} />;
}

Home.getInitialProps = getProducts;

export default Home;
