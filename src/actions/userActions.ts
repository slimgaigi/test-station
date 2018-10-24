import firebaseApi from '../api/firebase';
import * as types from './actionTypes';

import { authLoggedIn } from './authActions';
import {ajaxCallError, beginAjaxCall} from './ajaxStatusActions';
import {User} from "firebase";
import {AnyAction, Dispatch} from "redux";

function extractUserProperties(firebaseUser: User) {

  const user = {};
  const userProperties = [
    'displayName',
    'email',
    'emailVerified',
    'isAnonymous',
    'photoURL',
    'providerData',
    'providerId',
    'refreshToken',
    'uid',
    'isAdmin'
  ];

  userProperties.map((prop: string) => {
    if (prop in firebaseUser) {
      user[prop] = firebaseUser[prop];
    }
  });

  return user;
}

export function userCreated(user: User) {
  return (dispatch: Dispatch<AnyAction>) => {
    firebaseApi.databaseSet('/users/' + user.uid, extractUserProperties(user))
      .then(
        () => {
          dispatch(authLoggedIn(user.uid));
          dispatch(userCreatedSuccess());
        })
      .catch(
        error => {
          dispatch(ajaxCallError(error));
          // @TODO better error handling
          throw(error);
        });
  };
}

export function userCreatedSuccess() {
  return {
    type: types.USER_CREATED_SUCCESS
  };
}

export function userLoadedSuccess(user) {
  return {
    type: types.USER_LOADED_SUCCESS, user: extractUserProperties(user)
  };
}

export function userIsAdminSuccess() {
  return {
    type: types.USER_IS_ADMIN_SUCCESS
  };
}