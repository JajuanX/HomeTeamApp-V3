import React, {useContext, useRef, useEffect} from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import context from '../../../lib/context';
import IndexLayout from '../../../layouts/IndexLayout';
import styles from './Center.module.scss';
import Button from '../../../components/button-navigation/Button';
import useSubscriptions from '../../../lib/useSubscriptions';

function Business() {
	const {user} = useContext(context);
	const isFirstRender = useRef(true);
	const router = useRouter();
	const {
		products
	} = useSubscriptions();
	console.log(user);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false // toggle flag after first render/mounting
			return;
		}
		if (!user) {
			router.push('/')
		}
	}, [user, router]);

	return (
		<div className={styles.businessCenter}>
			<h1>{user?.business?.name}</h1>
			<div className={styles.imageContainer}>
				{user?.business?.cover_photo?.url && <Image
					layout="fill"
					objectFit="contain"
					src={user?.business?.cover_photo?.url}
					alt="#"
				/>}
			</div>
			<div>
				{products && products.map(product => (
					<div>
						{product.id}
					</div>
				))
				}
			</div>
			<div className={styles.buttonsContainer}>
				{user?.business && 
					<Button text='Edit Business' pageUrl={`/business/edit/${user?.business?.id}`} primary />
				}
			</div>
		</div>
	)
}

Business.PageLayout = IndexLayout;

export default Business


