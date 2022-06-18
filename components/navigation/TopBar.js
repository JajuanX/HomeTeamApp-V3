/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useContext} from 'react'
import Link from 'next/link';
import Image from 'next/image';
import HomeTeamLogo from '../../public/assets/HomeTeamNoWords.png';
import UserContext from '../../lib/context';

// Replace words with Icons hat represent each link
function TopBar() {
	const { user } = useContext(UserContext);
	return (
		<div className="fixed h-12 bg-white z-50 flex w-full justify-between items-center pl-3 pr-3">
			<Link href="/home">
				<div style={{width: '40px', height: '40px', position: 'relative'}}>
					<Image as="image" layout='fill' objectFit='contain' src={HomeTeamLogo} alt="hometeam" />
				</div>
			</Link>
			{user?.photoURL ?
				<Link href="/user">
					<a>
						<Image height={40} width={40} className="rounded-full" src={user && user.photoURL} alt="User profile" />
					</a>
				</Link>
				: null
			}
		</div>
	)	
}

export default TopBar