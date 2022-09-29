import '../styles/globals.css';
import Script from 'next/script';
import Head from 'next/head';
import Context from '../lib/context';
import useUserData from '../lib/userHooks';
import IndexLayout from '../layouts/IndexLayout';


function MyApp({ Component, pageProps }) {

	const userData = useUserData()
	return (
		<>
			<Head>
				<meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover' />
			</Head>
			<Script strategy='lazyOnload' src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
			<Script id='Google Analytics' strategy='lazyOnload'>
				{` window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					
					gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}')`}
			</Script>
			<Script
				strategy='lazyOnload'
				src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_APIKEY}&libraries=places`}
			/>

			<Context.Provider value={userData}>
				{Component.PageLayout ?
					<IndexLayout> 
						<Component {...pageProps} />
					</IndexLayout>
					:
					<Component {...pageProps} />
				}
			</Context.Provider>
		</>
	)
}

export default MyApp
