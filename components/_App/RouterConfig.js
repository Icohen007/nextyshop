import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import React from 'react';

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

export const IsActiveContext = React.createContext(() => {});

function RouterConfig({ children }) {
  const router = useRouter();
  return (
    <IsActiveContext.Provider value={(route) => route === router.pathname}>
      {children}
    </IsActiveContext.Provider>
  );
}

export default RouterConfig;
