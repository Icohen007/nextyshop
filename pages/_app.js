import App from 'next/app';
import axios from 'axios';
import { destroyCookie, parseCookies } from 'nookies';
import Layout from '../components/_App/Layout';
import { redirectUser } from '../utils/auth';
import baseUrl from '../utils/baseUrl';

const protectedRoutes = ['/account', '/create'];

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const { token } = parseCookies(ctx);

    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    if (!token) {
      const isProtectedRoute = protectedRoutes.some((route) => ctx.pathname === route);
      if (isProtectedRoute) {
        redirectUser(ctx, '/login');
      }
    } else {
      try {
        const payload = { headers: { Authorization: token } };
        const url = `${baseUrl}/api/account`;
        const response = await axios.get(url, payload);
        const user = response.data;
        pageProps.user = user;
      } catch (error) {
        if (error.response.status === 403) {
          destroyCookie(ctx, 'token');
        }
        console.error('Error getting current user', error.message);
      }
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
