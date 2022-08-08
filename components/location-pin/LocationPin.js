import Link from "next/link";
import React from "react";
import BusinessIcon from '../Business-Icon';
import styles from './location-pin.module.scss';

function LocationPin({ business }) {
	return (
		<Link href={`/business/${business.id}`} passHref>
			<div className={styles.pin}>
				<div className={styles.iconContainer}>
					<BusinessIcon 
						icon={business?.category}
						size="40px"
					/>
				</div>
				<div style={{width: '60px'}}>{business.name}</div>
			</div>
		</Link>
	)
}

export default LocationPin;