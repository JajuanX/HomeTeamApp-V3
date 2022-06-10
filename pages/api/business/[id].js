import nc from 'next-connect';
import { firestore } from '../../../lib/firebase';

const handler = nc({
	onError: (err, req, res) => {
		res.status(500).end("Something broke!", err);
	},
	onNoMatch: (req, res) => {
		res.status(404).end("Page is not found");
	},
})
	.get(async (req,res) => {
		const businessId = req.query.id;
		const businessDetailsRef = await firestore.collection('businesses').doc(businessId).collection('additional').doc('details');
		const businessDocs = await businessDetailsRef.get();
		if(!businessDocs.exists) {
			res.send('No matching documents.')
		}
		const businessDetails = businessDocs.data();
		res.send(businessDetails);
	})

export default handler;