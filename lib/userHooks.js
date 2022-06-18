import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { auth, createUserProfileDocument, storage, firestore } from './firebase';
// Custom hook to read auth record and user profile doc
function useUserData() {
	const [ user, setUser ] = useState({
		photoURL: '',
	});
	// const [ isLoading, setIsLoading ] = useState(false);
	// const [ userFavoriteBusinesses, setUserFavoriteBusinesses] = useState([])
	const [ userHasBusinesses, setUserHasBusinesses ] = useState(false);
	const [ userBusiness, setUserBusiness ] = useState([]);
	const [ userEmail, setUserEmail ] = useState('');
	const [ userPassword, setUserPassword ] = useState('');

	useEffect(() => {
		let unsubscribe;

		auth.onAuthStateChanged( async userAuth => {
			if (userAuth) {
				const userRef = await createUserProfileDocument(userAuth)
				unsubscribe = userRef.onSnapshot( async snapshot => {
					setUser({uid: snapshot.id, ...snapshot.data()});
				})
			} else {
				setUser(null);
			}
		})

		return unsubscribe;
	}, [])

	const handle_userHasBusiness = () => {
		if (user.userBusinesses.length > 0) {
			setUserHasBusinesses(true);
			setUserBusiness(user.userBusinesses);
		}
	}


	const handleUpload = (photo) => {
		const uploadTask = storage.ref(`images/${photo}`).put(photo);
		uploadTask.on(
			"state_changed",
			snapshot => {
				// const progress = Math.round(
				// 	( snapshot.bytesTransferred / snapshot.totalBytes) * 100
				// )
				console.log(snapshot);
			},
			error => {
				console.log(error);
			},
			() => {
				storage
					.ref("images")
					.child(photo)
					.getDownloadURL()
					.then(url => {
						setUser(val => ({...val, photoURL: url}));
					})
			}
		)
	}

	const uid = () => auth.currentUser.uid

	const handleSubmit = event => {
		event.preventDefault()
		const userRef = firestore.collection('users').doc(uid())
		userRef.update({displayName: user.displayName, email: user.email, photoURL: user.photoURL})
			.then(() => {
				toast.success('Successful Login');
			})
	}

	const handleChange = (event) => {
		setUser(val => ({...val, [event.target.name]: event.target.value}));
	}

	const handleUploadChange = async (event) => {
		event.preventDefault()
		if (event.target.files[0]){
			handleUpload(event.target.files[0]);
		}
	}

	const signUp = () => {
		auth.createUserWithEmailAndPassword(userEmail, userPassword).then(userResponse => {
			createUserProfileDocument(user, {})
				.then(() => setUser({ userResponse }))
		})
	}
	const signIn = () => {
		auth.signInWithEmailAndPassword(userEmail, userPassword).then(userResponse => {
			createUserProfileDocument( user, {})
				.then(() => setUser({ userResponse }))
		})
	}
	
	return { 
		user,
		userHasBusinesses,
		handle_userHasBusiness,
		userBusiness,
		handleUpload,
		handleUploadChange,
		handleChange,
		handleSubmit,
		signUp,
		signIn,
		setUserEmail,
		setUserPassword,
		userEmail,
		userPassword,
	};
}

export default useUserData;

// const getUserFavorites = () => {
// 	const userFavorites = user?.favorites?.map( favorite => {
// 		return firestore.doc(`businesses/${favorite}`).get();
// 	});

// 	Promise.all(userFavorites)
// 		.then(docs => {
// 			let businesses = docs.map(doc =>{
// 				return {
// 					id: doc.id,
// 					...doc.data()
// 					}
// 			});
// 			businesses = businesses.filter(business => {
// 				if (business['coverPhoto']) return business;
// 			})
// 			console.log(businesses);
// 			setUserFavoriteBusinesses(businesses)
				
// 		})
// 		.catch((error) => {
// 			console.log(error);
// 		})
		
// }
// const handle_getUserBusiness = () => {
// 	getUserBusiness(user)
// 		.onSnapshot( async snapshot => {
// 			const selectedBusiness = await collectIdsandDocs(snapshot);
// 			console.log(selectedBusiness);
// 			if (selectedBusiness.empty) {
// 				console.log('No matching documents.');
			
// 			} else {
// 				setUserBusiness({
// 					name: selectedBusiness.name,
// 					description: selectedBusiness.description,
// 					coordinates: selectedBusiness.coordinates,
// 					photo: selectedBusiness.photo,
// 					category: selectedBusiness.category,
// 					address: selectedBusiness.address,
// 					twitter: selectedBusiness.socialMedia?.twitter || '',
// 					facebook: selectedBusiness.socialMedia?.facebook || '',
// 					instagram: selectedBusiness.socialMedia?.instagram || '',
// 					hours: selectedBusiness.hours,
// 					email: selectedBusiness.email,
// 					website: selectedBusiness.socialMedia?.website || '',
// 					location: selectedBusiness.location,
// 					phoneNumber: selectedBusiness.phoneNumber,
// 					coverPhoto: selectedBusiness.coverPhoto,
// 					featurePhoto1: selectedBusiness.featurePhoto1,
// 					featurePhoto2: selectedBusiness.featurePhoto2,
// 					featurePhoto3: selectedBusiness.featurePhoto3,
// 					zipCode: selectedBusiness.zipCode,
// 				});
// 			}
// 		},
// 		(error) => {
// 			error.log(error);
// 		}); 
// }

// const handle_addToFavorites = (businessId, isFavorite) => {
// 	if (isFavorite === 'favorite') {
// 		getUserFavorites(user.uid)
// 			.update({
// 				favorites: FieldValue.arrayUnion(businessId),
// 			})
// 			.then(()=> {
// 				console.log('User likes this business');
// 			})
// 			.catch((error)=> {
// 				console.error(error);
// 			});
// 	} else {
// 		firestore.doc(`users/${user.uid}`)
// 			.update({
// 				favorites: FieldValue.arrayRemove(businessId)
// 			})
// 			.then(()=> {
// 				console.log('User dislikes this business');
// 			})
// 			.catch((error)=> {
// 				console.error(error);
// 			});
// 	}
// }