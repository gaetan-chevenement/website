import { createReducer } from 'redux-act';
import { updateRoute }   from '~/actions';

export default createReducer({
  [updateRoute]: (state, payload) => ({ ...payload }),
}, {});
