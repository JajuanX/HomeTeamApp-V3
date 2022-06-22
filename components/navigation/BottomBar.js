import React, {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import OutsideClickHandler from 'react-outside-click-handler';
import NewFeed from '../../public/assets/newsfeed.png';
import HomeTeam from '../../public/assets/HomeTeam.svg';
import Create from '../../public/assets/create.png';
import styles from './bottombar.module.scss';
import CreatorMenu from './creator-menu/CreatorMenu';

function BottomBar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const closeMenu = () => {
		setIsMenuOpen(false);
	}

	const openMenu = () => {
		setIsMenuOpen(value => !value);
	}

	return (
		<div className={styles.bottomBarContainer}>
			<Link href="/business/center">
				<div style={{width: '48px', height: '48px', position: 'relative'}}>
					<Image objectFit='contain' layout='fill' src={Create} alt="Hometeam" />
				</div>
			</Link>
			<div className=''>
				<OutsideClickHandler onOutsideClick={() => closeMenu()}>
					<button className='relative' style={{width: '48px', height: '48px', position: 'relative'}} 
						type='button' 
						onClick={() => openMenu()}
					>
						<Image objectFit='contain' layout='fill' src={HomeTeam} alt="Map Marker" />
					</button>
					{isMenuOpen && 
						<CreatorMenu onOutsideClick={() => closeMenu()}/>
					}
				</OutsideClickHandler>
			</div>
			<Link href="/news">
				<div style={{width: '48px', height: '48px', position: 'relative'}}>
					<Image objectFit='contain' layout='fill' src={NewFeed} alt="news" />
				</div>
			</Link>
		</div>
	)
}

export default BottomBar