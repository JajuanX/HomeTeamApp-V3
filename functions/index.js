const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.addBusinessOwnerRole = functions.https.onCall((data) => admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => admin
        .auth().setCustomUserClaims(user.uid, {isOwner: true}))
    .then(() => ({message: `Success ${data.email} is now an admin`}))
    .catch((err) => err));
