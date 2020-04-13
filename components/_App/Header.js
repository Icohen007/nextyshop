import {
  Container, Icon, Image, Menu,
} from 'semantic-ui-react';
import { useContext } from 'react';
import Link from 'next/link';
import HeaderLink from './HeaderLink';
import { IsActiveContext } from './RouterConfig';
import { handleLogout, isRootOrAdmin } from '../../utils/auth';

function Header({ user }) {
  const isActive = useContext(IsActiveContext);

  return (
    <Menu stackable fluid color="teal" inverted>
      <Container text>
        <Link href="/">
          <Menu.Item header>
            <Image
              size="mini"
              src="/static/logo.svg"
              style={{ marginRight: '1em' }}
            />
            Nexty
          </Menu.Item>
        </Link>
        <HeaderLink title="Cart" iconName="cart" linkTo="/cart" isActive={isActive} />
        { isRootOrAdmin(user) && <HeaderLink title="Create" iconName="add" linkTo="/create" isActive={isActive} /> }
        { user
          ? (
            <>
              <HeaderLink title="Account" iconName="user" linkTo="/account" isActive={isActive} />
              <Menu.Item onClick={handleLogout} header>
                <Icon
                  name="sign out"
                  size="large"
                />
                Logout
              </Menu.Item>
            </>
          ) : (
            <>
              <HeaderLink title="Login" iconName="sign in" linkTo="/login" isActive={isActive} />
              <HeaderLink title="Signup" iconName="signup" linkTo="/signup" isActive={isActive} />
            </>
          )}
      </Container>
    </Menu>
  );
}

export default Header;
