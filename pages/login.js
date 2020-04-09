import React, { useEffect, useReducer } from 'react';
import {
  Button, Form, Icon, Message, Segment,
} from 'semantic-ui-react';
import Link from 'next/link';
import axios from 'axios';
import errorHandler from '../utils/errorHandler';
import baseUrl from '../utils/baseUrl';
import { handleLogin } from '../utils/auth';


const initialState = {
  email: '',
  password: '',
  loading: false,
  error: '',
};

const ActionTypes = {
  CHANGE_EMAIL: 'CHANGE_EMAIL',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  LOADING: 'LOADING',
  ERROR: 'ERROR',
};

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.CHANGE_EMAIL:
      return { ...state, email: action.payload };
    case ActionTypes.CHANGE_PASSWORD:
      return { ...state, password: action.payload };
    case ActionTypes.LOADING:
      return { ...state, loading: true, error: '' };
    case ActionTypes.ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      throw new Error();
  }
}

function Login() {
  const [{
    email, password, loading, error,
  }, dispatch] = useReducer(reducer, initialState);
  const [disabled, setDisabled] = React.useState(true);

  useEffect(() => {
    const requiredFields = [email, password];
    const requiredFieldsFilled = requiredFields.every(Boolean);
    setDisabled(!requiredFieldsFilled);
  }, [email, password]);

  const handleChange = (event) => {
    const { name: eventName, value } = event.target;
    dispatch({ type: `CHANGE_${eventName.toUpperCase()}`, payload: value });
  };

  const displayError = (err) => {
    dispatch({ type: ActionTypes.ERROR, payload: err });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    dispatch({ type: ActionTypes.LOADING });
    const loginUser = { email, password };
    try {
      const url = `${baseUrl}/api/login`;
      const response = await axios.post(url, loginUser);
      handleLogin(response.data);
    } catch (err) {
      errorHandler(err, displayError);
    }
  }

  return (
    <>
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
            icon="signup"
            type="submit"
            color="orange"
            content="Signup"
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
    </>
  );
}

export default Login;
