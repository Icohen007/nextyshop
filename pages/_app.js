import App from 'next/app';
import axios from 'axios';
import { destroyCookie, parseCookies } from 'nookies';
import Router from 'next/router';
import Layout from '../components/_App/Layout';
import { isRootOrAdmin, redirectUser } from '../utils/auth';
import baseUrl from '../utils/baseUrl';

const protectedRoutes = ['/account', '/create'];

class MyApp extends App {
  componentDidMount() {
    window.addEventListener('storage', this.syncLogout);
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.syncLogout);
  }

  syncLogout(event) {
    if (event.key === 'logout') {
      Router.push('/login');
    }
  }

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
        const user = await this.fetchUserByToken(token);
        pageProps.user = user;
        const isNotPermitted = !isRootOrAdmin(user) && ctx.pathname === '/create';
        if (isNotPermitted) {
          redirectUser(ctx, '/');
        }
      } catch (error) {
        const isTokenInvalid = error.response.status === 403;
        if (isTokenInvalid) {
          destroyCookie(ctx, 'token');
          redirectUser(ctx, '/login');
        }
        console.error('Error getting current user:', error.message);
      }
    }

    return { pageProps };
  }

  static async fetchUserByToken(token) {
    const payload = { headers: { Authorization: token } };
    const url = `${baseUrl}/api/account`;
    const response = await axios.get(url, payload);
    return response.data;
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
