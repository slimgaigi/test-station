import * as firebase from 'firebase';
import {firebaseConfig} from '../config';
import {string} from "prop-types";
import {once} from "cluster";
import {User} from "firebase";

export interface FirebaseUser extends User {
  email: string,
  password: string,
}

class FirebaseApi {
  static initAuth() {
    firebase.initializeApp(firebaseConfig);
    return new Promise((resolve, reject) => {
      const unsub = firebase.auth().onAuthStateChanged(
        user => {
          unsub();
          resolve(user);
        },
        error => reject(error)
      );
    });
  }

  static createUserWithEmailAndPassword(user: FirebaseUser): Promise<firebase.auth.UserCredential> {
    return firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
  }

  static signInWithEmailAndPassword(user: FirebaseUser) {
    return firebase.auth().signInWithEmailAndPassword(user.email, user.password);
  }

  static authSignOut() {
    return firebase.auth().signOut();
  }

  static databasePush(path: string, value: any) {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(path)
        .push(value, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
    });
  }

  static GetValueByKeyOnce(path: string, key: string | number | boolean) {
    return firebase
      .database()
      .ref(path)
      .orderByKey()
      .equalTo(key)
      .once('value');
  }

  static GetChildAddedByKeyOnce(path: string, key: string) {
    return firebase
      .database()
      .ref(path)
      .orderByKey()
      .equalTo(key)
      .once('child_added');
  }

  static databaseSet(path: string, value: any) {
    return firebase
      .database()
      .ref(path)
      .set(value);
  }
}

export default FirebaseApi;
