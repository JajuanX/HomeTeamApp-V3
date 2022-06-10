import { useEffect, useState } from 'react';
import { 
	getBusinesses,
	getBusiness,
	getMoreBusinesses,
	getFilteredBusinesses,
	FieldValue
} from './firebase.js';
import { collectIdsandDocs } from '../utils/utilities.js';

export function useBusinessHooks() {
	const [ isLoading, setIsLoading ] = useState(false);
	const [ business, setBusiness ] = useState([]);
	const [ businesses, setBusinesses ] = useState([]);
	const [ currentPage, setCurrentPage ] = useState(1);
	const [ FilteredBusinesses, setFilteredBusinesses ] = useState([]);
	const [ CategorySelected, setCategorySelected ] = useState(false);
	const [ Category, setCategory ] = useState('');

	useEffect(() => {
		let unsubscribe;

		fetch('api/businesses', {method: 'GET'})
			.then(response => response.json())
			.then(async response => {
				console.log(await response);
				const businesses = await response;
				setBusinesses(businesses);
				setIsLoading(false);
			}).catch( err => {
				console.log(err);
			})

		return unsubscribe;
	}, [])

	const getSelectedBusiness = (businessId) => {
		console.log('getBusiness', businessId);
		setIsLoading(true);
		fetch(`api/business/${businessId}`)
			.then(response => response.json())
			.then(async response => {
				console.log(await response);
				const businesses = await response;
				setBusiness(businesses);
				setIsLoading(false);
			}).catch( err => {
				console.log(err);
			})

	}
	
	const searchForCategory = async (event) =>  {
		event.preventDefault();
		const category = event.target.value;

		getFilteredBusinesses(category)
			.then((res) => {
				let results = res.docs.map(collectIdsandDocs);
				if(results) {
					setFilteredBusinesses(results);
					setCategorySelected(true);
					setCategory(category);
				}
			})
	}

	const paginateBusinesses = () => {
		setIsLoading(true);
		getMoreBusinesses(businesses[businesses.length - 1])
			.onSnapshot( snapshot => {
				const results = snapshot.docs.map(collectIdsandDocs);
				if (results.length === 0) return;
				setBusinesses([...businesses, ...results]);
				setCurrentPage(currentPage + 1)
				setIsLoading(false);

			}, (error) => {
				error.log(error);
				setCurrentPage(currentPage)
				setIsLoading(false);
			})
	}

	const handle_submit_comment = (event) => {
		event.preventDefault();
		const userComment = {
		  comment ,
		  reviewType,
		  user: {
			uid: user.uid,
			displayName: user.displayName,
			email: user.email,
			photoURL: user.photoURL,
		  },
		}
		businessRef().update({
			comment: FieldValue.arrayUnion(userComment),
			timestamp: FieldValue.serverTimestamp(),
		})			
		.then(()=> {
			console.log('Successful comment');
		})
	}

	return {
			isLoading,
			getSelectedBusiness,
			business,
			businesses,
			paginateBusinesses,
			searchForCategory,
			FilteredBusinesses,
			CategorySelected,
			Category,
	}
}