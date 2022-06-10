import { useState } from 'react';
import {useSWRConfig} from 'swr';
import Resizer from 'react-image-file-resizer';
import { useRouter } from 'next/router';
import  {
	getGeocode,
	getLatLng,
	getZipCode,
} from "use-places-autocomplete";
import q from 'q';
import toast from 'react-hot-toast';
import { firestore, storage } from './firebase';
import {getImageDimensions} from '../utils/utilities'

const useEditBusinessForm = () => {
	const [ progress, setProgress ] = useState(null);
	const router = useRouter();
	const [business, setBusiness] = useState({
		name: '',
		address:  '',
		description:  '',
		coordinates:  null,
		cover_photo:  '',
		category:  '',
		email: '',
		city:  '',
		state:  '',
		zipCode:  '',
		phoneNumber:  '',
		place_id:  '',
		openTwentyFourHours: false,
		openingTime: '',
		closingTime: '',
		twitter: '',
		facebook: '',
		instagram: '',
		website: '',
		featurePhoto1: '',
		featurePhoto2: '',
		featurePhoto3: '',
		Monday: false,
		Tuesday: false,
		Wednesday: false,
		Thursday: false,
		Friday: false,
		Saturday: false,
		Sunday: false,
	});	
	const { mutate } = useSWRConfig()

	const getSocialUrl = (array, value) => {
		const result = array.find(item => item.type === value)
		return result.url;
	}
	const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1)

	const getDayOpen = (array, day) => {
		const result = array.find(item => item.day === day);
		return result.status;
	}

	const handle_getBusiness = (response) => {
		const businessInfo = response.data;
		const shapeBusinessData = {
			name: businessInfo.name || '',
			address: businessInfo.address || '',
			description: businessInfo.description || '',
			coordinates: businessInfo.coordinate || null,
			cover_photo: businessInfo.cover_photo || '',
			category: capitalizeFirstLetter(businessInfo.category) || '',
			email:businessInfo.email || '',
			city: businessInfo.city || '',
			state: businessInfo.state || '',
			zipCode: businessInfo.zip_code || '',
			phoneNumber: businessInfo.phone_number || '',
			place_id: businessInfo.place_id || '',
			openTwentyFourHours: businessInfo.openTwentyFourHours,
			openingTime: businessInfo.opening_time || '',
			closingTime: businessInfo.closing_time || '',
			twitter: getSocialUrl(businessInfo.social_media, 'twitter') || '',
			facebook: getSocialUrl(businessInfo.social_media, 'facebook') || '',
			instagram: getSocialUrl(businessInfo.social_media, 'instagram') || '',
			website: businessInfo.website || '',
			featurePhoto1: businessInfo.featurePhoto1 || '',
			featurePhoto2: businessInfo.featurePhoto2 || '',
			featurePhoto3: businessInfo.featurePhoto3 || '',
			feature_photos: businessInfo.feature_photos,
			Monday: getDayOpen(businessInfo.daysOpen, 'Monday') || false,
			Tuesday: getDayOpen(businessInfo.daysOpen, 'Tuesday') || false,
			Wednesday: getDayOpen(businessInfo.daysOpen, 'Wednesday') || false,
			Thursday: getDayOpen(businessInfo.daysOpen, 'Thursday') || false,
			Friday: getDayOpen(businessInfo.daysOpen, 'Friday') || false,
			Saturday: getDayOpen(businessInfo.daysOpen, 'Saturday') || false,
			Sunday: getDayOpen(businessInfo.daysOpen, 'Sunday') || false,
		}
		setBusiness(shapeBusinessData)
	}


	const handle_submit = (user, businessId) => {
		const { uid, displayName, photoURL } = user || {};
		const updateBusinessRef = firestore.collection('businesses').doc(businessId);
		const updateBusinessDetailsRef = firestore.collection('businesses').doc(businessId).collection('additional').doc('details');

		updateBusinessRef.update({
			name: business.name,
			badges:[],
			category: business.category.toLowerCase(),
			city: business.city,
			approved: false,
			opening_time: business.openingTime,
			closing_time: business.closingTime,
			place_id: business.place_id,
			daysOpen: [
				{ day: 'Monday', status: business.Monday || null},
				{ day: 'Tuesday', status: business.Tuesday || null},
				{ day: 'Wednesday', status: business.Wednesday || null},
				{ day: 'Thursday', status: business.Thursday || null},
				{ day: 'Friday', status: business.Friday || null},
				{ day: 'Saturday', status: business.Saturday || null},
				{ day: 'Sunday', status: business.Sunday || null}
			],
			user: {
				uid,
				displayName,
				photoURL,
			},
		})
			.then(() => {
				updateBusinessDetailsRef.update({
					name: business.name,
					category: business.category.toLowerCase(),
					daysOpen: [
						{ day: 'Monday', status: business.Monday || null},
						{ day: 'Tuesday', status: business.Tuesday || null},
						{ day: 'Wednesday', status: business.Wednesday || null},
						{ day: 'Thursday', status: business.Thursday || null},
						{ day: 'Friday', status: business.Friday || null},
						{ day: 'Saturday', status: business.Saturday || null},
						{ day: 'Sunday', status: business.Sunday || null}
					],
					description: business.description,
					address: business.address,
					city: business.city,
					state: business.state,
					email: business.email,
					phone_number: business.phoneNumber,
					social_media: [{
						type: 'twitter',
						url: business.twitter || null
					},
					{
						type: 'facebook',
						url: business.facebook || null
					},
					{
						type: 'instagram',
						url: business.instagram || null
					}],
					website: business.website || null,
					zip_code: business.zipCode,
					user: {
						uid,
						displayName,
						photoURL,
					},
				})
			})
			.then(() => mutate(`/api/business/${businessId}`)
			)
			.catch((error)=> {
				console.error(error);
			})
			.finally(() => {
				router.push(`/business/${businessId}`)
			})
	}


	const normalizeInput = (inputValue, previousValue) => {
		// return nothing if no value
		if (!inputValue) return inputValue; 
		console.log(inputValue, previousValue);
		// only allows 0-9 inputs
		const currentValue = inputValue.replace(/[^\d]/g, '');
		const cvLength = currentValue.length; 

		if (!previousValue || inputValue.length > previousValue.length) {

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
			const formatNumber = normalizeInput(event.target.value, business.phoneNumber)
			setBusiness(val => ({...val, phoneNumber: formatNumber}));
			return;
		}

		if (event.target.name === 'dayOfWeek') {
			setBusiness(val => ({...val, [event.target.value]: event.target.checked}));
			return;
		}

		setBusiness(val => ({...val, [event.target.name]: event.target.value}));
	}
		
	const getLatLngCoordinates = (description) => {
		const _deferred = q.defer();
		const errMsg = 'Fail to retrieve coordinates'
		getGeocode({ address: description })
			.then((results) => getLatLng(results[0]))
			.then(({ lat, lng }) => {
				setBusiness(value => ({...value, coordinates: {lat, lng} }))
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
				setBusiness(value => ({...value, zipCode }))
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
		setBusiness(value => ({...value, address,
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

	const handle_upload = (photo, fileName, targetName, imageDimensions, businessId) => {
		console.log(businessId);
		const updateBusinessRef = firestore.collection('businesses').doc(businessId);
		const updateBusinessDetailsRef = firestore.collection('businesses').doc(businessId).collection('additional').doc('details');
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
						setBusiness(value => ({...value, [targetName]: {url, height: imageDimensions.height, width: imageDimensions.width}}));
						return url;
					})
					.then((url) => {
						updateBusinessRef.update({ [targetName] : {url, height: imageDimensions.height, width: imageDimensions.width}})
						updateBusinessDetailsRef.update({ [targetName] : {url, height: imageDimensions.height, width: imageDimensions.width}})
					})
			}
		)
	}

	const handle_uploadChange = async (event, id) => {
		console.log(id);
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
						handle_upload(uri, fileName, targetName, imageDimensions, id)
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
		handle_getBusiness,
		business,
		setBusiness,
		handleSelect,
		handle_uploadChange,
		progress,
	};
}
export default useEditBusinessForm;