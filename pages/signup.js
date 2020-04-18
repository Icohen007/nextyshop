import React, { useState, useEffect, useReducer } from 'react';
import {
  Button, Container, Form, Icon, Message, Segment,
} from 'semantic-ui-react';
import Link from 'next/link';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import errorHandler from '../utils/errorHandler';
import { handleLogin } from '../utils/auth';
import useFormState from '../hooks/useFormState';

const initialState = {
  name: '',
  email: '',
  password: '',
};

const ActionTypes = {
  CHANGE_NAME: 'CHANGE_NAME',
  CHANGE_EMAIL: 'CHANGE_EMAIL',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
};

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.CHANGE_NAME:
      return { ...state, name: action.payload };
    case ActionTypes.CHANGE_EMAIL:
      return { ...state, email: action.payload };
    case ActionTypes.CHANGE_PASSWORD:
      return { ...state, password: action.payload };
    default:
      throw new Error();
  }
}

function Signup() {
  const [{ name, email, password }, dispatch] = useReducer(reducer, initialState);
  const [disabled, setDisabled] = useState(true);
  const {
    error, loading, setError, setLoading,
  } = useFormState();

  useEffect(() => {
    const requiredFields = [name, email, password];
    const requiredFieldsFilled = requiredFields.every(Boolean);
    setDisabled(!requiredFieldsFilled);
  }, [name, email, password]);

  const handleChange = (event) => {
    const { name: eventName, value } = event.target;
    dispatch({ type: `CHANGE_${eventName.toUpperCase()}`, payload: value });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading();
    const newUser = { name, email, password };
    try {
      const url = `${baseUrl}/api/signup`;
      const response = await axios.post(url, newUser);
      handleLogin(response.data);
    } catch (err) {
      errorHandler(err, setError);
    }
  }

  return (
    <Container text>
      <Message
        attached
        icon="settings"
        header="Get Started!"
        content="Create a new account"
        color="teal"
      />
      <Form error={Boolean(error)} loading={loading} onSubmit={handleSubmit}>
        <Message error header="Oops!" content={error} />
        <Segment>
          <Form.Input
            fluid
            icon="user"
            iconPosition="left"
            label="Name"
            placeholder="Name"
            name="name"
            value={name}
            onChange={handleChange}
          />
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
        Existing user?
        {' '}
        <Link href="/login">
          <a>Log in here</a>
        </Link>
        {' '}
        instead.
      </Message>
    </Container>
  );
}

export default Signup;
