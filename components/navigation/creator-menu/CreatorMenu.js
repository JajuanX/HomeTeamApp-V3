import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from './creator-menu.module.scss';
import HomeTeamIcon from '../../../public/assets/HomeTeamNoWords.png'

function CreatorMenu({onOutsideClick}) {
	return (
		<div name="creator_menu" className={styles.creatorMenu}>
			<Link href='/about' className={styles.navigationBlock}>
				<button type="button" onClick={onOutsideClick}>
					<div className={styles.imageContainer}>
						<Image src={HomeTeamIcon} objectFit='contain' alt='profile' />
					</div>
					<span>About Us</span>
				</button>
			</Link>
		</div>
	)
}

export default CreatorMenu;