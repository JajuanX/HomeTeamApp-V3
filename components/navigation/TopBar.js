/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useContext} from 'react'
import Link from 'next/link';
import Image from 'next/image';
import HomeTeamLogo from '../../public/assets/HomeTeam.svg';
import styles from './topbar.module.scss';
import UserContext from '../../lib/context';

// Replace words with Icons hat represent each link
function TopBar() {
	const { user } = useContext(UserContext);
	return (
		<div className={styles.topBarContainer}>
			<Link href="/home">
				<div style={{width: '48px', height: '48px', position: 'relative'}}>
					<Image as="image" layout='fill' objectFit='contain' src={HomeTeamLogo} alt="hometeam" />
				</div>
			</Link>
			{user?.photoURL ?
				<Link href="/user">
					<a>
						<Image height={48} width={48} className="rounded-full" src={user && user.photoURL} alt="User profile" />
					</a>
				</Link>
				: null
			}
		</div>
	)	
}

export default TopBar