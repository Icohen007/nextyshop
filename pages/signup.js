import React, { useEffect, useReducer } from 'react';
import {
  Button, Form, Icon, Message, Segment,
} from 'semantic-ui-react';
import Link from 'next/link';
import errorHandler from '../utils/errorHandler';

const initialState = {
  name: '',
  email: '',
  password: '',
  loading: false,
  error: '',
};

const ActionTypes = {
  CHANGE_NAME: 'CHANGE_NAME',
  CHANGE_EMAIL: 'CHANGE_EMAIL',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  LOADING: 'LOADING',
  ERROR: 'ERROR',
};

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.CHANGE_NAME:
      return { ...state, name: action.payload };
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

function Signup() {
  const [{
    name, email, password, loading, error,
  }, dispatch] = useReducer(reducer, initialState);
  const [disabled, setDisabled] = React.useState(true);

  useEffect(() => {
    const requiredFields = [name, email, password];
    const requiredFieldsFilled = requiredFields.every(Boolean);
    setDisabled(!requiredFieldsFilled);
  }, [name, email, password]);

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
    const newUser = { name, email, password };
    try {
      console.log(newUser);
      // make request to signup user
    } catch (err) {
      errorHandler(err, displayError);
    }
  }

  return (
    <>
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
            icon="sign in"
            type="submit"
            color="orange"
            content="Login"
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
    </>
  );
}

export default Signup;
