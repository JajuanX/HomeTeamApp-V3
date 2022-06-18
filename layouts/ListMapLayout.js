import React from "react";
import TopBar from '../components/navigation/TopBar';
import BottomBar from '../components/navigation/BottomBar';
import ListMap from '../components/list-map/ListMap';

function ListMapLayout({children}) {
	return (
		<div>
			<TopBar />
			{children}
			<ListMap />
			<BottomBar />
		</div>
	)
}

export default ListMapLayout;