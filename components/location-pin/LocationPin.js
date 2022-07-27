import React from "react";
import BusinessIcon from '../Business-Icon';
import styles from './location-pin.module.scss';

function LocationPin({ business, showBusiness}) {
	const pinnedBusiness = business;
	return (
		<button type='button' className={styles.pin} onClick={() => showBusiness(pinnedBusiness)}>
			<BusinessIcon 
				icon={business?.category}
				size="60px"
			/>
			<h3 style={{width: '60px'}}>{business.name}</h3>
		</button>
	)
}

export default LocationPin;