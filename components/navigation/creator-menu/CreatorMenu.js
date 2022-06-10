import React from "react";
import UserLoggedIn from './UserLoggedIn';
import styles from './creator-menu.module.scss';

function CreatorMenu() {
	return (
		<div name="creator_menu" className={styles.creatorMenu}>
			<UserLoggedIn />
		</div>
	)
}

export default CreatorMenu;