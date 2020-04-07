import React, { useEffect, useReducer, useState } from 'react';
import {
  Button, Form, Header, Icon, Image, Input, Message, TextArea,
} from 'semantic-ui-react';
import axios from 'axios';

import baseUrl from '../utils/baseUrl';
import errorHandler from '../utils/errorHandler';

const initialState = {
  name: '',
  price: '',
  media: '',
  description: '',
  error: '',
  success: false,
  loading: false,
};

const ActionTypes = {
  CHANGE_NAME: 'CHANGE_NAME',
  CHANGE_PRICE: 'CHANGE_PRICE',
  CHANGE_MEDIA: 'CHANGE_MEDIA',
  CHANGE_DESCRIPTION: 'CHANGE_DESCRIPTION',
  SUCCESS: 'SUCCESS',
  LOADING: 'LOADING',
  ERROR: 'ERROR',
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
    case ActionTypes.SUCCESS:
      return { ...initialState, success: true };
    case ActionTypes.LOADING:
      return { ...state, loading: true };
    case ActionTypes.ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      throw new Error();
  }
}

function CreateProduct() {
  const [{
    name, price, media, description, error, success, loading,
  }, dispatch] = useReducer(reducer, initialState);
  const [mediaPreview, setMediaPreview] = useState('');
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const requiredFields = [name, price, media, description];
    const requiredFieldsFilled = requiredFields.every(Boolean);
    setDisabled(!requiredFieldsFilled);
  }, [name, price, media, description]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'media') {
      const uploadedFile = files[0];
      dispatch({ type: ActionTypes.CHANGE_MEDIA, payload: uploadedFile });
      setMediaPreview(window.URL.createObjectURL(uploadedFile));
      event.target.value = null;
    } else {
      dispatch({ type: `CHANGE_${name.toUpperCase()}`, payload: value });
    }
  };

  async function handleImageUpload() {
    try {
      const UPLOAD_PRESET = 'nextShop';
      const data = new FormData();
      data.append('file', media);
      data.append('upload_preset', UPLOAD_PRESET);
      data.append('cloud_name', process.env.CLOUDINARY_CLOUD_NAME);
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, data);
      return response.data.url;
    } catch (err) {
      dispatch({ type: ActionTypes.ERROR });
    }
  }

  const displayError = (err) => {
    dispatch({ type: ActionTypes.ERROR, payload: err });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    dispatch({ type: ActionTypes.LOADING });
    try {
      const mediaUrl = await handleImageUpload();
      const newProduct = {
        name, price, description, mediaUrl,
      };
      const url = `${baseUrl}/api/product`;
      await axios.post(url, newProduct);
      dispatch({ type: ActionTypes.SUCCESS });
      setMediaPreview('');
    } catch (err) {
      errorHandler(err, displayError);
    }
  }

  return (
    <>
      <Header as="h2" block>
        <Icon name="add" color="orange" />
        Create New Product
      </Header>
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
    </>
  );
}

export default CreateProduct;
