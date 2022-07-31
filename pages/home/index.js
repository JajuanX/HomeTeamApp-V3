import React, { useState, useEffect } from 'react';
import { Waypoint } from 'react-waypoint';
import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import { useWindowWidth } from '@react-hook/window-size';
import BusinessTileDisplay from '../../components/business-card/BusinessCard';
import styles from './Index.module.scss';
import IndexLayout from '../../layouts/IndexLayout';

function Home() {
	const [businesses, setBusinesses] = useState([]);
	const [lastBusiness, setLastBusiness] = useState([]);
	const onlyWidth = useWindowWidth()

	useEffect(() => {
		fetch(`api/businesses/8`, {
			method: 'POST',
			body: JSON.stringify([]),
		})
			.then(response => response.json())
			.then(response => {
				setBusinesses(prev => ([...prev, ...response]));
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

	return (
		<div className={styles.homeContainer} data-testid='home-page'>
			<div className={styles.businessesContainer}>
				{ businesses && 
					<Box>
						<Masonry
							columns={onlyWidth < 450 ? 2: 4}
							spacing={4}
							defaultHeight={450}
							defaultColumns={2}
							defaultSpacing={4}
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
					</Box>}
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

