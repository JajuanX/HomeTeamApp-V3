import nc from 'next-connect';
import { firestore } from '../../../../lib/firebase';
import { collectIdsandDocs } from '../../../../utils/utilities';

const handler = nc({
	onError: (err, req, res) => {
		res.status(500).end('Error retrieving next page, on pagination.');
	}
})
	.get(async (req,res) => {
		const field = 'name';
		const nextPage = firestore.collection("businesses").orderBy(field)
		const businessesRef = await nextPage.get()
		const results = businessesRef.docs.map(collectIdsandDocs);
		console.log(results);
		res.send(results);
	})

export default handler;
