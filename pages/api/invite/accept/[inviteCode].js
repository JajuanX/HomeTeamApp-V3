import nc from 'next-connect';
import { collectIdsandDocs } from '../../../../utils/utilities';
import { firestore } from '../../../../lib/firebase';

const handler = nc({
	onError: (err, req, res) => {
		res.status(500).end('Error retrieving next page, on pagination.');
	}
})
	.get(async (req, res) => {
		const {inviteCode} = req.query;
		if(inviteCode) {
			const inviteRef = firestore.collection('invites').where('unique_id', '==', `${inviteCode}`);
			const invitee = await inviteRef.get();
			const found = invitee.docs.map(collectIdsandDocs)
			res.send(found[0]);
		}
	})
	.post(async (req, res) => {
		const {inviteCode} = req.query;
		if(inviteCode) {
			const inviteRef = firestore.collection('invites').where('unique_id', '==', `${inviteCode}`);
			const invitee = await inviteRef.get();
			const found = await invitee.docs.map(collectIdsandDocs)
			const invitationRef = await firestore.doc(`invites/${found[0].id}`);
			invitationRef.update({accepted: true})
			res.send(true)
			return
		}
		res.send(false)
	})

export default handler;
