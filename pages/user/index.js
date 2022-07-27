import React, {useContext} from 'react';
import {Toaster} from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from '../../lib/firebase';
import styles from './user.module.scss';
import 'firebase/functions';
import UserContext from '../../lib/context';
import IndexLayout from '../../layouts/IndexLayout';


export default function UserProfile() {
	const {user, handleUploadChange} = useContext(UserContext);

	// const onChangeValue = (event) => {
	// 	setGender(event.target.value);
	// 	console.log(event.target.value);
	//   }
	console.log(user);
	return (
		<div className={styles.userProfile}>
			<Toaster 
				position='top-center'
			/>
			<div className={styles.userActions}>
				<div className="photo-upload-container">
					{ user?.photoURL &&
						<Image src={user?.photoURL && user?.photoURL} height={150} width={150} alt="User" />
					}
				</div>
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
						<span> - Edit Photo</span>
					</label> 
				</div>
			</div>
			<Link href="/business/center">
				<div style={{width: '30px', height: '30px', position: 'relative'}}>
					Business Center
				</div>
			</Link>
			{/* <div className={styles.questionsContainer}>
				<div>
					<label htmlFor='pillar'>
						<span>Which pillar city do you live in?</span>
					</label>
					<div onChange={onChangeValue}>
						<input type='radio' value='west_park' name='location' /> West Park
						<input type='radio' value='hallandale' name='location' /> Hallandale
						<input type='radio' value='hollywood' name='location' /> Hollywood
						<input type='radio' value='dania' name='location' /> Danie
					</div>
				</div>
			</div> */}
		</div>
	)
}

UserProfile.PageLayout = IndexLayout;