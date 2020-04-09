import cookie from 'js-cookie';
import Router from 'next/router';

export function handleLogin(token) {
  cookie.set('token', token);
  Router.push('/account');
}

export function handleLogout() {
  cookie.remove('token');
  window.localStorage.setItem('logout', Date.now());
  Router.push('/login');
}

export function redirectUser(ctx, location) {
  if (ctx.req) { // if wer'e on the server
    ctx.res.writeHead(302, { Location: location }); // redirect with native node.js
    ctx.res.end();
  } else {
    Router.push(location);
  }
}

export const isRoot = (user) => user && user.role === 'root';
export const isAdmin = (user) => user && user.role === 'admin';
export const isRootOrAdmin = (user) => isRoot(user) || isAdmin(user);
