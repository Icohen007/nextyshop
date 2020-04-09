import cookie from 'js-cookie';
import Router from 'next/router';

export function handleLogin(token) {
  cookie.set('token', token);
  Router.push('/account');
}

export function redirectUser(ctx, location) {
  if (ctx.req) { // if wer'e on the server
    ctx.res.writeHead(302, { Location: location }); // redirect with native node.js
    ctx.res.end();
  } else {
    Router.push(location);
  }
}
