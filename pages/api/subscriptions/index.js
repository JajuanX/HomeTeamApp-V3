import nc from 'next-connect';
import { firestore } from '../../../lib/firebase';
import { collectIdsandDocs } from '../../../utils/utilities';

const handler = nc({
	onError: (err, req, res) => {
		res.status(500).end("Something broke!", err);
	},
	onNoMatch: (req, res) => {
		res.status(404).end("Page is not found");
	},
})
	.get(async (req, res) => {
		const productRef = await firestore.collection('products').where('active', '==', true)
		const subs = [];
		const subsMain = [];
		const promises = []
		productRef.get()
			.then(async (snapshot) => {
				// console.log(snapshot.docs.map(collectIdsandDocs));
				subsMain.push(snapshot.docs.map(collectIdsandDocs));
				await snapshot.forEach(async (doc) => {
					const priceSnap = doc.ref.collection('prices').get();
					promises.push(priceSnap)
				});
			})
			.then(() => {
				Promise.all(promises)
					.then(async results => {
						const subscriptionsList = []
						await results.forEach(async (doc) => {
							subs.push(doc.docs.map(collectIdsandDocs)[0])
						});
						// eslint-disable-next-line no-plusplus
						for (let index = 0; index < subs.length; index++) {
							subscriptionsList.push({...subsMain[0][index], pricing: subs[index]});
						}
						res.send(subscriptionsList)
					})
			})
		
		
	})

export default handler;