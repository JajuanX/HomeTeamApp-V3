/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './top.module.scss';
import HomeTeamLogo from '../../public/assets/homeTeamWords.svg';
import Backbutton from '../../public/assets/backButton.svg'

// Replace words with Icons hat represent each link
function Bottom() {
	const router = useRouter();

	return (
		<div className={styles.topContainer}>
			{ router.pathname === '/home' || router.pathname === '/' ?
				<Link href="/">
					<div style={{width: '150px', position: 'relative', display: 'grid', placeItems: 'center'}}>
						<Image src={HomeTeamLogo}/>
					</div>
				</Link>:
				<button type='button' onClick={() => router.back()}>
					<div style={{ width: '20px', position: 'relative', display: 'grid', placeItems: 'center'}}>
						<Image src={Backbutton}/>
					</div>
				</button>
			}
		</div>
	)	
}

export default Bottom