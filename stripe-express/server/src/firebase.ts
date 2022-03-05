import * as firebaseAdmin from "firebase-admin";

firebaseAdmin.initializeApp();
//firebaseAdmin.initializeApp will initialize and look for service account key in env

export const db = firebaseAdmin.firestore();
export const auth = firebaseAdmin.auth();

// export const db = firebaseAdmin.firestore();
// export const authAdmin = firebaseAdmin;
