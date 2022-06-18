import '../styles/globals.css';
import Script from 'next/script';
import UserContext from '../lib/context';
import useUserData from '../lib/userHooks';
import IndexLayout from '../layouts/IndexLayout';


function MyApp({ Component, pageProps }) {

	const userData = useUserData()
	return (
		<>
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

			<UserContext.Provider value={userData}>
				{Component.PageLayout ?
					<IndexLayout> 
						<Component {...pageProps} />
					</IndexLayout>
					:
					<Component {...pageProps} />
				}

			</UserContext.Provider>
		</>
	)
}

export default MyApp
