import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './business-card.module.scss';

function BusinessTileDisplay({business}) {
	return (
		<Link href={`/business/${business.id}`} passHref>
			<div className={styles.businessTileDisplay} key={business.id}>
				<div className='rounded-3xl'>
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
						{business.category}
					</div>
				</div>
			</div>
		</Link>
	)
}

export default BusinessTileDisplay