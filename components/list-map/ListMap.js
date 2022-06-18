import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router'
import styles from './list-map.module.scss';
import MapMarker from '../../public/assets/map-marker.png';
import List from '../../public/assets/list.png';

function ListMap() {
	const router = useRouter()

	return (
		<div className={styles.listMap}>
			<div className={styles.listMapContainer}>
				<Link href="/home">
					<div className={router.pathname === '/home' ? `${styles.activeLeft}`: `${styles.buttonContainerLeft}`}>
						<div style={{width: '25px', height: '25px', position: 'relative'}}>
							{router.pathname === '/map' &&
								<Image objectFit='contain' layout='fill' src={List} alt="Map Marker" />
							}
						</div>
					</div>
				</Link>

				<Link href="/map">
					<div className={router.pathname === '/map' ? `${styles.active}`: `${styles.buttonContainerRight}`}>
						<div style={{width: '25px', height: '25px', position: 'relative'}}>
							{router.pathname === '/home' &&
								<Image objectFit='contain' layout='fill' src={MapMarker} alt="Map Marker" />
							}
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
}

export default ListMap;