import axios from 'axios';
import q from 'q';
import { useEffect, useState } from 'react';
import {loadStripe} from '@stripe/stripe-js';
import { firestore } from './firebase';
// import { auth, createUserProfileDocument, storage, firestore, FieldValue } from './firebase';
// Custom hook to read auth record and user profile doc
function useSubscriptions() {
	const [ products, setProducts ] = useState([]);

	const getSubscriptions = () => {
		const _deferred = q.defer();	
		
		axios.get(`/api/subscriptions`)
			.then(response => {
				console.log(response);
				setProducts(response.data)
			})
			.catch((err) => {
				console.log(err);
			});
		return _deferred.promise;
	}

	useEffect(() => {
		getSubscriptions()
	}, [])

	const subscribeToHomeTeam = async (price_id, user) => {
		const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY);
		
		const docRef = await firestore
			.collection('users')
			.doc(user.id)
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
				alert(`An error occured: ${error.message}`);
			}
			if (sessionId) {
				// We have a session, let's redirect to Checkout
				// Init Stripe
				stripe.redirectToCheckout({ sessionId })
					.then((response) => {
						console.log(response);
					})
			}
		});
	}
	
	return { 
		getSubscriptions,
		subscribeToHomeTeam,
		products,
	};
}

export default useSubscriptions;
