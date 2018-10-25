import {createStore, DeepPartial} from 'redux';
import {AppState} from '../model';
import rootReducer from '../reducers';

export default function configureStore(initialState: DeepPartial<AppState>) {
  return createStore(
    rootReducer,
    initialState,
  );
}
