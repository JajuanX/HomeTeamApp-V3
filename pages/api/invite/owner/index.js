import nc from 'next-connect';
import {v4 as uuid} from 'uuid'
import { firestore } from '../../../../lib/firebase';

const handler = nc({
	onError: (err, req, res) => {
		res.status(500).end('Error retrieving next page, on pagination.');
	}
})
	.post(async (req, res) => {
		const {sender_id, sender_email, invitee_email} = req.body;
		const unique_id = uuid();
		console.log(unique_id);
		if(invitee_email) {
			const inviteCollection = firestore.collection("invites")
			inviteCollection.add({
				sender_id,
				sender_email,
				invitee_email,
				unique_id,
				accepted: false,
			}).then(() => {
				res.send({
					unique_id
				})
			})
		}
	})

export default handler;
