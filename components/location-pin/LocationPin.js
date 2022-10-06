/* eslint-disable jsx-a11y/control-has-associated-label */
import Link from "next/link";
import React, { useState } from "react";
import { capitalizeFirstLetter } from "../../utils/utilities";
import BusinessIcon from '../Business-Icon';
import styles from './location-pin.module.scss';

function LocationPin({ business }) {
	const [toggleDetails, setToggleDetails] = useState(false);
	const openDetails = (e) => {
		e.preventDefault();
		setToggleDetails(value => !value)
	}

	function getMinutes(str) {
		const time = str.split(':');
		return time[0]*60+time[1]*1;
	}

	function getMinutesNow() {
		const timeNow = new Date();
		return timeNow.getHours()*60+timeNow.getMinutes();
	}

	function getDayOpen() {
		const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
		const today = new Date();
		const day = weekday[today.getUTCDay()];
		const isToday = business.daysOpen.find(eachDay => eachDay.day === day)
		return isToday;
	}

	const isBusinessOpen = () => {
		const isOpenToday = getDayOpen();
		const now = getMinutesNow();
		const start = getMinutes(business.opening_time);
		let end = getMinutes(business.closing_time);

		if (start > end) end += getMinutes('24:00');
	
		if ((now > start) && (now < end) && (isOpenToday.status)) {
			return <div className={styles.open}>Open</div>;
		}
		return <div className={styles.closed}>Closed</div>

	}

	return (
		<div className={styles.pin}>
			<button className={styles.iconContainer} type='button' onClick={(e) => openDetails(e)}>
				<div className={styles.overlay}>
					<BusinessIcon
						icon={business?.category}
						size="20px" />
				</div>
			</button>
			{toggleDetails && 
				<div className={styles.seeMoreContainer}>
					<button className={styles.close} type='button' onClick={(e) => openDetails(e)}>Close</button>
					<h1 style={{ width: '60px' }}>{business.name}</h1>
					<p>{capitalizeFirstLetter(business.category)}</p>
					<span>
						{isBusinessOpen()}
					</span>
					<Link className={styles.visitProfile} href={`/business/${business.id}`} passHref>Visit Profile</Link>
				</div>
			}
		</div>
	)
}

export default LocationPin;