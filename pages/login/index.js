import React, { useContext, useEffect, useRef } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { signInWithGoogle, signInWithFacebook } from '../../lib/firebase';
import HomeTeamLogo from '../../public/assets/HomeTeamWording.png';
import FacebookLogo from '../../public/assets/facebookLogo.png';
import GoogleLogo from '../../public/assets/googleLogo.png';
import UserContext from '../../lib/context';
// import EmailPasswordLogIn from '../components/email-password-login/EmailPasswordLogIn'
import ButtonPictureWithText from '../../components/Button-picture-text';
// import styles from './Login.module.scss'

export default function Login() {
	const {user} = useContext(UserContext);
	const router = useRouter();
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false // toggle flag after first render/mounting
			return;
		}
		if (user) {
			router.push('/')
		}
	}, [user, router]);
	
	const logInWithGoogle = () => {
		signInWithGoogle()
			.then(() => {
				toast.success('Successful Login');
			})
			.catch(() => {
				toast.error('Login Failed');
			})
	}

	const logInWithFacebook = () => {
		signInWithFacebook()
			.then(() => {
				toast.success('Successful Login');
			})
			.catch(error => {
				if (error) toast.error('Login Failed');
			})
	}

	// signUp = () => {
	// 	const { userEmail, userPassword } = this.state;
	// 	auth.createUserWithEmailAndPassword(userEmail, userPassword).then((user) => {
	// 		this.setState({ user });
	// 		createUserProfileDocument( user, {})
	// 	})
	// }
	// signIn = () => {
	// 	const userEmail = this.state.email;
	// 	const userPassword = this.state.password;
	// 	auth.signInWithEmailAndPassword(userEmail, userPassword).then((user) => {
	// 		this.setState({ user });
	// 		createUserProfileDocument( user, {})
	// 	})
	// }
	return (
		<div className='page-container'>
			<Toaster 
				position='top-center'
			/>
			{/* <EmailPasswordLogIn 
				email={this.state.email} 
				password={this.state.password}
				handleChange={this.handleChange} 
				submit={this.signIn}
				/> */}
			<div className="flex flex-col items-center ">
				<div className="my-20">
					<Image width={200}
						priority
						height={200}
						src={HomeTeamLogo} 
						alt="Hometeam Logo" />
				</div>
				<div className="flex flex-col space-y-4 items-center">
					<ButtonPictureWithText
						text="CONTINUE WITH GOOGLE"
						image={GoogleLogo}
						width={20}
						height={20}
						click={logInWithGoogle}
					/>
					<ButtonPictureWithText
						text="CONTINUE WITH FACEBOOK"
						image={FacebookLogo}
						width={20}
						height={20}
						click={logInWithFacebook}
					/>
				</div>
			</div>
		</div>
	)
}
