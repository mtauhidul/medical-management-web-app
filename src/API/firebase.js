/* eslint-disable no-plusplus */
import firebase from 'firebase';

// const config = {
//   apiKey: 'AIzaSyC_Iuv6ETGSKtDzgr3Keyx0ySyifx31GIs',
//   authDomain: 'medical-management-web-app.firebaseapp.com',
//   projectId: 'medical-management-web-app',
//   storageBucket: 'medical-management-web-app.appspot.com',
//   messagingSenderId: '1053146750088',
//   appId: '1:1053146750088:web:a78cfb38c1888097f3133d',
// };

const config = {
  apiKey: 'AIzaSyBl97nSjDHiO8whiSWRIZg2Taca4iaLddA',
  authDomain: 'caresync-48c9c.firebaseapp.com',
  projectId: 'caresync-48c9c',
  storageBucket: 'caresync-48c9c.appspot.com',
  messagingSenderId: '273061678462',
  appId: '1:273061678462:web:8d732e4b2bfa1da5d1772f',
};

// Initialize Firebase
firebase.initializeApp(config);

export const db = firebase.firestore();

export default firebase;
