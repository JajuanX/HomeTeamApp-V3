import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import q from 'q';
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import styles from './map.module.scss';
import IndexLayout from '../../layouts/IndexLayout';
import LocationPin from '../../components/location-pin/LocationPin';
import BusinessCategory from '../../components/button-category/ButtonCategory';


export default function BusinessMap() {
	const [allBusinesses, setAllBusinesses] = useState([]);
	const [selectedCat, setSelectedCat] = useState('')

	const getAllBusinesses = () => {
		const _deferred = q.defer();
		const errMsg = 'Fail to retrieve category'

		axios
			.get(`api/businesses/category`)
			.then(response => {
				_deferred.resolve(response.data);
			}).catch( error => {
				_deferred.reject(Object.assign(errMsg, error));
			})
		return _deferred.promise;
	}

	useEffect(() => {
		getAllBusinesses()
			.then(response => {
				setAllBusinesses(response);
			}).catch( err => {
				// eslint-disable-next-line no-console
				console.log(err);
			})
	}, [])

	const categories = [ 'All', 'Restaurants', 'Beauty', 'Church', 'Education', 'Event Planning', 
		'Financial', 'Fitness', 'Graphic Design', 'Web Services', 'Videography', 'Photography',
		'Clothing', 'Printing Services', 'Car Wash', 'Real Estate', 'Coaching', 'Tattoo Artist',
		'Art', 'Barbershop', 'Mobile Repair' ].sort();

	const location = {
		address: '4821 sw 23rd st West Park, FL 33023',
		lat: 25.990009,
		lng: -80.1922577,
		mapId: 'fb4e91185440c360',
	}	

	const getCategory = (_selectedCat) => {
		const _deferred = q.defer();
		const errMsg = 'Fail to retrieve category'

		axios
			.post(`api/businesses/category/${_selectedCat.toLowerCase()}`)
			.then(response => {
				_deferred.resolve(response.data, _selectedCat);
			}).catch( error => {
				_deferred.reject(Object.assign(errMsg, error));
			})
		return _deferred.promise;
	}

	const handle_getCategory = (response) => {
		setAllBusinesses(response);
	}

	const getSelectedCategory = (_selectedCat) => {
		if (_selectedCat === 'All' || _selectedCat === selectedCat) {
			return getAllBusinesses().then((response) => {
				handle_getCategory(response)
				setSelectedCat('All')
			});
		}

		getCategory(_selectedCat)
			.then((response) => {
				if(response.length === 0){
					handle_getCategory([{}]);
					setSelectedCat(_selectedCat);
					toast.error(`No results for the ${_selectedCat} category `)
					return;
				}
				handle_getCategory(response);
				setSelectedCat(_selectedCat)
			})
			// eslint-disable-next-line no-console
			.catch( err => console.error(err))
	}

	return (
		<div className={styles.businessMap}>
			<Toaster position='top-middle' />
			<div style={{ height: '50vh', width: '100%' }}>
				{allBusinesses?.length > 0 && 
				<GoogleMapReact
					bootstrapURLKeys={{ 
						key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_APIKEY,
					}}
					options={{
						mapId: 'fb4e91185440c360',
					}}
					defaultCenter={location}
					defaultZoom={12}
					hoverDistance={40}
					yesIWantToUseGoogleMapApiInternals
				>
					{
						allBusinesses && allBusinesses.map( eachBusiness => (
							<LocationPin
								key={eachBusiness?.id}
								business={eachBusiness}
								lat={eachBusiness?.coordinates?.latitude}
								lng={eachBusiness?.coordinates?.longitude}
								icon={eachBusiness?.category}
							/>
						))
					}
				</GoogleMapReact>}
			</div> 
			<h1>Select Category to Filter</h1>
			<div className={styles.categoryContainer}>
				{
					categories.map((eachCategory) => (
						<BusinessCategory
							key={eachCategory}
							category={eachCategory}
							getSelectedCategory={getSelectedCategory}
							selectedCat={selectedCat}
						/>
					))
				}
			</div>
		</div>
	)
}

BusinessMap.PageLayout = IndexLayout;