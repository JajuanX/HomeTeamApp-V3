import nc from 'next-connect';
import { firestore } from '../../../../lib/firebase';
import { collectIdsandDocs } from '../../../../utils/utilities';

const handler = nc({
	onError: (err, req, res) => {
		res.status(500).end('Error retrieving next page, on pagination.');
	}
})
	.post(async (req,res) => {
		const field = 'name';
		const {category} = req.query;

		if(category === 'all') {
			const nextPage = firestore.collection("businesses").orderBy(field)
			const businessesRef = await nextPage.get()
			const results = businessesRef.docs.map(collectIdsandDocs);
			res.send(results);
			return
		}

		const nextPage = firestore.collection("businesses").where('category', '==', `${category}`)
		const businessesRef = await nextPage.get()
		const results = businessesRef.docs.map(collectIdsandDocs);
		res.send(results);
	})

export default handler;
