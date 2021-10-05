// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import firebase from 'firebase';

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyCul-BEQ4x_pDBa0TTV7-o6TXEtRtwAUQM',
    authDomain: 'ionic-chat-c14b2.firebaseapp.com',
    projectId: 'ionic-chat-c14b2',
    storageBucket: 'ionic-chat-c14b2.appspot.com',
    messagingSenderId: '112289435790',
    appId: '1:112289435790:web:919db8d220f4522075f9df'
  }
};
firebase.initializeApp(environment.firebaseConfig);

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
