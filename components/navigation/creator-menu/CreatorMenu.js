import React from "react";
import Image from "next/image";
import { useRouter } from 'next/router';
import styles from './creator-menu.module.scss';
import check from '../../../public/assets/check.svg'


function CreatorMenu({closeMenu, user}) {
	const router = useRouter();

	const navigateTo = (route) => {
		closeMenu()
		router.push(route)
	}

	return (
		<div name="creator_menu" className={styles.creatorMenu}>
			<button type='button' aria-label='navigate to home' onClick={() => navigateTo('/')}>
				<div className={styles.navigationBlock}>
					<span>Home</span>
					{ router.pathname === '/' && <div className={styles.imageContainer}>
						<Image src={check} objectFit='contain' alt='profile' />
					</div>}
				</div>
			</button>
			{user && <button type='button' aria-label='navigate to profile' onClick={() => navigateTo('/user')}>
				<div className={styles.navigationBlock}>
					<span>Profile</span>
					{ router.pathname === '/user' && <div className={styles.imageContainer}>
						<Image src={check} objectFit='contain' alt='profile' />
					</div>}
				</div>
			</button>}
			<button type='button' aria-label='navigate to maps' onClick={() => navigateTo('/map')}>
				<div className={styles.navigationBlock}>
					<span>Map</span>
					{ router.pathname === '/map' && <div className={styles.imageContainer}>
						<Image src={check} objectFit='contain' alt='profile' />
					</div>}
				</div>
			</button>
			{ user && <button type='button' aria-label='navigate my business center' onClick={() => navigateTo('/business/center')} >
				<div className={styles.navigationBlock}>
					<span>My Business</span>
					{ router.pathname === '/business/center' && <div className={styles.imageContainer}>
						<Image src={check} objectFit='contain' alt='profile' />
					</div>}
				</div>
			</button>}
		</div>
	)
}

export default CreatorMenu;