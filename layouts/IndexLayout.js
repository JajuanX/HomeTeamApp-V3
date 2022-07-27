import React from "react";
import TopBar from '../components/navigation/TopBar';

function IndexLayout({children}) {
	return (
		<div>
			<TopBar />
			{children}
		</div>
	)
}

export default IndexLayout;