/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useContext} from 'react'
import Link from 'next/link';
import Image from 'next/image';
import HomeTeamLogo from '../../public/assets/HomeTeamWords.png';
import UserContext from '../../lib/context';

// Replace words with Icons hat represent each link
function TopBar() {
	const { user } = useContext(UserContext);
	return (
		<div className="fixed bg-white z-50 flex w-full justify-between items-center pl-2 pr-2">
			<div style={{width: '180px', height: '60px', position: 'relative'}}>
				<Image priority="true" as="image" layout='fill' objectFit='contain' src={HomeTeamLogo} alt="hometeam" />
			</div>
			{	user && user.photoURL ?
				<Link href="/user">
					<a>
						<Image height={40} width={40} className="rounded-full" src={user && user.photoURL} alt="User profile" />
					</a>
				</Link>
				: <Link href="/login">
					<a>
						Login
					</a>
				</Link>
			}
		</div>
	)
		
}

export default TopBar