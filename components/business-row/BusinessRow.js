import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from './business-row.module.scss';
import { capitalizeFirstLetter } from "../../utils/utilities";

function BusinessRow({business}) {
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
		return <div className={styles.close}>Closed</div>

	}
	return (
		<Link href={`/business/${business.id}`} passHref>
			<div className={styles.businessRow}>
				<div className={styles.businessPhoto}>
					<Image
						width={business.cover_photo.width}
						height={business.cover_photo.height}
						src={business.cover_photo.url} 
						objectFit='contain'/>
				</div>
				<div className={styles.businessDetails}>
					<h1>{business.name}</h1>
					<p>{capitalizeFirstLetter(business.category)}</p>
					<span>
						{isBusinessOpen()}
					</span>
				</div>
			</div>
		</Link>
	)
}

export default BusinessRow;