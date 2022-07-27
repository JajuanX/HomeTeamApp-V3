import React, { useContext, useEffect, useRef } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import SimpleReactValidator from 'simple-react-validator';
import { signInWithGoogle, signInWithFacebook } from '../../lib/firebase';
import FacebookLogo from '../../public/assets/facebookLogo.png';
import GoogleLogo from '../../public/assets/googleLogo.png';
import UserContext from '../../lib/context';
import styles from './Login.module.scss';

export default function Login() {
	const {user, 
		setUserEmail,
		setUserPassword,
		userEmail,
		signUp,
		userPassword} = useContext(UserContext);
	const router = useRouter();
	const isFirstRender = useRef(true);
	const validator = useRef(new SimpleReactValidator());


	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false // toggle flag after first render/mounting
			return;
		}
		if (user) {
			router.push('/business/center')
		}
	}, [user, router]);
	
	const logInWithGoogle = () => {
		signInWithGoogle()
			.then(() => {
				router.push('/business/center')
			})
			.catch(() => {
				toast.error('Login Failed');
			})
	}

	const logInWithFacebook = () => {
		signInWithFacebook()
			.then(() => {
				router.push('/business/center')
			})
			.catch(error => {
				if (error) toast.error('Login Failed');
			})
	}

	const signUpWithUserAndPassword = (e) => {
		e.preventDefault();
		if (!validator.current.allValid()) {
			validator.current.showMessages();
			return;
		}
		signUp();
	}

	return (
		<div className={styles.loginPage}>
			<Toaster 
				position='top-center'
			/>
			{/* <EmailPasswordLogIn 
				email={this.state.email} 
				password={this.state.password}
				handleChange={this.handleChange} 
				submit={this.signIn}
				/> */}
			<h1>Sign Up</h1>
			<form className={styles.signUpForm} onSubmit={(e) => signUpWithUserAndPassword(e)}>
				<div className={styles.inputsContainers}>
					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="email">
								Email
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
					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="password">
								Password
						</label>
						<input className='input-single'
							placeholder="Enter a Password"
							type="password"
							name="password"
							value={userPassword}
							onChange={(e) => setUserPassword(e.target.value)}
							autoComplete="off"
							onBlur={() => validator.current.showMessageFor('password')}
						/>
						{validator.current.message(
							'password',
							userEmail,
							['required', {max: 20}, {min: 6}]
						)}
					</div>
				</div>
				<button type='submit'>Sign Up</button>
			</form>
			<div className={styles.footer}>
				<h3>or connect with</h3>
				<div className={styles.buttonContainer}>
					<button type='button' className={styles.googleLoginButton}
						onClick={logInWithGoogle} >
						<div className="flex shrink-0 mx-2">
							<Image width={20}
								height={20} 
								src={GoogleLogo} 
								alt="google" />
						</div>
						<span className={styles.buttonText}>
								Google
						</span>
					</button>
					<button type='button' className={styles.faceBookLoginButton}
						onClick={logInWithFacebook} >
						<div className="flex shrink-0 mx-2">
							<Image width={20}
								height={20} 
								src={FacebookLogo} 
								alt="google" />
						</div>
						<span className={styles.buttonText}>
								Facebook
						</span>
					</button>
				</div>

			</div>
		</div>
	)
}
