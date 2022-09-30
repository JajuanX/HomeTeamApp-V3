import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import { GeoFirestore } from 'geofirestore';

const config = {
	apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_APIKEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
	databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASEURL,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID
} 

if (!firebase.apps.length) {
	firebase.initializeApp(config);
}


export const firestore = firebase.firestore();
export const Firebase = firebase;
export const auth = firebase.auth();
export const storage = firebase.storage();
export const {FieldValue} = firebase.firestore;
export const provider = new firebase.auth.GoogleAuthProvider();
export const providerFacebook = new firebase.auth.FacebookAuthProvider();


export const signInWithGoogle = () => auth.signInWithPopup(provider);
export const signInWithFacebook = () => auth.signInWithPopup(providerFacebook);

export const signOut = () => auth.signOut();

export const getUserDocument = async (uid) => {
	if (!uid) return null;
	try {
		return firestore.collection('users').doc(uid);
		
	} catch (error) { 
		console.error('Error fetching user', error.message);

	}
} 

export const createUserProfileDocument = async (user, additionalInfo) => {
	if (!user) return

	const { displayName, email, photoURL} = user; 	
	const userRef = firestore.doc( `users/${user.uid}`)
	const snapshot = await userRef.get()

	if (!snapshot.exists) {
		const createdAt = new Date();
		const favorites = [];
		const invites = [];
		const userBusinesses = {};
		try {
			await userRef.set({
				displayName,
				email,
				photoURL,
				createdAt,
				favorites,
				invites,
				userBusinesses,
				...additionalInfo
			}).then(() => {
				firestore
					.collection("mail")
					.add({
						to: email,
						message: {
							subject: "Welcome to the Hometeam! (Beta)",
							html: "<h1>Thank you for signing up to the HomeTeam Beta program!</h1>" +
					"<p>A message from our founder/creator, Juan X." +
					`<br><br>Good Evening, ${displayName}!` +
					"<br><br>Let me extend a warm welcome to HomeTeam, and thank you for signing up to be apart of our Beta Program." +
					"<br><br>Here at Driven, we created HomeTeam app that provides an opportunity for Black and minority business owners to have a way to be discovered by local users without the barriers and extensive competitors that comes from other search engines such as: Yelp, Google, etc. " +
					"<br><br>The objective for this beta program is to receive feedback from a small sample of local  business owners that we trust." +
					"<br><br>Your feedback is imperative because  Hometeam constantly strives to improve the quality of our products and services to give an awesome experience to our consumers." +
					"<br><br>Follow this link to the <a href='https://forms.gle/bPT7JJ9kv3J6dgbe6'>survey</a> and let us know if this app actually benefits you, and how can we improve further. The survey is 2 minutes or less. The deadline to complete the survey is July 9th, 2021 at 11:59pm." +
					"<br><br>Thank you in advance for your valuable insights." +
					"<br><br>V/R" +
					"<br>Juan X</p>",
						},
					})
					.then(() => console.log("Queued email for delivery!"));
			})
		}

		catch (error) {
			console.error('Error creating user', error);
			
		}
	}
	
	return getUserDocument(user.uid)
}

export const getBusinesses = () => {
	const pageSize = 8;
	const field = 'name';

	return firestore.collection("businesses")
		.orderBy(field)
		.limit(pageSize); 
}

export const getFilteredBusinesses = (category) => firestore.collection('businesses')
	.where('category', '==', `${category}`)
	.get()

export const getMoreBusinesses = (lastBusiness) => {
	const pageSize = 8;
	const field = 'name';
	const last = lastBusiness || [];

	return firestore.collection('businesses')
		.orderBy(field)
		.startAfter(last)
		.limit(pageSize)
}

export const deleteUserBusiness = async (user) => {
	if (!user) return null;
	const userRef = await firestore
		.collection('users')
		.doc(user.uid);
	const businessRef = await firestore
		.collection('businesses')
		.doc(user.userBusinesses[0]);

	const deleteUserAssignedBusinesses = () => userRef.update({
		userBusinesses: [],
	})
	const deleteBusiness = () => businessRef.delete()
	Promise.all([deleteUserAssignedBusinesses(), deleteBusiness()])
		.then((docs) => console.log(docs, 'successfully deleted business from user and database'))
		.catch((err) => console.log(err, 'delete failed'));
}

export const isUserSubscribed = () => {
	const isSubscribed = auth.currentUser.getIdTokenResult()
		.then((idTokenResult) => {
			console.log(idTokenResult);
			// Confirm the user is an Admin.
			if (idTokenResult.claims.stripeRole) {
				// Show admin UI.
				return true;
			} 
			// Show regular user UI.
			console.log('no token', idTokenResult.claims.stripeRole);
			return false;
			
		})
		.catch((error) => {
			console.log(error);
		});	
	return isSubscribed;
}

export const getUserFavorites = (uid) => {
	if (!uid) return null;
	return firestore.doc(`users/${uid}`)
}

// Create a GeoCollection reference
export const geofirestore = new GeoFirestore(firestore);

export default firebase;
