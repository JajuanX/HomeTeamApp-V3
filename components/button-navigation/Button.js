import React from 'react';
import { useRouter } from 'next/router';
import styles from './button.module.scss';
import { capitalizeFirstLetter } from '../../utils/utilities';

function Button({text, pageUrl, primary}) {
	const router = useRouter();
	return (
		<button className={primary ? styles.primary : styles.secondary} 
			type='button' 
			onClick={() => router.push(`${pageUrl}`)}>
			{capitalizeFirstLetter(text)}
		</button>
	)
}

export default Button