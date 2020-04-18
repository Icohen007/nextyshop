import React, { useEffect, useReducer, useState } from 'react';
import {
  Button, Form, Header, Icon, Image, Input, Message, TextArea, Segment, Container,
} from 'semantic-ui-react';
import axios from 'axios';

import baseUrl from '../utils/baseUrl';
import errorHandler from '../utils/errorHandler';
import useFormState from '../hooks/useFormState';

const initialState = {
  name: '',
  price: '',
  media: '',
  description: '',
};

const ActionTypes = {
  CHANGE_NAME: 'CHANGE_NAME',
  CHANGE_PRICE: 'CHANGE_PRICE',
  CHANGE_MEDIA: 'CHANGE_MEDIA',
  CHANGE_DESCRIPTION: 'CHANGE_DESCRIPTION',
  CLEAR: 'CLEAR',
};

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.CHANGE_NAME:
      return { ...state, name: action.payload };
    case ActionTypes.CHANGE_PRICE:
      return { ...state, price: action.payload };
    case ActionTypes.CHANGE_MEDIA:
      return { ...state, media: action.payload };
    case ActionTypes.CHANGE_DESCRIPTION:
      return { ...state, description: action.payload };
    case ActionTypes.CLEAR:
      return initialState;
    default:
      throw new Error();
  }
}

let inputTarget = null;

function CreateProduct() {
  const [{
    name, price, media, description,
  }, dispatch] = useReducer(reducer, initialState);
  const [mediaPreview, setMediaPreview] = useState('');
  const [disabled, setDisabled] = useState(true);
  const {
    error, loading, setError, setLoading, setReset, setSuccess, success,
  } = useFormState();

  useEffect(() => {
    const requiredFields = [name, price, media, description];
    const requiredFieldsFilled = requiredFields.every(Boolean);
    setDisabled(!requiredFieldsFilled);
  }, [name, price, media, description]);

  const handleChange = (event) => {
    const { name: eventName, value, files } = event.target;
    if (eventName === 'media') {
      const uploadedFile = files[0];
      dispatch({ type: ActionTypes.CHANGE_MEDIA, payload: uploadedFile });
      setMediaPreview(window.URL.createObjectURL(uploadedFile));
      inputTarget = event.target;
    } else {
      dispatch({ type: `CHANGE_${eventName.toUpperCase()}`, payload: value });
    }
  };

  async function handleImageUpload() {
    const UPLOAD_PRESET = 'nextShop';
    const data = new FormData();
    data.append('file', media);
    data.append('upload_preset', UPLOAD_PRESET);
    data.append('cloud_name', process.env.CLOUDINARY_CLOUD_NAME);
    const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, data);
    return response.data.url;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading();
    try {
      const mediaUrl = await handleImageUpload();
      const newProduct = {
        name, price, description, mediaUrl,
      };
      const url = `${baseUrl}/api/product`;
      await axios.post(url, newProduct);
      setReset();
      setSuccess();
      dispatch({ type: ActionTypes.CLEAR });
      setMediaPreview('');
      inputTarget.value = null;
    } catch (err) {
      errorHandler(err, setError);
    }
  }

  return (
    <Container text>
      <Header as="h2" block textAlign="center">
        <Icon name="add" color="orange" />
        Create New Product
      </Header>
      <Segment secondary raised>
        <Form loading={loading} error={Boolean(error)} success={success} onSubmit={handleSubmit}>
          <Message error header="Oops!" content={error} />

          <Message
            success
            icon="check"
            header="Success!"
            content="Your product has been posted"
          />
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              name="name"
              label="Name"
              placeholder="Name"
              value={name}
              onChange={handleChange}
            />
            <Form.Field
              control={Input}
              name="price"
              label="Price"
              placeholder="Price"
              min="0.00"
              step="0.01"
              type="number"
              value={price}
              onChange={handleChange}
            />
            <Form.Field
              control={Input}
              name="media"
              type="file"
              label="Media"
              accept="image/*"
              content="Select Image"
              onChange={handleChange}
              style={{ maxWidth: '92%' }}
            />
          </Form.Group>
          <Image src={mediaPreview} rounded centered size="small" />
          <Form.Field
            control={TextArea}
            name="description"
            label="Description"
            placeholder="Description"
            onChange={handleChange}
            value={description}
          />
          <Form.Field
            control={Button}
            disabled={disabled || loading}
            color="blue"
            icon="pencil alternate"
            content="Submit"
            type="submit"
          />
        </Form>
      </Segment>
    </Container>
  );
}

export default CreateProduct;
