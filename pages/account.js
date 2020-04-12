import { parseCookies } from 'nookies';
import axios from 'axios';
import AccountHeader from '../components/Account/AccountHeader';
import AccountOrders from '../components/Account/AccountOrders';
import baseUrl from '../utils/baseUrl';

function Account({ user, orders }) {
  return (
    <>
      <AccountHeader {...user} />
      <AccountOrders orders={orders} />
    </>
  );
}

// same as cart. TODO: remove duplication
Account.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { orders: [] };
  }
  const payload = { headers: { Authorization: token } };
  const url = `${baseUrl}/api/orders`;
  const response = await axios.get(url, payload);
  return response.data;
};

export default Account;
