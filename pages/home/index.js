import React, { useState, useEffect } from 'react';
import { Waypoint } from 'react-waypoint';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import Masonry from 'react-masonry-css'
import BusinessTileDisplay from '../../components/business-card/BusinessCard';
import styles from './Index.module.scss';
import Location from '../../public/assets/location.svg';
import IndexLayout from '../../layouts/IndexLayout';
import LoadingSplash from '../../components/loading/LoadingSplash'

function Home() {
	const [businesses, setBusinesses] = useState([]);
	const [nearestBusinesses, setNearestBusinesses] = useState([]);
	const [showingNearestLocation, setShowingNearestLocation] = useState(false);
	const [loadingNearby, setLoadingNearby] = useState(false);
	const [loadingBusinesses, setLoadingBusinesses] = useState(false);
	const [lastBusiness, setLastBusiness] = useState([]);

	useEffect(() => {
		setLoadingBusinesses(true)
		fetch(`api/businesses/8`, {
			method: 'POST',
			body: JSON.stringify([]),
		})
			.then(response => response.json())
			.then(response => {
				setBusinesses(prev => ([...prev, ...response]));
				setLoadingBusinesses(false)
			}).catch( err => {
				console.log(err);
			})
	}, [])

	const nextPage = async () => {
		if(businesses.length === 0) return;
		const last = businesses[businesses.length - 1]
		if (!last) return;
		if (lastBusiness === last) return;

		fetch(`api/businesses/8`, {
			method: 'POST',
			body: JSON.stringify(last),
		})
			.then(response => response.json())
			.then(response => {
				
				setBusinesses(prev =>([...prev, ...response]));

			})
			.catch( err => {
				console.log(err);
			})
			.finally(() => {
				setLastBusiness(last);
			})
	}

	const getClosestBusinesses = (position) => {
		const {longitude, latitude} = position.coords;
		fetch(`api/businesses/nearby`, {
			method: 'POST',
			body: JSON.stringify({longitude, latitude}),
		})
			.then(response => response.json())
			.then(response => {
				setNearestBusinesses(response);
				setShowingNearestLocation(true);
			}).catch( err => {
				console.log(err);
			})
			.finally(() => {
				setLoadingNearby(false)
			})
	}

	const getLocation = () => {
		if (showingNearestLocation) return setShowingNearestLocation(false);
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(getClosestBusinesses);
			setLoadingNearby(true)
		} else { 
			toast.error('Sorry you need navigation services for this feature')
		}
	}

	const breakpointColumnsObj = {
		default: 4,
		1100: 3,
		700: 2,
		500: 2
	};

	return (
		<div className={styles.homeContainer} data-testid='home-page'>
			<Toaster position='top-middle' />
			{ loadingNearby && LoadingSplash('Loading Nearby Location')}
			{ loadingBusinesses && LoadingSplash('Loading Businesses')}
			<div className={styles.businessesContainer}>
				<div className={styles.nearbyContainer}>
					<button type='button' onClick={getLocation}>
						{showingNearestLocation ? 
							<span>Show All</span>
							:
							<>
								<Image height={20}
									width={20}
									src={Location}
									alt='feature photo 1'/>
								<span>Get Nearby</span>
							</>
						}
					</button>
				</div>
				<div className={styles.businessContainer}>
					{ businesses && !showingNearestLocation ? 
						<Masonry
							breakpointCols={breakpointColumnsObj}
							className="my-masonry-grid"
							columnClassName="my-masonry-grid_column"
						>
							{
								businesses?.map((business) => (
									<BusinessTileDisplay
										key={business.id}
										id={business.id}
										business={business}
									/>
								))
							}
						</Masonry>
						:
						<Masonry
							breakpointCols={breakpointColumnsObj}
							className="my-masonry-grid"
							columnClassName="my-masonry-grid_column"
						>
							{
								nearestBusinesses?.map((business) => (
									<BusinessTileDisplay
										key={business.id}
										id={business.id}
										business={business}
									/>
								))
							}
						</Masonry>}
				</div>
			</div>

			<div className="waypoint">
				<Waypoint
					onEnter={nextPage}
				/>
			</div>
		</div>
	)
}

Home.PageLayout = IndexLayout;

export default Home

