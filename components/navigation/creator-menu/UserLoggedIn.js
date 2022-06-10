import React, {useContext} from 'react'
import Image from 'next/image'
import Link from 'next/link';
import styles from './user-loggedIn.module.scss'
import ProfileIcon from '../../../public/assets/profile.png'
import BusinessIcon from '../../../public/assets/business.png'
import NewsFeedIcon from '../../../public/assets/newsfeed.png'
import HomeTeamIcon from '../../../public/assets/HomeTeamNoWords.png'
import UserContext from '../../../lib/context';

function UserLoggedIn() {
	const { user } = useContext(UserContext);

	return (
		<div className={styles.creatorMenuLogged}>
			<div className={styles.userLoggedIn}>
				<div className={styles.navigationBlock}>
					{user && user.userBusinesses.length > 0 ? 
						<Link href={`/business/edit/${user.userBusinesses[0]}`} passHref>
							<div className={styles.linkContainer}>
								<div className={styles.imageContainer}>
									<Image src={BusinessIcon} priority objectFit='contain' alt='profile' />
								</div>
								<span>Edit Business</span>
							</div>
						</Link> : 
						<Link href='/business/create'>
							<div className={styles.linkContainer}>
								<div className={styles.imageContainer}>
									<Image src={BusinessIcon} priority objectFit='contain' alt='profile' />
								</div>
								<span>Create Business</span>
							</div>
						</Link>
					}
				</div>
				<Link href='/user' className={styles.navigationBlock}>
					<div className={styles.linkContainer}>
						<div className={styles.imageContainer}>
							<Image src={ProfileIcon} priority objectFit='contain' alt='profile' />
						</div>
						<span>Profile</span>
					</div>
				</Link>
				<Link href='/newsfeed' className={styles.navigationBlock}>
					<div className={styles.linkContainer}>
						<div className={styles.imageContainer}>
							<Image src={NewsFeedIcon} priority objectFit='contain' alt='profile' />
						</div>
						<span>Community News</span>
					</div>
				</Link>
				<Link href='/about' className={styles.navigationBlock}>
					<div className={styles.linkContainer}>
						<div className={styles.imageContainer}>
							<Image src={HomeTeamIcon} priority objectFit='contain' alt='profile' />
						</div>
						<span>About Us</span>
					</div>
				</Link>
			</div>
		</div>)
}

export default UserLoggedIn