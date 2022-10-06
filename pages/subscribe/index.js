import React, {useContext, useRef, useEffect, useState} from 'react';
import toast, {Toaster} from 'react-hot-toast';
import { useRouter } from 'next/router';
import styles from './subscribe.module.scss';
import UserContext from '../../lib/context';
import IndexLayout from '../../layouts/IndexLayout';
import useSubscriptions from '../../lib/useSubscriptions';

export default function UserProfile() {
	const {user} = useContext(UserContext);
	const isFirstRender = useRef(true);
	const router = useRouter();
	const {products, subscribeToHomeTeam, openCustomerPortal, isUserSubscribed} = useSubscriptions();
	const [userSubscribed, setUserSubscribed] = useState(false);

	const checkSubscription = (userId) => {
		isUserSubscribed(userId)
			.then(() => {
				setUserSubscribed(true);
			})
			.catch(err => {
				// eslint-disable-next-line no-console
				console.log(err);
				setUserSubscribed(false);
			})
	}

	useEffect(() => {
		if (user) {
			checkSubscription(user.uid)
		}

		if (isFirstRender.current) {
			isFirstRender.current = false // toggle flag after first render/mounting
			return;
		}

		if (!user) {
			router.push('/')
		}

	}, [user, router]);


	const subscribe = (e, priceId) => {
		e.preventDefault()
		subscribeToHomeTeam(priceId, user.uid)
			.catch(err => {
				// eslint-disable-next-line no-console
				console.error(err);
				toast.error(`${err.display}`);
			})
	}

	return (
		<main className={styles.subscriptionPage}>
			<Toaster 
				position='top-center'
			/>
			<div className={styles.buttonContainer}>
				{products && products.map(product => (
					<button
						key={product.id}
						disabled={userSubscribed}
						type='button'
						onClick={(e) => subscribe(e, product.pricing.id)}
					>
						<div className={styles.infoContainer}>
							<h1>{product?.name}</h1>
							<p>{product?.description}</p>
							<span>${product.pricing.unit_amount.toFixed(2) / 100}</span>
							<div className={styles.subscribe}>Subscribe</div>
						</div>
					</button>
				))
				}
			</div>
			<button
				className={styles.mySubscriptions}
				type='button'
				onClick={() => openCustomerPortal()}
			>
				My Subscriptions
			</button>
		</main>
	)
}

UserProfile.PageLayout = IndexLayout;