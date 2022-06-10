import React from 'react'
import '../assetStyles.css'

const MagnifyingGlass = () => (
	<div className="magGlass">
		<svg className="iconHeight"
		style={{
			marginRight: '10px'
		}} 
		xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68.19 68.44">
			<g id="Layer_2" data-name="Layer 2"
				style={{
					paddingLeft: '15px',
					backgroundColor: 'red'
				}}
			><g id="Layer_1-2" data-name="Layer 1">
				<circle cx="39.19" cy="29.01" r="25.5"
					style={{
						fill:'none',
						stroke:'#fff',
						strokeMiterlimit:'10',
						strokeWidth:'7px',
					}}/>
				<rect x="-3.66" y="52.6" width="32" height="7" rx="3.5" transform="translate(-36.06 25.16) rotate(-45)"
					style={{
						fill:'#fff',
						stroke:'#fff',
					}}/>
			</g></g>
		</svg>
		<div style={{
						display: 'grid',
						placeItems: 'center',
						fontSize: '1.5rem',
						textDecoration: 'none',
						marginLeft: '10px',
						color: 'white'
					}}>Search</div>
		
	</div>
)

export default MagnifyingGlass