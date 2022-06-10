import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

function MyDocument() {
	return (
		<Html lang="en">
			<Head >
				<meta name="description" content=""/>

			</Head>
			<Script
				strategy='beforeInteractive'
				src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_APIKEY}&libraries=places`}
			/>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}

export default MyDocument