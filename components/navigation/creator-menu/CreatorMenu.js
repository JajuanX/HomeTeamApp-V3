import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/router';
import styles from './creator-menu.module.scss';
import check from '../../../public/assets/check.svg'


function CreatorMenu({onOutsideClick}) {
	const router = useRouter();

	return (
		<div name="creator_menu" className={styles.creatorMenu}>
			<Link href='/home'>
				<div className={styles.navigationBlock}>
					<button type="button" onClick={onOutsideClick}>
						<span>Home</span>
					</button>
					{ router.pathname === '/home' && <div className={styles.imageContainer}>
						<Image src={check} objectFit='contain' alt='profile' />
					</div>}
				</div>
			</Link>
			<Link href='/user'>
				<div className={styles.navigationBlock}>
					<button type="button" onClick={onOutsideClick}>
						<span>Profile</span>
					</button>
					{ router.pathname === '/user' && <div className={styles.imageContainer}>
						<Image src={check} objectFit='contain' alt='profile' />
					</div>}
				</div>
			</Link>
			<Link href='/map'>
				<div className={styles.navigationBlock}>
					<button type="button" onClick={onOutsideClick}>
						<span>Map</span>
					</button>
					{ router.pathname === '/map' && <div className={styles.imageContainer}>
						<Image src={check} objectFit='contain' alt='profile' />
					</div>}
				</div>
			</Link>
			<Link href='/business/center'>
				<div className={styles.navigationBlock}>
					<button type="button" onClick={onOutsideClick}>
						<span>My Business</span>
					</button>
					{ router.pathname === '/business/center' && <div className={styles.imageContainer}>
						<Image src={check} objectFit='contain' alt='profile' />
					</div>}
				</div>
			</Link>
		</div>
	)
}

export default CreatorMenu;