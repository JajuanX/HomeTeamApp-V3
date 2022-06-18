import React, {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import OutsideClickHandler from 'react-outside-click-handler';
import NewFeed from '../../public/assets/newsfeed.png';
import HomeTeam from '../../public/assets/HomeTeamNoWords.png';
import Create from '../../public/assets/create.png';
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
		<div className="fixed bottom-0 bg-white py-3 left-0 w-full mx-auto flex flex-row justify-around">
			<Link href="/business/center">
				<div style={{width: '35px', height: '35px', position: 'relative'}}>
					<Image objectFit='contain' layout='fill' src={Create} alt="Hometeam" />
				</div>
			</Link>
			<div className=''>
				<OutsideClickHandler onOutsideClick={() => closeMenu()}>
					<button className='relative' style={{width: '35px', height: '35px', position: 'relative'}} 
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
				<div style={{width: '35px', height: '35px', position: 'relative'}}>
					<Image objectFit='contain' layout='fill' src={NewFeed} alt="news" />
				</div>
			</Link>
		</div>
	)
}

export default BottomBar