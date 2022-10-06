import React, {useContext, useRef, useEffect} from 'react';
import toast, {Toaster} from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/router';
import SimpleReactValidator from 'simple-react-validator';
import { signOut } from '../../lib/firebase';
import styles from './user.module.scss';
import 'firebase/functions';
import UserContext from '../../lib/context';
import IndexLayout from '../../layouts/IndexLayout';
import Button from '../../components/button-navigation/Button';

export default function UserProfile() {
	const {user, handleUploadChange, setInviteeEmail, submitInvite, inviteeEmail, inviteCode, setInviteCode, acceptInvite} = useContext(UserContext);
	const isFirstRender = useRef(true);
	const router = useRouter();
	const validator = useRef(new SimpleReactValidator());

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false // toggle flag after first render/mounting
			return;
		}
		console.log(user);
		if (!user) {
			router.push('/')
		}
	}, [user, router]);

	const submitInvitation = (e) => {
		e.preventDefault()
		if(!inviteeEmail) return
		if(user.invites.length === 5) {
			return toast.error(`You've reached the invite limit.`)
		}
		submitInvite()
			.then(() => {

				toast.success('Successfully Invited User')
			})
			.catch(err => {
				// eslint-disable-next-line no-console
				console.error(err);
				toast.error(`${err.display}`)
			})
	}

	const submitAcceptedInvitation = (e) => {
		e.preventDefault()
		// if(user.isOwner) {
		// 	return toast.error(`You've already accepted.`)
		// }
		acceptInvite(inviteCode)
			.then(() => {
				toast.success('Successfully Accepted Invite')
			})
			.catch(err => {
				// eslint-disable-next-line no-console
				console.error(err);
				toast.error(`${err.display}`)
			})
	}

	return (
		<main className={styles.userProfile}>
			<Toaster 
				position='top-center'
			/>
			<div className={styles.userActions}>
				<div className="photo-upload-container">
					{ user?.photoURL &&
						<Image src={user?.photoURL && user?.photoURL} height={150} width={150} alt="User" />
					}
				</div>
				<div className={styles.userName}>{user?.displayName}</div>
				<div className={styles.buttonContainer}>
					<button className="signout-button" type="button" onClick={signOut}>Sign Out</button> 
					<label className='upload-image'>
						<input
							name="photoURL"
							placeholder="Photo"
							type="file"
							onChange={(e) => handleUploadChange(e)}
							autoComplete="off"
							title=""
						/>
						<button type='button'> - Edit Photo</button>
					</label>
				</div>
			</div>
			<div className={styles.links}>
				{user?.isOwner && user?.isSubscribed && <Button text='Business Center' pageUrl='business/center' primary />}
				<Button text={user?.isSubscribed ? 'Subscriptions' : 'Subscribe To Create Business'} pageUrl="/subscribe"/>

			</div>
			<div className={styles.formsContainer}>
				{user?.isOwner && 
				<form className={styles.signUpForm}>
					<div className={styles.inputsContainers}>
						<div className={styles.inputContainer}>
							<label className="business-label" htmlFor="email">
								Send Invite (Max: 5)
							</label>
							<input className='input-single'
								placeholder="IE: john.doe@gmail.com"
								type="email"
								name="email"
								value={inviteeEmail}
								onChange={(e) => setInviteeEmail(e.target.value)}
								autoComplete="off"
								onBlur={() => validator.current.showMessageFor('email')}
							/>
							{validator.current.message(
								'email',
								inviteeEmail,
								'required|email'
							)}
						</div>

						<button type='button' onClick={(e) => submitInvitation(e)} className={styles.button}>
							Submit
						</button>
					</div>
				</form>}
				{!user?.isOwner && user?.isSubscribed &&
					<form className={styles.signUpForm} onSubmit={(e) => submitAcceptedInvitation(e)}>
						<div className={styles.inputsContainers}>
							<div className={styles.inputContainer}>
								<label className="business-label" htmlFor="inviteCode">
								Accept Invite
								</label>
								<input className='input-single'
									placeholder="567687-12793-238913-389138"
									type="inviteCode"
									name="inviteCode"
									value={inviteCode}
									onChange={(e) => setInviteCode(e.target.value)}
									autoComplete="off"
									onBlur={() => validator.current.showMessageFor('email')}
								/>
								{validator.current.message(
									'email',
									inviteeEmail,
									'required|email'
								)}
							</div>

							<button type='submit' className={styles.button}>
							Submit
							</button>
						</div>
					</form>}
				{user?.invites?.length > 0 && user?.isSubscribed && 
					<div className={styles.invitesContainer}>
						<h1>My Invite List</h1>
						<div className={styles.inviteContainer}>
							{
								user?.invites?.length > 0 && user.invites.map(invite => (
									<p key={invite.email}>{invite.email}</p>
								))
							}
						</div>
					</div>
				}
			</div>

		</main>
	)
}

UserProfile.PageLayout = IndexLayout;