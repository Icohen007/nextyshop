import React from 'react';
import Link from 'next/link';
import { Icon, Menu } from 'semantic-ui-react';

function HeaderLink({ title, iconName, linkTo, isActive }) {
  return (
    <Link href={linkTo}>
      <Menu.Item header active={isActive(linkTo)}>
        <Icon
          name={iconName}
          size="large"
        />
        {title}
      </Menu.Item>
    </Link>
  );
}

export default HeaderLink;
