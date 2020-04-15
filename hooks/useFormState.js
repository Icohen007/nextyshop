import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  success: false,
  error: '',
};

const ActionTypes = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  RESET: 'RESET',
};

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.LOADING:
      return { ...state, loading: true, error: '' };
    case ActionTypes.SUCCESS:
      return {
        ...state, loading: false, success: true, error: '',
      };
    case ActionTypes.ERROR:
      return {
        ...state, loading: false, success: false, error: action.payload,
      };
    case ActionTypes.RESET:
      return initialState;
    default:
      throw new Error();
  }
}

const useFormState = () => {
  const [{ loading, success, error }, dispatch] = useReducer(reducer, initialState);

  const setLoading = useCallback(() => dispatch({ type: ActionTypes.LOADING }), []);
  const setSuccess = useCallback(() => dispatch({ type: ActionTypes.SUCCESS }), []);
  const setError = useCallback((err) => dispatch({ type: ActionTypes.ERROR, payload: err }), []);
  const setReset = useCallback(() => dispatch({ type: ActionTypes.RESET }), []);

  return {
    loading, success, error, setLoading, setSuccess, setError, setReset,
  };
};

export default useFormState;
