/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useContext, useState} from 'react'
import Link from 'next/link';
import Image from 'next/image';
import OutsideClickHandler from 'react-outside-click-handler';
import { useRouter } from 'next/router';
import styles from './topbar.module.scss';
import HomeTeamLogo from '../../public/assets/HomeTeam.svg';
import UserContext from '../../lib/context';
import CreatorMenu from './creator-menu/CreatorMenu';
import { capitalizeFirstLetter } from '../../utils/utilities';

// Replace words with Icons hat represent each link
function TopBar() {
	const { user } = useContext(UserContext);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const router = useRouter();

	const closeMenu = () => {
		setIsMenuOpen(false);
	}

	const openMenu = () => {
		setIsMenuOpen(value => !value);
	}

	const cleanPathName = (path) => {
		const splitPath = path.split('/');
		if(splitPath.length === 3) {
			if(splitPath[2] === 'create') return 'Create';
			if(splitPath[2] === 'edit') return 'Edit';
			if(splitPath[2] === 'center') return 'My Business';
			return 'Business'
		}
		let pathName = capitalizeFirstLetter(splitPath[1]);
		if(pathName === 'User') pathName = 'Profile';
		return pathName;
	}
	return (
		<div className={styles.topBarContainer}>
			<div className={styles.left}>
				<Link href="/home">
					<div style={{width: '30px', height: '30px', position: 'relative'}}>
						<Image as="image" layout='fill' objectFit='contain' src={HomeTeamLogo} alt="hometeam" />
					</div>
				</Link>
				<OutsideClickHandler onOutsideClick={() => closeMenu()}>
					<div className={styles.dropdownContainer}>
						<button 
							type='button' 
							onClick={() => openMenu()}
						>
							<div className={styles.dropDown}>
								<span>{cleanPathName(router.pathname)}</span>
								<div className={styles.triangle}/>
							</div>
						</button>
						{isMenuOpen && 
								<CreatorMenu onOutsideClick={() => closeMenu()}/>
						}
					</div>
				</OutsideClickHandler>
			</div>
			{user?.photoURL ?
				<Link href="/user">
					<a>
						<Image height={30} width={30} className="rounded-full" src={user && user.photoURL} alt="User profile" />
					</a>
				</Link>
				: 
				<Link href="/login">
					Login
				</Link>
			}
		</div>
	)	
}

export default TopBar