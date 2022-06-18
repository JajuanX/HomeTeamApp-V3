/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import React, { useEffect, useRef, useContext, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import Script from 'next/script';
import usePlacesAutocomplete from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useCreateBusinessForm from '../../../lib/useCreateBusinessForm';
import UserContext from '../../../lib/context';
import styles from './Create.module.scss';
import IndexLayout from '../../../layouts/IndexLayout';

const DAYS_OF_WEEK = [
	{
		day: 'Monday',
		abbrev: 'Mon',
	},
	{
		day: 'Tuesday',
		abbrev: 'Tue',
	},
	{
		day: 'Wednesday',
		abbrev: 'Wed',
	},
	{
		day: 'Thursday',
		abbrev: 'Thu',
	},
	{
		day: 'Friday',
		abbrev: 'Fri',
	},
	{
		day: 'Saturday',
		abbrev: 'Sat',
	},
	{
		day: 'Sunday',
		abbrev: 'Sun',
	},
];

function CreateBusiness() {
	const { user } = useContext(UserContext);
	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		requestOptions: {
			types: ['address'],
			componentRestrictions: {
				country: 'us',
			},
			/* Define search scope here */
		},
	});
	const [checkedState, setCheckedState] = useState(
		new Array(DAYS_OF_WEEK.length).fill(false)
	);
	const {
		input,
		handle_inputChange,
		handle_submit,
		handleSelect,
		handle_uploadChange,
	} = useCreateBusinessForm();
	const isFirstRender = useRef(true);
	const router = useRouter();


	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false; // toggle flag after first render/mounting
			return;
		}
		if (!user) {
			router.push(`/business/center`)
		}

		if (user.userBusinesses.length > 0) router.push(`/business/edit/${user.userBusinesses[0]}`)
	}, [user]);

	const handleInput = (e) => {
		// Update the keyword of the input element
		setValue(e.target.value);
	};

	const handle_select = ({ description, place_id }) => {
		handleSelect({ description, place_id });
		setValue(description, false);
		clearSuggestions();
	};

	const ref = useOnclickOutside(() => {
		// When user clicks outside of the component, we can dismiss
		// the searched suggestions by calling this method
		clearSuggestions();
	});

	const validator = useRef(new SimpleReactValidator());

	const businessTypes = [
		'Restaurants',
		'Beauty',
		'Church',
		'Education',
		'Event Planning',
		'Financial',
		'Fitness',
		'Graphic Design',
		'Web Services',
		'Videography',
		'Photography',
		'Clothing',
		'Printing Services',
		'Car Wash',
		'Real Estate',
		'Coaching',
		'Tattoo Artist',
		'Art',
		'Barbershop',
		'Mobile Repair',
	].sort();

	const handle_onCheck = (e, position) => {
		const updatedCheckedState = checkedState.map((item, index) =>
			index === position ? !item : item
		);
		setCheckedState(updatedCheckedState);

		const day = {
			target: {
				name: 'dayofweek',
				isChecked: e.target.checked,
				value: e.target.name,
			},
		};
		handle_inputChange(day);
	};

	const handle_twentyFourHourCheck = (e) => {
		const updatedCheckedState = checkedState.map(() => false);
		setCheckedState(updatedCheckedState);
		console.log(e.target);
		const day = {
			target: {
				name: 'openTwentyFourHours',
				value: e.target.checked,
			},
		};
		handle_inputChange(day);
	};

	const submitBusiness = (event) => {
		event.preventDefault();
		if (!validator.current.allValid()) {
			validator.current.showMessages();
			return;
		}
		handle_submit(user);
	};

	return (
		<>
			<Script
				strategy='beforeInteractive'
				src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_APIKEY}&libraries=places`}
				onError={(e) => {
					console.error('Script failed to load', e);
				}}
			/>
			<div
				className={styles.createBusiness}
				data-testid="create-business-page"
			>
				<h1 className={styles.mainTitle}>Create Your Business</h1>
				<form className="" onSubmit={(e) => submitBusiness(e)}>
					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="name">
							Business Name
						</label>
						<input
							id="name"
							className="input-single"
							placeholder="Type Your Business Name"
							type="text"
							name="name"
							value={input.name}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() => validator.current.showMessageFor('name')}
						/>
						{validator.current.message('name', input.name, 'required')}
					</div>
					<div className={styles.operationHoursContainer}>
						<label className="business-label" htmlFor="hours">
							Hours of Operation
						</label>
						<div className={styles.days}>
							{DAYS_OF_WEEK.map((weekday, index) => (
								<label className={styles.day} key={weekday.day}>
									<input
										type="checkbox"
										name={weekday.day}
										value={weekday.day}
										checked={checkedState[index]}
										disabled={input.openTwentyFourHours}
										onChange={(e) => handle_onCheck(e, index)}
									/>
									{weekday.abbrev}
								</label>
							))}
						</div>
						<div className={styles.timesContainer}>
							<div className={styles.timeContainer}>
								<input
									type="time"
									onChange={(e) => handle_inputChange(e)}
									name="openingTime"
									disabled={input.openTwentyFourHours}
								/>
								<label htmlFor="openingTime">Opens At</label>
							</div>
							<div className={styles.timeContainer}>
								<input
									type="time"
									onChange={(e) => handle_inputChange(e)}
									name="closingTime"
									disabled={input.openTwentyFourHours}
								/>
								<label htmlFor="closingTime">Closes At</label>
							</div>
						</div>
						<div>
							<label className={styles.openTwentyFourHours}>
								<input
									type="checkbox"
									name='openTwentyFourHours'
									value={input.openTwentyFourHours}
									checked={input.openTwentyFourHours}
									onChange={(e) => handle_twentyFourHourCheck(e)}
								/>
								24hrs
							</label>
						</div>
					</div>
					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="category">
							Business Category
						</label>
						<select
							className="input-single"
							name="category"
							value={input.category}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() =>
								validator.current.showMessageFor('category')
							}
						>
							<option className="option-select" value="">
								Select a Category
							</option>
							{businessTypes.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
						{validator.current.message(
							'category',
							input.category,
							'required'
						)}
					</div>

					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="address">
							Business Address
						</label>
						<div ref={ref}>
							<input
								className="input-single"
								value={value}
								onChange={(e) => handleInput(e)}
								disabled={!ready}
								name="address"
								placeholder="ie: 4750 sw 21st st, West Park, Fl, 33023"
								onBlur={() =>
									validator.current.showMessageFor('address')
								}
							/>
							{/* We can use the "status" to decide whether we should display the dropdown or not */}
							<div className={styles.suggestionsContainer}>
								{status === 'OK' ? 
									data?.map((suggestion) => {
										const {
											place_id,
											structured_formatting: {
												main_text,
												secondary_text,
											},
										} = suggestion;

										return (
											<button
												type='button'
												className={styles.suggestionContainer}
												key={place_id}
												onClick={() =>
													handle_select(suggestion)
												}>
												<div className={styles.suggestion}>
													<div className={styles.mainText}>{main_text}</div>
													<div className={styles.secondaryText}>{secondary_text}</div>
												</div>
											</button>
										);
									})
									: null}
							</div>
						</div>
						{validator.current.message('address', value, 'required')}
					</div>

					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="city">
							City
						</label>
						<input
							className="input-single"
							placeholder="ie: 'Hollywood', 'West Park'"
							type="text"
							name="city"
							value={input.city}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() => validator.current.showMessageFor('city')}
						/>
						{validator.current.message('city', input.city, 'required')}
					</div>

					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="state">
							State
						</label>
						<input
							className="input-single"
							placeholder="Florida"
							type="text"
							name="state"
							disabled
							value="Florida"
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
						/>
					</div>

					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="zipCode">
							Zip Code
						</label>
						<input
							className="input-single"
							placeholder="ie: 33023"
							type="text"
							name="zipCode"
							value={input.zipCode}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() =>
								validator.current.showMessageFor('zipCode')
							}
						/>
						{validator.current.message(
							'zipCode',
							input.zipCode,
							'required|min:5'
						)}
					</div>

					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="phoneNumber">
							Phone Number
						</label>
						<input
							id="phoneNumber"
							className="input-single"
							placeholder="What is your Business Number"
							type="tel"
							name="phoneNumber"
							value={input.phoneNumber}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() =>
								validator.current.showMessageFor('phoneNumber')
							}
						/>
						{validator.current.message(
							'phoneNumber',
							input.phoneNumber,
							'required'
						)}
					</div>
					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="description">
							Describe your Business
						</label>
						<textarea
							className="input-single"
							placeholder="Tell us about your business ()."
							type="text"
							name="description"
							value={input.description}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							height="250px"
							onBlur={() =>
								validator.current.showMessageFor('description')
							}
						/>
						{validator.current.message(
							'description',
							input.description,
							'required|min: 20|max: 1000'
						)}
					</div>

					<h1>Cover Photo</h1>
					<div className="w-full flex flex-col items-center h-40">
						<div className="relative h-40 w-full">
							{input.image1?.url ? (
								<Image
									layout="fill"
									objectFit="contain"
									src={input.image1.url}
									alt="#"
								/>
							) : (
								<label className={styles.placeholder}>
									<span>Select File</span>
									<input
										className={styles.photoupload}
										name="image1"
										type="file"
										onChange={handle_uploadChange}
										autoComplete="off"
										title=""
									/>
								</label>
							)}
						</div>
					</div>

					<h1>Feature Photos</h1>
					<div className={styles.uploadContainer}>
						<div className={styles.uploaderContainer}>
							<div className={styles.uploadedPhotoContainer}>
								{input.featurePhoto1?.url ? (
									<div className={styles.photoContainer}>

										<Image
											layout="fill"
											objectFit="contain"
											src={input.featurePhoto1.url}
											alt="#"
										/>
									</div>
								) : (
									<label className={styles.placeholder}>
										<span className="text-xs">Select File</span>
										<input
											className={styles.photoupload}
											name="featurePhoto1"
											type="file"
											onChange={handle_uploadChange}
											autoComplete="off"
											title=""
										/>
									</label>
								)}
							</div>
						</div>
						<div className={styles.uploaderContainer}>
							<div className={styles.uploadedPhotoContainer}>
								{input.featurePhoto2?.url ? (
									<Image
										layout="fill"
										objectFit="contain"
										src={input.featurePhoto2.url}
										alt="#"
									/>
								) : (
									<label className={styles.placeholder}>
										<span className="text-xs">Select File</span>
										<input
											className={styles.photoupload}
											name="featurePhoto2"
											type="file"
											onChange={handle_uploadChange}
											autoComplete="off"
											title=""
										/>
									</label>
								)}
							</div>
						</div>
						<div className={styles.uploaderContainer}>
							<div className={styles.uploadedPhotoContainer}>
								{input.featurePhoto3?.url ? (
									<Image
										layout="fill"
										objectFit="contain"
										src={input.featurePhoto3.url}
										alt="#"
									/>
								) : (
									<label className={styles.placeholder}>
										<span className="text-xs">Select File</span>
										<input
											className={styles.photoupload}
											name="featurePhoto3"
											type="file"
											onChange={handle_uploadChange}
											autoComplete="off"
											title=""
										/>
									</label>
								)}
							</div>
						</div>
					</div>

					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="email">
							Business Email
						</label>
						<input
							className="input-single"
							placeholder="IE: john.doe@gmail.com"
							type="email"
							name="email"
							value={input.email}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() => validator.current.showMessageFor('email')}
						/>
						{validator.current.message(
							'email',
							input.email,
							'required|email'
						)}
					</div>

					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="website">
							Business Website
						</label>
						<input
							className="input-single"
							placeholder="IE: https://www.yourwebsite.com"
							type="url"
							name="website"
							value={input.website}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() =>
								validator.current.showMessageFor('website')
							}
						/>
						{validator.current.message(
							'website',
							input.website,
							'required|url'
						)}
					</div>

					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="twitter">
							Business Twitter
						</label>
						<input
							className="input-single"
							placeholder="IE: www.twitter.com/your_username"
							type="url"
							name="twitter"
							value={input.twitter}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() =>
								validator.current.showMessageFor('twitter')
							}
						/>
						{validator.current.message('twitter', input.twitter, 'url')}
					</div>

					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="facebook">
							Business Facebook
						</label>
						<input
							className="input-single"
							placeholder="IE: www.facebook.com/your_businesspage"
							type="url"
							name="facebook"
							value={input.facebook}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() =>
								validator.current.showMessageFor('facebook')
							}
						/>
						{validator.current.message(
							'facebook',
							input.facebook,
							'url'
						)}
					</div>

					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="instagram">
							Business Instagram
						</label>
						<input
							id='instagram'
							className="input-single"
							placeholder="IE: www.instagram.com/your_username"
							type="url"
							name="instagram"
							value={input.instagram}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() =>
								validator.current.showMessageFor('instagram')
							}
						/>
						{validator.current.message(
							'instagram',
							input.instagram,
							'url'
						)}
					</div>

					<button type="submit" className={styles.button}>
						Create Business
					</button>
				</form>
			</div>
		</>
	);
}
CreateBusiness.PageLayout = IndexLayout;

export default CreateBusiness;
