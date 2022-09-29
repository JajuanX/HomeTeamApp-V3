/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './top.module.scss';
import HomeTeamLogo from '../../public/assets/homeTeamWords.svg';
import Backbutton from '../../public/assets/backButton.svg'

// Replace words with Icons hat represent each link
function Bottom() {
	const router = useRouter();
	const cleanPathName = (path) => {
		const splitPath = path.split('/');
		if(splitPath.length === 3) {
			if(splitPath[2] === 'create') return 'Create';
			if(splitPath[2] === 'edit') return 'Edit';
			if(splitPath[2] === 'center') return 'My Business';
			return 'Business'
		}
		let pathName = splitPath[1];
		
		if(pathName === 'map') pathName = 'Hometeam map';
		if(pathName === 'user') pathName = 'Profile';
		return pathName.toUpperCase();
	}
	return (
		<nav className={styles.topContainer}>
			{ router.pathname === '/' ?
				<button type='button' aria-label='Home' onClick={() => router.push('/')}>
					<div style={{width: '150px', position: 'relative', display: 'grid', placeItems: 'center'}}>
						<Image src={HomeTeamLogo}/>
					</div>
				</button>:
				<div className={styles.container}>
					<button type='button' aria-label='Back' onClick={() => router.back()}>
						<div style={{ width: '20px', position: 'relative', display: 'grid', placeItems: 'center'}}>
							<Image src={Backbutton}/>
						</div>
					</button>
					<span>{cleanPathName(router.pathname)}</span>
				</div>
			}
		</nav>
	)	
}

export default Bottom