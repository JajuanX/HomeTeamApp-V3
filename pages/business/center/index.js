import React, {useContext} from 'react';
import Link from 'next/link';
import UserContext from '../../../lib/context';
import IndexLayout from '../../../layouts/IndexLayout';
import styles from './Center.module.scss';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader


function Business() {
	const {user} = useContext(UserContext);
	console.log(user);


	return (
		<div className={styles.businessCenter}>
			<h1>Business Center</h1>
			{user?.userBusinesses?.length > 0 && 
				<div className={styles.userEdit}>
					<div>
						Edit
					</div>
					<Link href={`/business/edit/${user.userBusinesses[0]}`}>
						<button type='button'>Edit Business</button>
					</Link>
				</div> 
			}

			{user?.userBusinesses?.length === 0 &&
				<div className={styles.userCreate}>
					<p>
							Make your business apart of the HomeTeam.
					</p> 
					<Link href='/business/create'>
						<button type='button'>Create Business</button>
					</Link>
				</div>

			}
			{!user &&
				<div className={styles.userNotLoggedIn}>
					<p>
						Take the next step to become apart of The HomeTeam. Members can create their own business profile, 
						gain access to cool features, and much more. Join us today!
					</p>
					<Link href='/login'>
						<button type='button'>Sign Up</button>
					</Link>
				</div>}
		</div>
	)
}

Business.PageLayout = IndexLayout;

export default Business


