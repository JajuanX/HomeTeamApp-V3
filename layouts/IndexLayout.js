import React from "react";
import TopBar from '../components/navigation/TopBar';
import BottomBar from '../components/navigation/BottomBar';

function IndexLayout({children}) {
	return (
		<div>
			<TopBar />
			{children}
			<BottomBar />
		</div>
	)
}

export default IndexLayout;