import axios from 'axios';
import q from 'q';
import { useEffect, useState } from 'react';
import { auth, createUserProfileDocument, storage, firestore, FieldValue } from './firebase';
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
	const [ inviteeEmail, setInviteeEmail ] = useState('');
	const [inviteCode, setInviteCode] = useState('');

	useEffect(() => {
		let unsubscribe;

		auth.onAuthStateChanged( async userAuth => {
			if (userAuth) {
				const userRef = await createUserProfileDocument(userAuth)
				unsubscribe = userRef.onSnapshot( async snapshot => {
					userAuth.getIdTokenResult(true)
						.then(response =>{ 
							console.log(response?.claims);
							setUser({
								uid: snapshot.id,
								isOwner: response?.claims?.isOwner,
								isSubscribed: response?.claims?.stripeRole,
								subscription: response?.claims?.stripeRole ? response?.claims?.stripeRole: null,
								...snapshot.data()
							});
						});
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
				// eslint-disable-next-line no-console
				console.log(snapshot);
			},
			error => {
				// eslint-disable-next-line no-console
				console.error(error);
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

	const handleChange = (event) => {
		setUser(val => ({...val, [event.target.name]: event.target.value}));
	}

	const getInvitation = () => {
		const _deferred = q.defer();
		const errMsg = {display: 'Invited email already exists'}

		axios.get(`api/invite/${inviteeEmail}`)
			.then(response => {
				if(response.data) _deferred.reject({display: 'User already invited'});
				if(!response.data)_deferred.resolve();
			})
			.catch(err => _deferred.reject({ ...err, ...errMsg}));

		return _deferred.promise;
	}

	const addInvitation = () => {
		const _deferred = q.defer();
		const errMsg = {display: 'Fail to create invitation'}

		axios.post(`api/invite/owner`, {
			sender_id: user.uid,
			sender_email: user.email,
			invitee_email: inviteeEmail
		})
			.then(response => {
				_deferred.resolve(response.data.unique_id)
			})
			.catch(err => _deferred.reject({ ...err, ...errMsg}));

		return _deferred.promise;
	}

	const sendEmail = (response) => {
		const _deferred = q.defer();
		const errMsg = {display: 'Failed to send email'};
		const unique_id = response;
		firestore
			.collection("mail")
			.add({
				to: inviteeEmail,
				message: {
					subject: "You've been Invited to HomeTeam Business",
					html:	`<p>Your invitation code is: <strong>${unique_id}</strong>` +
							"<br><br>If you haven't already please <a href='https://www.thehometeam.io/login'>create an account</a> with this email to accept invite" +
							"<br><br>If you already have an account head over to your <a href='https://www.thehometeam.io/user'>My Profile</a> to accept your invite." +
							"<br><br>You will need the code above to accept this invite." +
							"<br><br>V/R" +
							"<br>Juan X</p>",
				},
			})
			.then(() => {
				_deferred.resolve('Success Email Sent');
			})
			.catch(err => _deferred.reject({ ...err, ...errMsg}));
	}

	const handle_addInvitation__sendEmail = (unique_id) => sendEmail(unique_id)

	const updateUserInviteList = () => {
		const _deferred = q.defer();
		const errMsg = {display: 'Failed to update user invite list'};

		const updateUserRef = firestore.doc(`users/${user.uid}`);
		updateUserRef.update({
			invites: FieldValue.arrayUnion({
				email: inviteeEmail,
				accepted: false,
			}),
		})
			.then(() => {
				_deferred.resolve()
			})
			.catch(err => {
				_deferred.reject({ ...err, ...errMsg})
			})
		return _deferred.promise;
	}

	const submitInvite = async () => {
		const _deferred = q.defer();
		const errMsg = {display: 'Fail to submit invite'}

		getInvitation()
			.then(addInvitation)
			.then(handle_addInvitation__sendEmail)
			.then(updateUserInviteList)
			.catch( error => {
				_deferred.reject(Object.assign(errMsg, error));
			})	
		return _deferred.promise;

	}

	const updateInviteStatus = (_invitationCode) => {
		const _deferred = q.defer();
		const errMsg = {display: 'Fail to submit invite'}

		axios.post(`api/invite/accept/${_invitationCode}`)
			.then(response => {
				_deferred.resolve(response.data)
			})
			.catch((err) => {
				_deferred.reject({ ...err, ...errMsg})
			});
		return _deferred.promise;
	}

	const postCreateBusinessOwner = (email) => {
		const _deferred = q.defer();
		const errMsg = {display: 'Fail to Create Business owner'};

		axios.post(`https://us-central1-hometeam-891a3.cloudfunctions.net/addBusinessOwnerRole`, {
			data: {email},
		})
			.then(response => {
				if(response.data?.result?.errorInfo){
					return _deferred.reject(errMsg)
				}
				_deferred.resolve()
			})
			.catch((err) => {
				_deferred.reject({ ...err, ...errMsg})
			})
		return _deferred.promise
	}

	const createBusinessOwner = (email, invite) => {
		const _deferred = q.defer();
		const errMsg = {display: 'Fail to Create Business owner'};
		postCreateBusinessOwner(email)
			.then(updateInviteStatus(invite.unique_id))
			.catch((err) => {			
				// eslint-disable-next-line no-console
				console.error(err)
				_deferred.reject({ ...err, ...errMsg})
			});
		return _deferred.promise;
	}

	const getInvitateStatus = (_invitationCode) => {
		const _deferred = q.defer();
		const errMsg = {display: 'Fail to get invite status'};
		
		axios.get(`api/invite/accept/${_invitationCode}`)
			.then(response => {
				_deferred.resolve(response.data)
			})
			.catch((err) => {
				_deferred.reject({ ...err, ...errMsg})
			})
		return _deferred.promise
	}

	const handle_getInvitationStatus___createBusinessOwner = (response) => {
		if(!response.accepted) {
			if(response.invitee_email === user.email) {
				return createBusinessOwner(user.email, response)
			}
		}
		return q.when(false);
	}
	
	const acceptInvite = async (invitationCode) => {
		const _deferred = q.defer();
		const errMsg = {display: 'Failed to accept invite'};

		getInvitateStatus(invitationCode)
			.then(handle_getInvitationStatus___createBusinessOwner)
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.error(err);
				_deferred.reject({ ...err, ...errMsg})
			})
		return _deferred.promise;
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
		signUp,
		signIn,
		setUserEmail,
		setUserPassword,
		userEmail,
		userPassword,
		setInviteeEmail,
		inviteeEmail,
		submitInvite,
		createBusinessOwner,
		inviteCode,
		setInviteCode,
		acceptInvite,
	};
}

export default useUserData;
