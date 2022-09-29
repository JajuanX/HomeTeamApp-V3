import React, { useContext, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import SimpleReactValidator from 'simple-react-validator';
import Context from '../../../lib/context';
import styles from './accept.module.scss';
import IndexLayout from '../../../layouts/IndexLayout';

export default function Invite() {
	const {user, setUserEmail, userEmail} = useContext(Context);
	const router = useRouter();
	const isFirstRender = useRef(true);
	const validator = useRef(new SimpleReactValidator());


	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false // toggle flag after first render/mounting
			return;
		}
		if (!user) {
			router.push('/home')
		}
	}, [user, router]);

	const submitInvite = (e) => {
		e.preventDefault();
		
	}

	return (
		<div className={styles.invitePage}>
			{/* <Toaster 
				position='top-center'
			/> */}
			{/* <EmailPasswordLogIn 
				email={this.state.email} 
				password={this.state.password}
				handleChange={this.handleChange} 
				submit={this.signIn}
				/> */}
			<h1>Sign Up</h1>
			<form className={styles.signUpForm} onSubmit={(e) => submitInvite(e)}>
				<div className={styles.inputsContainers}>
					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="email">
							Enter Invitation Code
						</label>
						<input className='input-single'
							placeholder="IE: john.doe@gmail.com"
							type="email"
							name="email"
							value={userEmail}
							onChange={(e) => setUserEmail(e.target.value)}
							autoComplete="off"
							onBlur={() => validator.current.showMessageFor('email')}
						/>
						{validator.current.message(
							'email',
							userEmail,
							'required|email'
						)}
					</div>

					<button type='submit' className={styles.faceBookLoginButton}>
							Submit
					</button>
				</div>
			</form>
		</div>
	)
}

Invite.PageLayout = IndexLayout;
