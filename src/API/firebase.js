/* eslint-disable no-plusplus */
import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyC_Iuv6ETGSKtDzgr3Keyx0ySyifx31GIs',
  authDomain: 'medical-management-web-app.firebaseapp.com',
  projectId: 'medical-management-web-app',
  storageBucket: 'medical-management-web-app.appspot.com',
  messagingSenderId: '1053146750088',
  appId: '1:1053146750088:web:a78cfb38c1888097f3133d',
};

// Initialize Firebase
firebase.initializeApp(config);

export const db = firebase.firestore();

export default firebase;
