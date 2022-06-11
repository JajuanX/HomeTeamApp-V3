import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import q from 'q';
import axios from 'axios'
import styles from './map.module.scss';
import BusinessIcon from '../../components/Business-Icon';
import BusinessRow from '../../components/business-row/BusinessRow';
import useFetchAllBusinesses from '../../lib/useFetchAllBusinesses';


function LocationPin({ business, showBusiness}) {
	const pinnedBusiness = business;
	return (
		<button type='button' className={styles.pin} onClick={() => showBusiness(pinnedBusiness)}>
			<div>
				<BusinessIcon 
					icon={business?.category}
					size="40px"
				/>
			</div>
			<h6 style={{fontSize: '12px', width: '60px'}}>{business.name}</h6>
		</button>
	)}

export default function BusinessMap() {
	const { data: allBusinesses } = useFetchAllBusinesses();
	const [categoryBusinesses, setCategoryBusinesses] = useState([])
	const [category, setCategory] = useState('all')

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

	const getAllBusinesses = async () => {
		setCategory('all');
		setCategoryBusinesses([])
	}

	const handle_getCategory = (response, _selectedCat) => {
		console.log(_selectedCat);
		setCategory(_selectedCat);
		setCategoryBusinesses(response)
	}

	const getSelectedCategory = (_selectedCat) => {
		if (!_selectedCat === 'all') return getAllBusinesses();
		setCategoryBusinesses([])
		getCategory(_selectedCat)
			.then((response) => {
				handle_getCategory(response);
			})
			.catch( err => console.error(err))
	}

	return (
		<div className={styles.businessMap}>
			<div style={{ height: '400px', width: '100%' }}>
				{allBusinesses?.length > 0 && <GoogleMapReact
					bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_APIKEY }}
					defaultCenter={location}
					defaultZoom={13}
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
			<div className={styles.businessContainer}>
				{ category !== 'all' && categoryBusinesses?.map( eachBusiness => (
					<BusinessRow
						key={eachBusiness?.id}
						business={eachBusiness}
					/>
				))}
				{category === 'all' &&
					allBusinesses?.map( eachBusiness => (
						<BusinessRow
							key={eachBusiness?.id}
							business={eachBusiness}
						/>
					))
				}
				{ category !== 'all' && categoryBusinesses?.length === 0 && 
					<div className='text-center'>
						No businesses found.
					</div>
				}

			</div>
		</div>
	)
}