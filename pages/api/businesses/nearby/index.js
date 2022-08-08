import { GeoFirestore } from 'geofirestore';
import nc from 'next-connect';
import { firestore, Firebase } from '../../../../lib/firebase';
import { collectIdsandDocs } from '../../../../utils/utilities';

const handler = nc({
	onError: (err, req, res) => {
		res.status(500).end('Error retrieving next page, on pagination.', err);
	}
})
	.post(async (req,res) => {
		const {longitude, latitude} = JSON.parse(req.body);
		if(longitude && latitude) {
			const geofirestore = new GeoFirestore(firestore);
			const geocollection = geofirestore.collection('businesses');

			// Create a GeoQuery based on a location
			const query = geocollection.near({ center: new Firebase.firestore.GeoPoint(latitude, longitude), radius: 20 }).limit(10);
			// Get query (as Promise)
			query.get().then((value) => {
				const nearestBusinesses = value.docs.map(collectIdsandDocs)
				res.send(nearestBusinesses);
			});
		}
	})

export default handler;
