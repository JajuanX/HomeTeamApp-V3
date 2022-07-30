import React from 'react';
import GoogleMapReact from 'google-map-react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Image from 'next/image';
import Head from 'next/head';
import { Carousel } from 'react-responsive-carousel';
import IndexLayout from '../../layouts/IndexLayout';
import { capitalizeFirstLetter, fetcher } from '../../utils/utilities';
import Icon from '../../components/Business-Icon';
import styles from './Business.module.scss';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

function Business() {
	const router = useRouter();
	const { id } = router.query;	
	const { data: business } = useSWR(() => id ? `/api/business/${id}` : null, fetcher, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
	});

	const location = {
		address: '4821 sw 23rd st West Park, FL 33023',
		lat: business?.coordinates?.latitude,
		lng: business?.coordinates?.longitude,
	}

	return (
		<div data-testid='business-page' className={styles.businessPage}>
			<Head>
				<title>HomeTeam - {business?.name}</title>
				<meta name="description" content={business?.description}/>
				<meta property="og:title" content={business?.name} />
				<meta property="og:description" content={business?.description} />
				<meta property="og:image" content={business?.cover_photo.url} />
			</Head>
			{ business?.cover_photo?.url&& 
				<div className={styles.imageContainer}>
					<Image objectFit='contain'
						height={business?.cover_photo?.height}
						width={business?.cover_photo?.width}
						src={business?.cover_photo?.url} 
						alt={business?.name}/>
				</div>
			}
			<div className={styles.business}>
				<div className={styles.infoContainer}>
					<h1>{business?.name}</h1>
					<span>{business && capitalizeFirstLetter(business.category)}</span>
					<p className={styles.description}>{business?.description}</p>
				</div>

				<div className={styles.contactContainer}>
					<h2>Contact Us</h2>
					<div className={styles.contactDetail}>
						<a target="_blank" 
							rel="noopener noreferrer"
							href={`https://www.google.com/maps/search/?api=1&query=${business?.coordinates.latitude},${business?.coordinates?.longitude}`}>
							<Icon icon="map" size="24"/>
							<p>{business?.address}</p>
						</a>
					</div>
					<div className={styles.contactDetail}>
						<a href={`tel:${business?.phone_number}`}>
							<Icon icon="phone" size="24"/>
							<p>{business?.phone_number}</p>
						</a>
					</div>
					<div className={styles.contactDetail}>
						<a href={`mailto:${business?.email}`}>
							<Icon icon="email" size="24"/>
							<p>{business?.email}</p>
						</a>
					</div>
					<div className={styles.contactDetail}>
						<a target="_blank" 
							rel="noopener noreferrer"
							href={business?.website}>
							<Icon icon="website" size="24"/>
							<p>{business?.website}</p>
						</a>
					</div>
				</div>
				
				<div className={styles.socialMediaContainer}>
					{ business?.social_media && 
						business.social_media.filter(platform => platform.url).map((platform) => (
							<div className={styles.mediaIcon}
								key={platform?.type}>
								<a target="_blank" rel="noopener noreferrer" href={platform?.url}>
									<Icon icon={platform?.type} size="40"/>
								</a>
							</div>
						))
					}
				</div>

				{/* <div className="business-specs-container section">
					<div className="info-box last">
						<h4>My Favorite</h4>
						<div>
							{
								userFavorite ? 
									<img className="favorite-icons" 
										onClick={() => handle_addToFavorites(businessId, 'favorite')} 
										src={Heart} alt="Favorite button">
									</img> 
									:	<img className="favorite-icons" 
											onClick={() => handle_addToFavorites(businessId, null)} 
											src={EmptyHeart} 
											alt="unfavorite button">
										</img>
							}
						</div>
					</div>
				</div> */}

				<div className={styles.photosContainer}>
					<h2>Photos</h2>
					<Carousel axis='horizontal' showStatus={false} showThumbs={false} showIndicators={false} centerMode>
						<div key={business?.featurePhoto1?.url} className={styles.photoContainer}>
							{business?.featurePhoto1 && <Image
								objectFit='contain'
								height={business?.featurePhoto1.height}
								width={business?.featurePhoto1.width}
								src={business?.featurePhoto1?.url}
								alt='feature photo 1'
							/>}
						</div>
						<div key={business?.featurePhoto2?.url} className={styles.photoContainer}>
							{business?.featurePhoto2 && <Image
								layout='responsive'
								height={business?.featurePhoto2.height}
								width={business?.featurePhoto2.width}
								src={business?.featurePhoto2?.url}
								alt='feature photo 2'
							/>}
						</div>
						<div key={business?.featurePhoto3?.url} className={styles.photoContainer}>
							{business?.featurePhoto3 && <Image
								layout='responsive'
								height={business?.featurePhoto3.height}
								width={business?.featurePhoto3.width}
								src={business?.featurePhoto3?.url}
								alt='feature photo 3'
							/>}
						</div>
					</Carousel>
				</div>

				<div className={styles.mapContainer}>
					<h2>View on Map</h2>
					{ 
						business?.coordinates && 
						<div style={{ height: '400px', width: '100vw' }}>
							<GoogleMapReact
								bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_APIKEY }}
								defaultCenter={location}
								defaultZoom={15}
							>
								<LocationPin
									lat={business?.coordinates?.latitude}
									lng={business?.coordinates?.longitude}
									icon={business?.category}
								/>
							</GoogleMapReact>
						</div> 
					}

				</div>
				
				{/* 
				<div className="review-container review-section section">
					<h1>REVIEWS</h1>
					{
						business?.comments ? business.comments.map((comment, index) => {
							return (
								<div className="review" key={index}>
									<img src={comment.user.photoURL} alt="user profile"></img>
									<div className="review-holder">
										<header><strong>{comment.user.displayName}</strong> left a <span className={comment.reviewType}>{comment.reviewType}</span> review.</header>
										<p>{comment.comment}</p>
									</div>
								</div>
							)
						}) :
						<span style={{ marginTop: '60px' }}>No reviews yet</span>
					}
				</div> */}

				{/* <div className="leave-review-container review-section section">
					<h1>LEAVE A REVIEW</h1>
					<div className="review-buttons-container">
						<button id="positive-button" type="button" onClick={() => addReview('positive')}>Positive</button>
						<button id="neutral-button" type="button" onClick={() => addReview('neutral')}>Neutral</button>
						<button id="negative-button" type="button" onClick={() => addReview('negative')}>Negative</button>
					</div>
						<form onSubmit={(e) => handle_submitComment(e)}>
							<textarea
								className={`${reviewType}`}
								placeholder="Select which type of review you want to leave for this business."
								type="text"
								name="comment"
								value={comment}
								onChange={(e) => handleChange(e)}
								autoComplete="off"
								height="250px"
								disabled={disableReview}
							/>
							<button disabled={disableReview} type="submit">Add Review</button>
						</form>
				</div> */}
			</div>

		</div>
	)
}

Business.PageLayout = IndexLayout;

export default Business


function LocationPin({ icon, lat, lng }) {
	return (
		<div className='h-6'>
			<a target="_blank" 
				className="h-6"
				rel="noopener noreferrer"
				href={`https://www.google.com/maps/search/?api=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_APIKEY}&query=${lat},${lng}`}>
				<Icon 
					icon={icon}
					size="40"
				/>
			</a>
		</div>
	)}

