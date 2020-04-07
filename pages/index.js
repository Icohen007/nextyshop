import React from 'react';
import axios from 'axios';

const getProducts = async () => {
    const url = 'http://localhost:3000/api/products';
    const products = await axios.get(url);
    return { products: products.data };
};

function Home({ websites: products }) {
    console.log(products);
    return <>home</>;
}

Home.getInitialProps = getProducts;

export default Home;
