import { useState } from 'react';
import { GeoFirestore } from 'geofirestore';
import firebase from 'firebase/compat/app';
import Resizer from 'react-image-file-resizer';
import  {
	getGeocode,
	getLatLng,
	getZipCode,
} from "use-places-autocomplete";
import q from 'q';
import toast from 'react-hot-toast';
import { FieldValue, firestore, storage } from './firebase';
import {getImageDimensions} from '../utils/utilities'

const useCreateBusinessForm = () => {
	const [input, setInputs] = useState({
		name: '',
		description: '',
		coordinates: [],
		photo: {},
		category: '',
		address: '',
		twitter: '',
		facebook: '',
		instagram: '',
		hours: '',
		email:'',
		website: '',
		location: {},
		city: '',
		state: '',
		zipCode: '',
		country: '',
		phoneNumber: '',
		image1: null,
		featurePhoto1: null,
		featurePhoto2: null,
		featurePhoto3: null,
		place_id: '',
		openTwentyFourHours: false,
		openingTime: null,
		closingTime: null,
		Monday: null,
		Tuesday: null,
		Wednesday: null,
		Thursday: null,
		Friday: null,
		Saturday: null,
		Sunday: null,
	});
	const [ progress, setProgress ] = useState(null);

	const userRef = (uid) => firestore.doc(`users/${uid}`)

	const handle_submit = (user) => {
		const geofirestore = new GeoFirestore(firestore);
		const geocollection = geofirestore.collection('businesses');
		
		const { uid, displayName, photoURL } = user || {};

		const business = {
			name: input.name,
			badges:[],
			cover_photo: input.image1,
			category: input.category.toLowerCase(),
			city: input.city,
			hours: input.hours,
			coordinates: new firebase.firestore.GeoPoint(input.coordinates.lat, input.coordinates.lng),
			approved: false,
			opening_time: input.openingTime,
			closing_time: input.closingTime,
			openTwentyFourHours: input.openTwentyFourHours,
			place_id: input.place_id,
			daysOpen: [
				{ day: 'Monday', status: input.Monday || null},
				{ day: 'Tuesday', status: input.Tuesday || null},
				{ day: 'Wednesday', status: input.Wednesday || null},
				{ day: 'Thursday', status: input.Thursday || null},
				{ day: 'Friday', status: input.Friday || null},
				{ day: 'Saturday', status: input.Saturday || null},
				{ day: 'Sunday', status: input.Sunday || null}
			],
			user: {
				uid,
				displayName,
				photoURL,
			},
		}

		const addDetails_toBusiness = async (businessId, businessDetails) => {
			firestore
				.collection('businesses')
				.doc(businessId)
				.collection('additional')
				.doc('details')
				.set(businessDetails);
		}
	
		const addBusiness_toUser = (businessId, userId) => {
			userRef(userId).update({
				userBusinesses: FieldValue.arrayUnion(businessId),
			})
			return businessId;
		}

		const businessDetails = {
			name: input.name,
			badges:[],
			cover_photo: input.image1,
			category: input.category.toLowerCase(),
			place_id: input.place_id,
			opening_time: input.openingTime,
			closing_time: input.closingTime,
			openTwentyFourHours: input.openTwentyFourHours,
			daysOpen: [
				{ day: 'Monday', status: input.Monday || null},
				{ day: 'Tuesday', status: input.Tuesday || null},
				{ day: 'Wednesday', status: input.Wednesday || null},
				{ day: 'Thursday', status: input.Thursday || null},
				{ day: 'Friday', status: input.Friday || null},
				{ day: 'Saturday', status: input.Saturday || null},
				{ day: 'Sunday', status: input.Sunday || null}
			],
			coordinates: new firebase.firestore.GeoPoint(input.coordinates.lat, input.coordinates.lng),
			approved: false,
			description: input.description,
			address: input.address,
			city: input.city,
			state: input.state,
			email: input.email,
			phone_number: input.phoneNumber,
			featurePhoto1: {
				url: input.featurePhoto1.url || null,
				height: input.featurePhoto1.height || null,
				width: input.featurePhoto1.width || null
			},
			featurePhoto2: {
				url: input.featurePhoto2.url || null,
				height: input.featurePhoto2.height || null,
				width: input.featurePhoto2.width || null
			},
			featurePhoto3: {
				url: input.featurePhoto3.url || null,
				height: input.featurePhoto3.height || null,
				width: input.featurePhoto3.width || null
			},
			location: input.location,
			likes: [],
			upvotes: [],
			downvotes: [],
			social_media: [{
				type: 'twitter',
				url: input.twitter || null
			},
			{
				type: 'facebook',
				url: input.facebook || null
			},
			{
				type: 'instagram',
				url: input.instagram || null
			}],
			website: input.website || null,
			zip_code: input.zipCode,
			user: {
				uid,
				displayName,
				photoURL,
			},
		}

		geocollection.add(business)
			.then(response => addBusiness_toUser(response.id, uid))
			.then(response => addDetails_toBusiness(response, businessDetails))
			.catch((error)=> {
				console.error(error);
			})
			.finally(() => {
				// props.history.push('/home');
			})
	}

	const getLatLngCoordinates = (description) => {
		const _deferred = q.defer();
		const errMsg = 'Fail to retrieve coordinates'
		getGeocode({ address: description })
			.then((results) => getLatLng(results[0]))
			.then(({ lat, lng }) => {
				setInputs(value => ({...value, coordinates: {lat, lng} }))
				_deferred.resolve();
			})
			.catch((error) => {
				console.log("😱 Error: ", error);
				_deferred.reject(Object.assign(errMsg, error));
			});

		return _deferred.promise;
	}

	const getZipCodeForBusiness = (description) => {
		const _deferred = q.defer();
		const errMsg = {display: 'Failed to retrieve zip code'};

		getGeocode({ address: description })
			.then((results) => getZipCode(results[0], false))
			.then((zipCode) => {
				console.log("ZIP Code: ", zipCode);
				setInputs(value => ({...value, zipCode }))
				_deferred.resolve();
			})
			.catch((error) => {
				console.log("Error: ", error);
				_deferred.reject(Object.assign(errMsg, error));
			});
		
		return _deferred.promise
	}

	function handle_rejectedPromise(res) {
		console.error(res);
		const _msg = res?.display ? res.display : null;
		toast.error(_msg);
	}

	const handleSelect = ({ description, place_id }) => {
		const splitAddress = description.split(', ');
		const [ address, city, state, country ] = splitAddress;
		console.log('ran');
		setInputs(value => ({...value, address,
			city,
			state,
			country,
			place_id
		}));

		getLatLngCoordinates(description)
			.then(getZipCodeForBusiness(description))
			.catch(handle_rejectedPromise)

		// When user selects a place, we can replace the keyword without request data from API
		// by setting the second parameter to "false"
		console.log(description, place_id);  
		// Get latitude and longitude via utility functions

	};
	const normalizeInput = (value, previousValue) => {
		// return nothing if no value
		if (!value) return value; 
		// only allows 0-9 inputs
		const currentValue = value.replace(/[^\d]/g, '');
		const cvLength = currentValue.length; 

		if (!previousValue || value.length > previousValue.length) {

			// returns: "x", "xx", "xxx"
			if (cvLength < 4) return currentValue; 
		
			// returns: "(xxx)", "(xxx) x", "(xxx) xx", "(xxx) xxx",
			if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`; 
		
			// returns: "(xxx) xxx-", (xxx) xxx-x", "(xxx) xxx-xx", "(xxx) xxx-xxx", "(xxx) xxx-xxxx"
			return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`; 
		}
	};

	const handle_inputChange = (event) => {
		if(event.target.name === 'phoneNumber'){
			const formatNumber = normalizeInput(event.target.value, input.phoneNumber)
			setInputs(value => ({...value, phoneNumber: formatNumber}));
			return;
		}
		if (event.target.name === 'dayofweek') {
			setInputs(value => ({...value, [event.target.value]: event.target.isChecked}));
			return;
		}

		setInputs(value => ({...value, [event.target.name]: event.target.value}));
	}

	const handle_upload = (photo, fileName, targetName, imageDimensions) => {
		const uploadTask = storage.ref(`images/${fileName}`).put(photo);
		uploadTask.on(
			"state_changed",
			snapshot => {
				const progression = Math.round(
					( snapshot.bytesTransferred / snapshot.totalBytes) * 100
				)
				console.log(snapshot);
				setProgress(progression)
			},
			error => {
				console.log(error);
			},
			() => {
				storage
					.ref("images")
					.child(fileName)
					.getDownloadURL()
					.then(url => {
						setInputs(value => ({...value, [targetName]: {url, height: imageDimensions.height, width: imageDimensions.width}}));
					})
			}
		)
	}

	const handle_uploadChange = async (event) => {
		event.preventDefault()
		const fileName = event.target.files[0].name;
		const targetName = event.target.name;	
		let imageDimensions = {};
		if (event.target.files[0]) {
			imageDimensions = await getImageDimensions(event.target.files[0]);
			try {
				Resizer.imageFileResizer(
					event.target.files[0],
					300,
					300,
					'JPEG',
					100,
					0,
					async (uri) => {
						handle_upload(uri, fileName, targetName, imageDimensions)
					},
					'blob',
					200,
					200,
				);
			} catch(err) {
				console.log(err)
			}
		}
	}

	return {
		handle_submit,
		handle_inputChange,
		input,
		handleSelect,
		handle_uploadChange,
		progress,
	};
}
export default useCreateBusinessForm;