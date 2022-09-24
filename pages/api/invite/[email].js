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
		const {email} = req.query;

		if(email) {
			const inviteRef = await firestore.collection('invites').where('invitee_email', '==', `${email}`);
			const invitee = await inviteRef.get();
			const found = invitee.docs.map(collectIdsandDocs)
			if(found.length === 0) {
				res.send(false)
				return;
			}
			res.send(true);
		}
	})

export default handler;