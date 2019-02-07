// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCGiNI4d8v6Q2drVHnTfL3DtQO7_JvS60c',
    authDomain: 'gameofthrones-game.firebaseapp.com',
    databaseURL: 'https://gameofthrones-game.firebaseio.com',
    projectId: 'gameofthrones-game',
    storageBucket: 'gameofthrones-game.appspot.com',
    messagingSenderId: '803138401882'
  },
  paypalKeys: {
    sandbox: 'AT32PQy3r3aSrUqOtG8bHMnysyz8NSSWCdG_Bfe9KCUYaueJ1Fp6TqTYG76XcBIkVcHlnK3eKT4rIMrF',
    live: ''
  },
  stripeKeys: {
    testKey: 'pk_test_eEl9tF8iGZ5Dq1QdKGkisPl0',
    publishableKey: ''
  },
  api: 'https://gameofthronesgameapi.herokuapp.com'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
