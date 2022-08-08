import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import q from 'q';
import axios from 'axios'
import styles from './map.module.scss';
import IndexLayout from '../../layouts/IndexLayout';
import LocationPin from '../../components/location-pin/LocationPin';

export default function BusinessMap() {
	const [allBusinesses, setAllBusinesses] = useState([]);

	const getAllBusinesses = () => {
		const _deferred = q.defer();
		const errMsg = 'Fail to retrieve category'

		axios
			.get(`api/businesses/category`)
			.then(response => {
				console.log(response.data);
				_deferred.resolve(response.data);
			}).catch( error => {
				_deferred.reject(Object.assign(errMsg, error));
			})
		return _deferred.promise;
	}

	useEffect(() => {
		getAllBusinesses()
			.then(response => {
				console.log(response);
				setAllBusinesses(response);
			}).catch( err => {
				console.log(err);
			})
	}, [])

	const categories = [ 'All', 'Restaurants', 'Beauty', 'Church', 'Education', 'Event Planning', 
		'Financial', 'Fitness', 'Graphic Design', 'Web Services', 'Videography', 'Photography',
		'Clothing', 'Printing Services', 'Car Wash', 'Real Estate', 'Coaching', 'Tattoo Artist',
		'Art', 'Barbershop', 'Mobile Repair' ].sort();

	const businessSelected = (selectedBusiness) => {
		console.log(selectedBusiness);
	}

	const location = {
		address: '4821 sw 23rd st West Park, FL 33023',
		lat: 25.990009,
		lng: -80.1922577,
	}	
	
	const handleApiLoaded = (map, maps) => {
		// use map and maps objects
		console.log(map, maps);
		
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

	const handle_getCategory = (response, _selectedCat) => {
		console.log(_selectedCat);
		setAllBusinesses(response);
	}

	const getSelectedCategory = (_selectedCat) => {
		if (!_selectedCat === 'all') return getAllBusinesses();
		getCategory(_selectedCat)
			.then((response) => {
				if(response.length === 0) return;
				handle_getCategory(response);
			})
			.catch( err => console.error(err))
	}

	return (
		<div className={styles.businessMap}>
			<div style={{ height: '70vh', width: '100%' }}>
				{allBusinesses?.length > 0 && <GoogleMapReact
					bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_APIKEY }}
					defaultCenter={location}
					defaultZoom={12}
					hoverDistance={40}
					onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
					yesIWantToUseGoogleMapApiInternals
				>
					{
						allBusinesses && allBusinesses.map( eachBusiness => (
							<LocationPin
								key={eachBusiness?.id}
								showBusiness={businessSelected}
								business={eachBusiness}
								lat={eachBusiness?.coordinates?.latitude}
								lng={eachBusiness?.coordinates?.longitude}
								icon={eachBusiness?.category}
							/>
						))
					}
				</GoogleMapReact>}
			</div> 
			<div className={styles.categoryContainer}>
				{
					categories.map((eachCategory) => (
						<button 
							key={eachCategory}
							className={styles.category}  
							type="button" 
							value={eachCategory} 
							onClick={() => getSelectedCategory(eachCategory)}
						>
							<span>{eachCategory}</span>
						</button>
					))
				}
			</div>
		</div>
	)
}

BusinessMap.PageLayout = IndexLayout;