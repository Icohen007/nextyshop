import Head from 'next/head';
import { Container } from 'semantic-ui-react';

import Header from './Header';
import HeadContent from './HeadContent';
import RouterConfig from './RouterConfig';

function Layout({ children, user }) {
  return (
    <>
      <Head>
        <HeadContent />
        <link rel="stylesheet" type="text/css" href="/static/styles.css" />
        <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css"
        />
        <title>NextShop</title>
      </Head>
      <RouterConfig>
        <Header user={user} />
        <Container text style={{ paddingTop: '1em' }}>
          {children}
        </Container>
      </RouterConfig>
    </>
  );
}

export default Layout;
