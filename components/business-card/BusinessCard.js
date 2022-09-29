import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './business-card.module.scss';
import { capitalizeFirstLetter } from '../../utils/utilities';

function BusinessTileDisplay({business, index}) {
	const router = useRouter();

	return (
		<button type='button'
			aria-label={`Navigate to business ${business.name}`}
			onClick={() => router.push(`/business/${business.id}`)}
		>
			<div aria-label={`Link to business ${business.name}`} tabIndex={index} className={styles.businessTileDisplay} key={business.id}>
				<div className={styles.imageContainer}>
					{ business?.cover_photo?.url &&
						<Image 
							src={business?.cover_photo.url} 
							alt={business.name}
							height={business.cover_photo.height} width={business?.cover_photo.width} 
						/>
					}
				</div>
				<div className={styles.infoContainer}>
					<div className={`${styles.name} truncate ...`}>
						{business.name}
					</div>
					<div className={`${styles.category} text-stone-500`}>
						{capitalizeFirstLetter(business.category)}
					</div>
				</div>
			</div>
		</button>
	)
}

export default BusinessTileDisplay