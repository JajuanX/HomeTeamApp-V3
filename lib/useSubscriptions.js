import axios from 'axios';
import q from 'q';
import { useEffect, useState } from 'react';
import {loadStripe} from '@stripe/stripe-js';
import { Firebase, firestore } from './firebase';
import { collectIdsandDocs } from '../utils/utilities';
// import { auth, createUserProfileDocument, storage, firestore, FieldValue } from './firebase';
// Custom hook to read auth record and user profile doc
function useSubscriptions() {
	const [ products, setProducts ] = useState([]);

	const getSubscriptions = () => {
		const _deferred = q.defer();	
		
		axios.get(`/api/subscriptions`)
			.then(response => {
				setProducts(response.data)
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.log(err);
			});
		return _deferred.promise;
	}

	useEffect(() => {
		getSubscriptions()
	}, [])

	const subscribeToHomeTeam = async (price_id, userId) => {
		const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY);
		const docRef = await firestore
			.collection('users')
			.doc(userId)
			.collection('checkout_sessions')
			.add({
				price: `${price_id}`,
				success_url: `${window.location.origin}/user`,
				cancel_url: `${window.location.origin}/user`,
			});
			// Wait for the CheckoutSession to get attached by the extension
		docRef.onSnapshot((snap) => {
			const { error, sessionId } = snap.data();
			if (error) {
				// Show an error to your customer and 
				// inspect your Cloud Function logs in the Firebase console.
				// eslint-disable-next-line no-alert
				alert(`An error occured: ${error.message}`);
			}
			if (sessionId) {
				// We have a session, let's redirect to Checkout
				// Init Stripe
				stripe.redirectToCheckout({ sessionId })
					.then((response) => {
						// eslint-disable-next-line no-console
						console.log(response);
					})
			}
		});
	}

	const openCustomerPortal = async () => {
		const functionRef = Firebase
			.app()
			.functions('us-central1')
			.httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');
		const { data } = await functionRef({ returnUrl: `${window.location.origin}/subscribe` });
		window.location.assign(data.url);
	}

	const isUserSubscribed = (userId) => {
		const _deferred = q.defer();	
		firestore.collection('users')
			.doc(userId)
			.collection('subscriptions')
			.where('status', 'in', ['trialing', 'active'])
			.onSnapshot(async (snapshot) => {

				const docs = snapshot.docs.map(collectIdsandDocs);
				if (docs[0].status === 'active') _deferred.resolve(true)
				if (docs[0].status === 'inactive')_deferred.reject(false)
			})
		return _deferred.promise;
	}
	
	return { 
		getSubscriptions,
		subscribeToHomeTeam,
		products,
		openCustomerPortal,
		isUserSubscribed,
	};
}

export default useSubscriptions;
