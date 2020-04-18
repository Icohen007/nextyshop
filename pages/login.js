import React, { useEffect, useReducer } from 'react';
import {
  Button, Container, Form, Icon, Message, Segment,
} from 'semantic-ui-react';
import Link from 'next/link';
import axios from 'axios';
import errorHandler from '../utils/errorHandler';
import baseUrl from '../utils/baseUrl';
import { handleLogin } from '../utils/auth';
import useFormState from '../hooks/useFormState';

const initialState = {
  email: '',
  password: '',
};

const ActionTypes = {
  CHANGE_EMAIL: 'CHANGE_EMAIL',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
};

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.CHANGE_EMAIL:
      return { ...state, email: action.payload };
    case ActionTypes.CHANGE_PASSWORD:
      return { ...state, password: action.payload };
    default:
      throw new Error();
  }
}

function Login() {
  const [{ email, password }, dispatch] = useReducer(reducer, initialState);
  const [disabled, setDisabled] = React.useState(true);
  const {
    error, loading, setError, setLoading,
  } = useFormState();

  useEffect(() => {
    const requiredFields = [email, password];
    const requiredFieldsFilled = requiredFields.every(Boolean);
    setDisabled(!requiredFieldsFilled);
  }, [email, password]);

  const handleChange = (event) => {
    const { name: eventName, value } = event.target;
    dispatch({ type: `CHANGE_${eventName.toUpperCase()}`, payload: value });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading();
    const loginUser = { email, password };
    try {
      const url = `${baseUrl}/api/login`;
      const response = await axios.post(url, loginUser);
      handleLogin(response.data);
    } catch (err) {
      errorHandler(err, setError);
    }
  }

  return (
    <Container text>
      <Message
        attached
        icon="privacy"
        header="Welcome Back!"
        content="Log in with email and password"
        color="blue"
      />
      <Form error={Boolean(error)} loading={loading} onSubmit={handleSubmit}>
        <Message error header="Oops!" content={error} />
        <Segment>
          <Form.Input
            fluid
            icon="envelope"
            iconPosition="left"
            label="Email"
            placeholder="Email"
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
          />
          <Form.Input
            fluid
            icon="lock"
            iconPosition="left"
            label="Password"
            placeholder="Password"
            name="password"
            type="password"
            value={password}
            onChange={handleChange}
          />
          <Button
            disabled={disabled || loading}
            icon="sign in"
            type="submit"
            color="blue"
            content="Login"
          />
        </Segment>
      </Form>
      <Message attached="bottom" warning>
        <Icon name="help" />
        New user?
        {' '}
        <Link href="/signup">
          <a>Sign up here</a>
        </Link>
        {' '}
        instead.
      </Message>
    </Container>
  );
}

export default Login;
