import { Input } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import cookie from 'js-cookie';
import baseUrl from '../../utils/baseUrl';
import errorHandler from '../../utils/errorHandler';
import useFormState from '../../hooks/useFormState';

function AddProductToCart({ user, productId }) {
  const [quantity, setQuantity] = useState(1);
  const {
    error, loading, setError, setLoading, setSuccess, success, setReset,
  } = useFormState();
  const router = useRouter();

  const handleQuantityChange = (event) => setQuantity(+event.target.value);

  async function handleAddProductToCart() {
    try {
      setLoading();
      const url = `${baseUrl}/api/cart`;
      const payload = { quantity, productId };
      const token = cookie.get('token');
      const headers = { headers: { Authorization: token } };
      await axios.put(url, payload, headers);
      setSuccess();
    } catch (err) {
      errorHandler(err, setError);
    }
  }

  const getActionObject = () => {
    if (user && success) {
      return {
        color: 'blue',
        content: 'Item Added!',
        icon: 'plus cart',
        disabled: true,
      };
    }

    if (user) {
      return {
        color: 'orange',
        content: 'Add to Cart',
        icon: 'plus cart',
        loading,
        disabled: loading,
        onClick: handleAddProductToCart,
      };
    }

    return {
      color: 'blue',
      content: 'Sign Up To Purchase',
      icon: 'signup',
      onClick: () => router.push('/signup'),
    };
  };


  useEffect(() => {
    if (error) {
      window.alert(error);
    }
  }, [error]);

  useEffect(() => {
    let timeoutId;
    if (success) {
      timeoutId = setTimeout(() => { setReset(); }, 3000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [success]);


  return (
    <Input
      type="number"
      min="1"
      placeholder="Quantity"
      value={quantity}
      onChange={handleQuantityChange}
      action={getActionObject()}
    />
  );
}

export default AddProductToCart;
