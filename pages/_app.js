import App from 'next/app';
import axios from 'axios';
import { destroyCookie, parseCookies } from 'nookies';
import Router from 'next/router';
import Layout from '../components/_App/Layout';
import { isRootOrAdmin, redirectUser } from '../utils/auth';
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
        const isNotPermitted = !isRootOrAdmin(user) && ctx.pathname === '/create';
        if (isNotPermitted) {
          redirectUser(ctx, '/');
        }
      } catch (error) {
        if (error.response.status === 403) {
          destroyCookie(ctx, 'token');
          redirectUser(ctx, '/login');
        }
        console.error('Error getting current user', error.message);
      }
    }

    return { pageProps };
  }

  componentDidMount() {
    window.addEventListener('storage', this.syncLogout);
  }

  componentWillUnmount() {
      window.removeEventListener('storage', this.syncLogout);
  }

  syncLogout = (event) => {
      if(event.key === 'logout') {
          Router.push('/login');
      }
  };

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
