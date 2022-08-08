import Image from "next/image";
import React from "react";
import styles from './loading-splash.module.scss';
import HomeTeamLogo from '../../public/assets/HomeTeamWording.min.svg';
import Location from '../../public/assets/location.svg';


function LoadingSplash({loadingMessage}) {
	return (
		<div className={styles.loadingSplash}>
			<div style={{width: '300px', height: '300px', position: 'relative'}}>
				<Image as="image" layout='fill' objectFit='contain' src={HomeTeamLogo} alt="hometeam" />
			</div>
			<div className={styles.messageContainer}>
				<Image height={20}
					width={20}
					src={Location}
					alt='feature photo 1'/>
				<h1>{loadingMessage}</h1>
			</div>
		</div>
	)
}

const loadingMessage = (message) => <LoadingSplash loadingMessage={message}/>


export default loadingMessage;