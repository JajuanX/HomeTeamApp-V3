import nc from 'next-connect';
import { firestore } from '../../../lib/firebase';
import { collectIdsandDocs } from '../../../utils/utilities';

const handler = nc({
	onError: (err, req, res) => {
		res.status(500).end('Error retrieving next page, on pagination.');
	}
})
	.post(async (req,res) => {
		const pageSize = req.query.pagesize;
		const field = 'name';
		const business = JSON.parse(req.body);

		if(business.length === 0) {
			const nextPage = firestore.collection("businesses").orderBy(field).limit(pageSize)
			const businessesRef = await nextPage.get()
			const results = businessesRef.docs.map(collectIdsandDocs);
			res.send(results);
			return
		}

		// get last doc reference first. 
		const businessRef = firestore.collection('businesses').doc(business.id)
		const lastBusiness = await businessRef.get();

		// use doc ref as startAfter.
		const nextPage = firestore.collection("businesses").orderBy(field).startAfter(lastBusiness).limit(pageSize)
		const businessesRef = await nextPage.get()
		const results = businessesRef.docs.map(collectIdsandDocs);
		res.send(results);
	})

export default handler;
