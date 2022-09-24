import Image from "next/image";
import React from "react";
import styles from './loading-splash.module.scss';
import HomeTeamLogo from '../../public/assets/HomeTeam.min.svg';

function LoadingSplash() {
	return (
		<div className={styles.loadingSplash}>
			<div className={styles.logoContainer}  style={{width: '200px', height: '200px', position: 'relative'}}>
				<Image as="image" layout='fill' objectFit='contain' src={HomeTeamLogo} alt="hometeam" />
			</div>
			<div className={styles.messageContainer}>
				<h3>Powered by</h3>
				<h1>Driven</h1>
			</div>
		</div>
	)
}

export default LoadingSplash;