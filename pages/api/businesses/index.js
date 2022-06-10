import nc from 'next-connect';
import { firestore } from '../../../lib/firebase';
import { collectIdsandDocs } from '../../../utils/utilities';

const getAllBusinesses = nc({
	onError: (err, req, res) => {
		res.status(500).end("Error getting all businesses");
	}})
	.get(async (req,res) => {
		const field = 'name';

		const businessesRef = firestore.collection("businesses").orderBy(field)
		const businesses = await businessesRef.get()

		const results = businesses.docs.map(collectIdsandDocs);
		res.send(results);
	})
	
export default getAllBusinesses;