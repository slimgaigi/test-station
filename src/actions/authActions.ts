import {User} from 'firebase';
import {push} from 'react-router-redux';
import {AnyAction, Dispatch} from 'redux';
import * as toastr from 'toastr';

import firebaseApi, {FirebaseUser} from '../api/firebase';
import * as types from './actionTypes';

import {ajaxCallError, beginAjaxCall} from './ajaxStatusActions';
import {userCreated, userIsAdminSuccess, userLoadedSuccess} from './userActions';

export function authInitializedDone() {
  return {
    type: types.AUTH_INITIALIZATION_DONE
  };
}

export function authLoggedInSuccess(userUID: string) {
  return {
    type: types.AUTH_LOGGED_IN_SUCCESS, userUID
  };
}

export function authLoggedOutSuccess() {

  return {type: types.AUTH_LOGGED_OUT_SUCCESS};
}

export function authInitialized(user: User) {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(authInitializedDone());
    if (user) {
      dispatch(authLoggedIn(user.uid));
    } else {
      dispatch(authLoggedOutSuccess());
    }
  };
}

export function authLoggedIn(userUID: string): (dispatch: Dispatch<AnyAction>) => void {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(authLoggedInSuccess(userUID));
    dispatch(beginAjaxCall());
    firebaseApi.GetChildAddedByKeyOnce('/users', userUID)
      .then(
        user => {
          dispatch(userLoadedSuccess(user.val()));
          dispatch(push('/'));
        })
      .catch(
        error => {
          dispatch(beginAjaxCall());
          // @TODO better error handling
          throw(error);
        });
  };
}

export function createUserWithEmailAndPassword(user: FirebaseUser) {
  return (dispatch: Dispatch) => {
    dispatch(beginAjaxCall());
    return firebaseApi.createUserWithEmailAndPassword(user).then((user: any) => {
      dispatch(userCreated(user));
    }).catch(error => {
      dispatch(ajaxCallError(error));
      // @TODO better error handling
      throw(error);
    });
  };
}

export function signInWithEmailAndPassword(user) {
  return (dispatch) => {
    dispatch(beginAjaxCall());
    return firebaseApi.signInWithEmailAndPassword(user)
      .then(
        user => {
          dispatch(authLoggedIn(user.uid));
        })
      .catch(error => {
        dispatch(ajaxCallError(error));
        // @TODO better error handling
        throw(error);
      });
  };
}

export function signOut() {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return firebaseApi.authSignOut()
      .then(
        () => {
          dispatch(authLoggedOutSuccess());
          if (getState().routesPermissions.requireAuth
            .filter(route => route === getState().routing.locationBeforeTransitions.pathname).toString()) {
            dispatch(push('/'));
          }
        })
      .catch(error => {
        dispatch(ajaxCallError(error));
        // @TODO better error handling
        throw(error);
      });
  };
}


function redirect(replace, pathname, nextPathName, error = false) {
  replace({
    pathname: pathname,
    state: {nextPathname: nextPathName}
  });
  if (error) {
    toastr.error(error);
  }
}

export function requireAuth(nextState: { location: { pathname: any; }; }, replace) {
  return (dispatch, getState) => {
    if (!getState().auth.isLogged) {
      redirect(replace, '/login', nextState.location.pathname, 'You need to be logged to access this page');
    }
  };
}


export function requireAdmin(nextState: any, replace: any, callback: any) {
  return (dispatch: any, getState: any) => {
    if (getState().auth.isLogged) {
      switch (getState().user.isAdmin) {
        case false:
          redirect(replace, '/login', nextState.location.pathname, 'You need to be logged to access this page');
          break;
        case undefined:
          firebaseApi.GetChildAddedByKeyOnce('/isAdmin/', getState().auth.currentUserUID)
            .then(
              user => {
                if (user.exists() && user.val()) {
                  dispatch(userIsAdminSuccess());
                  callback();
                } else {
                  redirect(replace, '/login', nextState.location.pathname, 'You need to be logged to access this page');
                }
              })
            .catch(
              error => {
                dispatch(ajaxCallError());
                redirect(replace, '/login', nextState.location.pathname, 'You need to be logged to access this page');
                callback();
                // @TODO better error handling
                throw(error);
              });
          break;
        case true:
          callback();
          break;

      }
    } else {
      redirect(replace, '/login', nextState.location.pathname, 'You need to be logged to access this page');
      callback();
    }
  };
}
