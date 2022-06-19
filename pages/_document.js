import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

function MyDocument() {
	return (
		<Html lang="en">
			<Head >
				<link rel='manifest' href='/manifest.json' />
				<link rel='apple-touch-icon' href='/icon-512x512.png' />
				<meta name="description" content="Find locally Black owned businesses in South Broward. South Florida only app to find, locate ,and support Black Businesst"/>
				<meta name='application-name' content='The HomeTeam App' />
				<meta name='apple-mobile-web-app-capable' content='yes' />
				<meta name='apple-mobile-web-app-status-bar-style' content='default' />
				<meta name='apple-mobile-web-app-title' content='The HomeTeam App' />
				<meta name='description' content='Find locally Black owned businesses in South Broward. South Florida only app to find, locate ,and support Black Businesst' />
				<meta name='format-detection' content='telephone=no' />
				<meta name='mobile-web-app-capable' content='yes' />
				<meta name='msapplication-TileColor' content='#2B5797' />
				<meta name='msapplication-tap-highlight' content='no' />
				<meta name='theme-color' content='#000000' />

				<link rel='apple-touch-icon' href='/icon-512x512.png' />
				<link rel='apple-touch-icon' sizes='152x152' href='/icon-512x512.png' />
				<link rel='apple-touch-icon' sizes='180x180' href='/icon-512x512.png' />
				<link rel='apple-touch-icon' sizes='167x167' href='/icon-512x512.png' />

				<link rel='icon' type='image/png' sizes='32x32' href='/icon-512x512.png' />
				<link rel='icon' type='image/png' sizes='16x16' href='/icon-512x512.png' />
				<link rel='manifest' href='/manifest.json' />
				<link rel='mask-icon' href='/icon-512x512.png' color='#5bbad5' />
				<link rel='shortcut icon' href='/icon-512x512.png' />
				<meta name='twitter:card' content='summary' />
				<meta name='twitter:url' content='https://thehometeam.io' />
				<meta name='twitter:title' content='The HomeTeam App' />
				<meta name='twitter:description' content='Find locally Black owned businesses in South Broward. South Florida only app to find, locate ,and support Black Businesst' />
				<meta name='twitter:image' content='https://thehometeam.io/icons/android-chrome-192x192.png' />
				<meta name='twitter:creator' content='@Driven_juan' />
				<meta property='og:type' content='website' />
				<meta property='og:title' content='The HomeTeam App' />
				<meta property='og:description' content='Find locally Black owned businesses in South Broward. South Florida only app to find, locate ,and support Black Businesst' />
				<meta property='og:site_name' content='The HomeTeam App' />
				<meta property='og:url' content='https://thehometeam.io' />
				<meta property='og:image' content='https://thehometeam.io/icons/apple-touch-icon.png' />

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