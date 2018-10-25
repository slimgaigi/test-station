import createBrowserHistory from 'history/createBrowserHistory';
import {routerMiddleware} from 'react-router-redux';
import {applyMiddleware, compose, createStore, DeepPartial} from 'redux';
import {AppState} from '../model';
import rootReducer from '../reducers';

export default function configureStore(initialState: DeepPartial<AppState>) {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(routerMiddleware(createBrowserHistory())),
      (window as any)['devToolsExtension'] ? (window as any)['devToolsExtension']() : () => {}
    )
  );
}
