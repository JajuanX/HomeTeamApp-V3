import React, {useContext, useState} from 'react'
import Image from 'next/image';
import OutsideClickHandler from 'react-outside-click-handler';
import { useRouter } from 'next/router';
import styles from './bottom.module.scss';
import HomeTeamLogo from '../../public/assets/homeIcon.svg';
import Context from '../../lib/context';
import CreatorMenu from './creator-menu/CreatorMenu';
import { capitalizeFirstLetter } from '../../utils/utilities';

// Replace words with Icons hat represent each link
function Bottom() {
	const { user } = useContext(Context);
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
		if(pathName === '') pathName = 'Home';
		return pathName;
	}
	return (
		<nav className={styles.bottomContainer}>
			<div className={styles.left}>
				<button className={styles.iconContainer} aria-label='Home' type='button' onClick={() => router.push('/')}>
					<div style={{width: '35px', height: '35px', position: 'relative'}}>
						<Image as="image" layout='fill' objectFit='contain' src={HomeTeamLogo} alt="hometeam" />
					</div>
					<span className={styles.iconLabel}> Home</span>
				</button>
				<OutsideClickHandler onOutsideClick={() => closeMenu()}>
					<div className={styles.dropdownContainer}>
						<button 
							aria-label='Drop down menu'
							type='button' 
							onClick={() => openMenu()}
						>
							<div className={styles.dropDown}>
								<span>{cleanPathName(router.pathname)}</span>
								<div className={isMenuOpen ? styles.triangle : styles.flipTriangle}/>
							</div>
						</button>
						{isMenuOpen ? 
							<CreatorMenu closeMenu={closeMenu} user={user}/>
							: null
						}
					</div>
				</OutsideClickHandler>
			</div>
			<div className={styles.profilePicContainer}>
				{user?.photoURL ?
					<button type='button' onClick={() => router.push('/user')}>
						<Image height={40} width={40} className="rounded-full" src={user && user.photoURL} alt="User profile" />
					</button>
					: 
					<button type='button' onClick={() => router.push('/login')}>
						Login
					</button>
				}
			</div>
		</nav>
	)	
}

export default Bottom