import firebaseApi from '../api/firebase';
import * as types from './actionTypes';

import { authLoggedIn } from './authActions';
import {ajaxCallError, beginAjaxCall} from './ajaxStatusActions';
import {User} from "firebase";

function extractUserProperties(firebaseUser: User) {

  const user: any = {};
  const userProperties: string[] = [
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
    if (firebaseUser.hasOwnProperty(prop)) {
      user[prop] = (firebaseUser as any)[prop];
    }
  });

  return user;
}

export function userCreated(user: User) {
  return (dispatch: any) => {
    firebaseApi.databaseSet('/users/' + user.uid, extractUserProperties(user))
      .then(
        () => {
          dispatch(authLoggedIn(user.uid));
          dispatch(userCreatedSuccess());
        })
      .catch(
        error => {
          dispatch(ajaxCallError());
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

export function userLoadedSuccess(user: User) {
  return {
    type: types.USER_LOADED_SUCCESS, user: extractUserProperties(user)
  };
}

export function userIsAdminSuccess() {
  return {
    type: types.USER_IS_ADMIN_SUCCESS
  };
}
