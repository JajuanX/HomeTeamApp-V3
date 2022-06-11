import React from 'react';
import Image from 'next/image';
import Artist from '../public/business-icons/artist.png';
import BarberShop from '../public/business-icons/barber-shop.png';
import CarWash from '../public/business-icons/car-wash.png';
import Church from '../public/business-icons/church.png';
import Clothing from '../public/business-icons/clothing.png';
import Coaching from '../public/business-icons/coaching.png';
import EventPlanner from '../public/business-icons/event-planner.png';
import Finance from '../public/business-icons/finance.png';
import Fitness from '../public/business-icons/fitness.png';
import GraphicDesign from '../public/business-icons/graphic-designer.png';
import Beauty from '../public/business-icons/hair-salon.png';
import MobileRepair from '../public/business-icons/mobile-repair.png';
import Photography from '../public/business-icons/photographer.png';
import PrintServices from '../public/business-icons/print-services.png';
import RealEstate from '../public/business-icons/real-estate.png';
import Restaurant from '../public/business-icons/restaurant.png';
import TattooArtist from '../public/business-icons/tattoo-artist.png';
import Teaching from '../public/business-icons/teaching.png';
import Videography from '../public/business-icons/videography.png';
import Facebook from '../public/social-media/facebook.png'
import Instagram from '../public/social-media/instagram.png'
import Twitter from '../public/social-media/twitter.png'
import Web from '../public/social-media/web.png'
import Email from '../public/social-media/email.png'
import Youtube from '../public/social-media/youtube.png'
import MapMarker from '../public/assets/location.png';
import Phone from '../public/assets/phone-call.png';

function Icon({icon, size}) {
	switch (icon) {
	case 'restaurants' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Restaurant" height={size} width={size} src={Restaurant}/></div>
	case 'beauty' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt='Beauty' height={size} width={size} src={Beauty}/></div>
	case 'church' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt='Church' height={size} width={size} src={Church}/></div>
	case 'teaching' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Teaching" height={size} width={size} src={Teaching}/></div>
	case 'event planning' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Event Planning" height={size} width={size} src={EventPlanner}/></div>
	case 'financial' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Financial" height={size} width={size} src={Finance}/></div>
	case 'fitness' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Fitness" height={size} width={size} src={Fitness}/></div>
	case 'graphic design' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Graphic Design" height={size} width={size} src={GraphicDesign}/></div>
	case 'web services' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Web Services" height="24px" width="24px" src={Web}/></div>
	case 'videography' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Videography" height={size} width={size} src={Videography}/></div>
	case 'photography' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Photography" height={size} width={size} src={Photography}/></div>
	case 'clothing' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Clothing" height={size} width={size} src={Clothing}/></div>
	case 'printing services' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Printing Services" height={size} width={size} src={PrintServices}/></div>
	case 'car wash' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Car Wash" height={size} width={size} src={CarWash}/></div>
	case 'real estate' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Real Estate" height={size} width={size} src={RealEstate}/></div>
	case 'coaching' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Coaching" height={size} width={size} src={Coaching}/></div>
	case 'tattoo artist' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Tattoo Artist" height={size} width={size} src={TattooArtist}/></div>
	case 'art' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Art" height={size} width={size} src={Artist}/></div>
	case 'barbershop' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Barbershop" height={size} width={size} src={BarberShop}/></div>
	case 'mobile repair' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Mobile Repair" height={size} width={size} src={MobileRepair}/></div>
	case 'website' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Website" height={size} width={size} src={Web}/></div>
	case 'instagram' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Instagram" height={size} width={size} src={Instagram}/></div>
	case 'facebook' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Facebook" height={size} width={size} src={Facebook}/></div>
	case 'twitter' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Twittter" height={size} width={size} src={Twitter}/></div>
	case 'email' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Email" height={size} width={size} src={Email}/></div>
	case 'youtube' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Youtube" height={size} width={size} src={Youtube}/></div>
	case 'map' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Map" height={size} width={size} src={MapMarker}/></div>
	case 'phone' : return <div style={{height: `${size}px`, width: `${size}px`}}><Image alt="Phone" height={size} width={size} src={Phone}/></div>
	default : return null;
	}
}

export default Icon;