import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Checkbox, Header, Icon, Table,
} from 'semantic-ui-react';
import cookie from 'js-cookie';
import baseUrl from '../../utils/baseUrl';
import useDidMountEffect from '../../hooks/useDidMountEffect';
import formatDate from '../../utils/formatDate';

const tableHeaders = ['', 'Name', 'Email', 'Joined', 'Updated', 'Role'];

function AccountPermissions() {
  const [users, setUsers] = useState([]);

  async function getUsers() {
    const url = `${baseUrl}/api/users`;
    const token = cookie.get('token');
    const payload = { headers: { Authorization: token } };
    const response = await axios.get(url, payload);
    setUsers(response.data);
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div style={{ margin: '2em 0' }}>
      <Header as="h2">
        <Icon name="settings" />
        User Permissions
      </Header>
      <Table compact celled definition>
        <Table.Header>
          <Table.Row>
            {tableHeaders.map((header) => (header
              ? (<Table.HeaderCell key={`${header}rand`}>{header}</Table.HeaderCell>)
              : <Table.HeaderCell key={`${header}rand`} />))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user) => (<UserPermissionRow key={user._id} user={user} />))}
        </Table.Body>
      </Table>
    </div>
  );
}

function UserPermissionRow({ user }) {
  const {
    _id, createdAt, updatedAt, role, email, name,
  } = user;

  const [admin, setAdmin] = useState(role === 'admin');

  const handleToggleChange = (event, { checked }) => { setAdmin(checked); };

  async function updatePermission() {
    const url = `${baseUrl}/api/account`;
    const payload = { userId: _id, role: admin ? 'admin' : 'user' };
    await axios.put(url, payload);
  }

  useDidMountEffect(() => {
    updatePermission();
  }, [admin]);

  return (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox toggle checked={admin} onChange={handleToggleChange} />
      </Table.Cell>
      <Table.Cell>{name}</Table.Cell>
      <Table.Cell>{email}</Table.Cell>
      <Table.Cell>{formatDate(createdAt)}</Table.Cell>
      <Table.Cell>{formatDate(updatedAt)}</Table.Cell>
      <Table.Cell>{admin ? 'admin' : 'user'}</Table.Cell>
    </Table.Row>
  );
}

export default AccountPermissions;
