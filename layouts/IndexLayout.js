import React from "react";
import Bottom from '../components/navigation/bottom';
import Top from '../components/navigation/Top';

function IndexLayout({children}) {
	return (
		<div>
			<Top />
			{children}
			<Bottom />
		</div>
	)
}

export default IndexLayout;