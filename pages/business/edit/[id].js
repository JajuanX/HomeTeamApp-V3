/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import React, { useEffect, useRef, useContext } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import Script from 'next/script';
import usePlacesAutocomplete from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useRouter } from 'next/router';
import axios from 'axios';
import q from 'q';
import Image from 'next/image';
import styles from './Edit.module.scss';
import useEditBusinessForm from '../../../lib/useEditBusinessForm';
import UserContext from '../../../lib/context';
import IndexLayout from '../../../layouts/IndexLayout';

function EditBusiness() {
	const {
		handle_submit,
		handleSelect,
		handle_uploadChange,
		handle_getBusiness,
		business,
		handle_inputChange
	} = useEditBusinessForm();

	const { user } = useContext(UserContext);
	const router = useRouter();
	const { id } = router.query;

	const getBusiness = () => {
		const _deferred = q.defer();
		const errMsg = 'Fail to retrieve business'

		axios
			.get(`/api/business/${id}`)
			.then(response => {
				_deferred.resolve(response)
			}).catch( error => {
				_deferred.reject(Object.assign(errMsg, error));

			})
		return _deferred.promise;
	}
	
	const {
		ready,
		suggestions: { status, data },
		setValue,
		value,
		clearSuggestions,
	} = usePlacesAutocomplete({
		defaultValue: business?.address,
		requestOptions: {
			types: ['address'],
			componentRestrictions: {
				country: 'us',
			},
			/* Define search scope here */
		},
	});

	useEffect(() => {
		if (!id) return;
		getBusiness()
			.then((response) => {
				handle_getBusiness(response);
				setValue(response.data.address, false);
				clearSuggestions();
			})
			.catch( err => console.error(err))
	}, [id])

	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false; // toggle flag after first render/mounting
			return;
		}

		if (!user) {
			router.push('/login')
		}

		if (user?.userBusinesses.length === 0) {
			router.push('/business/create')
		}
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

	const submitBusiness = (event) => {
		event.preventDefault();
		if (!validator.current.allValid()) {
			validator.current.showMessages();
			return;
		}
		handle_submit(user, id);
	};

	return (
		<>
			<Script
				strategy='beforeInteractive'
				src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_APIKEY}&libraries=places`}
			/>
			<div
				className={styles.editBusiness}
				data-testid="create-business-page"
			>
				<h1 className={styles.mainTitle}>Edit Business</h1>
				<form className="" onSubmit={(e) => submitBusiness(e)}>
					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="name">
							Business Name<span className={styles.required}> *</span>
						</label>
						<input
							id="name"
							className="input-single"
							placeholder="Type Your Business Name"
							type="text"
							name="name"
							value={business?.name}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() => validator.current.showMessageFor('name')}
						/>
						{validator.current.message('name', business?.name, 'required')}
					</div>
					<label className="business-label" htmlFor="hours">
						Hours of Operation
					</label>
					<div className={styles.operationHoursContainer}>
						<div className={styles.days}>
							<label className={styles.day}>
								<input
									type="checkbox"
									name='dayOfWeek'
									value='Monday'
									checked={business?.Monday}
									disabled={business?.openTwentyFourHours}
									onChange={(e) => handle_inputChange(e)}
								/>
								Mon
							</label>
							<label className={styles.day}>
								<input
									type="checkbox"
									name='dayOfWeek'
									value='Tuesday'
									checked={business?.Tuesday}
									disabled={business?.openTwentyFourHours}
									onChange={(e) => handle_inputChange(e)}
								/>
								Tue
							</label>
							<label className={styles.day}>
								<input
									type="checkbox"
									name='dayOfWeek'
									value='Wednesday'
									checked={business?.Wednesday}
									disabled={business?.openTwentyFourHours}
									onChange={(e) => handle_inputChange(e)}
								/>
								Wed
							</label>
							<label className={styles.day}>
								<input
									type="checkbox"
									name='dayOfWeek'
									value='Thursday'
									checked={business?.Thursday}
									disabled={business?.openTwentyFourHours}
									onChange={(e) => handle_inputChange(e)}
								/>
								Thu
							</label>
							<label className={styles.day}>
								<input
									type="checkbox"
									name='dayOfWeek'
									value='Friday'
									checked={business?.Friday}
									disabled={business?.openTwentyFourHours}
									onChange={(e) => handle_inputChange(e)}
								/>
								Fri
							</label>
							<label className={styles.day}>
								<input
									type="checkbox"
									name='dayOfWeek'
									value='Saturday'
									checked={business?.Saturday}
									disabled={business?.openTwentyFourHours}
									onChange={(e) => handle_inputChange(e)}
								/>
								Sat
							</label>
							<label className={styles.day}>
								<input
									type="checkbox"
									name='dayOfWeek'
									value='Sunday'
									checked={business?.Sunday}
									disabled={business?.openTwentyFourHours}
									onChange={(e) => handle_inputChange(e)}
								/>
								Sun
							</label>
						</div>
						<div className={styles.timesContainer}>
							<div className={styles.timeContainer}>
								<input
									type="time"
									onChange={(e) => handle_inputChange(e)}
									name="openingTime"
									disabled={business?.openTwentyFourHours}
								/>
								<label htmlFor="openingTime">Opens At</label>
							</div>
							<div className={styles.timeContainer}>
								<input
									type="time"
									onChange={(e) => handle_inputChange(e)}
									name="closingTime"
									disabled={business?.openTwentyFourHours}
								/>
								<label htmlFor="closingTime">Closes At</label>
							</div>
						</div>
					</div>
					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="category">
							Business Category<span className={styles.required}> *</span>
						</label>
						<select
							className="input-single"
							name="category"
							value={business?.category}
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
							business?.category,
							'required'
						)}
					</div>

					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="address">
							Address<span className={styles.required}> *</span>
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
							{status === 'OK' && <div className={styles.suggestionsContainer}>
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
							</div>}
						</div>
						{validator.current.message('address', business?.address, 'required')}
					</div>

					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="city">
							City<span className={styles.required}> *</span>
						</label>
						<input
							className="input-single"
							placeholder="ie: 'Hollywood', 'West Park'"
							type="text"
							name="city"
							value={business?.city}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() => validator.current.showMessageFor('city')}
						/>
						{validator.current.message('city', business?.city, 'required')}
					</div>

					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="state">
							State<span className={styles.required}> *</span>
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
							Zip Code<span className={styles.required}> *</span>
						</label>
						<input
							className="input-single"
							placeholder="ie: 33023"
							type="text"
							name="zipCode"
							value={business?.zipCode}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() =>
								validator.current.showMessageFor('zipCode')
							}
						/>
						{validator.current.message(
							'zipCode',
							business?.zipCode,
							'required|min:5'
						)}
					</div>

					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="phoneNumber">
							Phone Number<span className={styles.required}> *</span>
						</label>
						<input
							id="phoneNumber"
							className="input-single"
							placeholder="What is your Business Number"
							type="tel"
							name="phoneNumber"
							value={business?.phoneNumber}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() =>
								validator.current.showMessageFor('phoneNumber')
							}
						/>
						{validator.current.message(
							'phoneNumber',
							business?.phoneNumber,
							'required'
						)}
					</div>
					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="description">
							Describe your Business<span className={styles.required}> *</span>
						</label>
						<textarea
							className="input-single"
							placeholder="Tell us about your business ()."
							type="text"
							name="description"
							value={business?.description}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							height="250px"
							onBlur={() =>
								validator.current.showMessageFor('description')
							}
						/>
						{validator.current.message(
							'description',
							business?.description,
							'required|min: 20|max: 1000'
						)}
					</div>

					<h1>Cover Photo</h1>
					<div className="w-full flex flex-col items-center mb-5 h-40">
						<div className="relative h-40 w-full">
							<label className={styles.photolabel}>
								{business?.cover_photo ? (
									<div className={styles.coverPhotoContainer}>
										<Image
											layout="fill"
											objectFit="contain"
											src={business?.cover_photo?.url}
											alt="#"
										/>
									</div>
								) : (
									<div className={styles.placeholder}>
										<span>Select File</span>
									</div>
								)}
								<input
									className={styles.photoupload}
									name="cover_photo"
									type="file"
									onChange={(e) => handle_uploadChange(e, id, user)}
									autoComplete="off"
									title=""
								/>
							</label>
						</div>
					</div>

					<h1>Feature Photos</h1>
					<div className={styles.featurePhotoContainer}>
						<div className={styles.uploaderContainer}>
							<div className={styles.uploadedPhotoContainer}>
								<label>
									{business?.featurePhoto1?.url ? (
										<div className={styles.photoContainer}>
											<Image
												layout="fill"
												objectFit="contain"
												src={business?.featurePhoto1.url}
												alt="#"
											/>
										</div>
									) : (
										<div className={styles.placeholder}>
											<span className="text-xs">Select File</span>
										</div>
									)}
									<input
										className={styles.photoupload}
										name="featurePhoto1"
										type="file"
										onChange={(e) => handle_uploadChange(e, id)}
										autoComplete="off"
										title=""
									/>
								</label>
							</div>
						</div>
						<div className={styles.uploaderContainer}>
							<div className={styles.uploadedPhotoContainer}>
								<label>
									{business?.featurePhoto2?.url ? (
										<div className={styles.photoContainer}>
											<Image
												layout="fill"
												objectFit="contain"
												src={business?.featurePhoto2?.url}
												alt="#"
											/>
										</div>
									) : (
										<div className={styles.placeholder}>
											<span className="text-xs">Select File</span>
										</div>
									)}

									<input
										className={styles.photoupload}
										name="featurePhoto2"
										type="file"
										onChange={(e) => handle_uploadChange(e, id)}
										autoComplete="off"
										title=""
									/>
								</label>
							</div>
						</div>
						<div className={styles.uploaderContainer}>
							<div className={styles.uploadedPhotoContainer}>
								<label>
									{business?.featurePhoto3?.url ? (
										<div className={styles.photoContainer}>
											<Image
												layout="fill"
												objectFit="contain"
												src={business?.featurePhoto3?.url}
												alt="#"
											/>
										</div>
									) : (
										<div className={styles.placeholder}>
											<span className="text-xs">Select File</span>
										</div>
									)}
									<input
										className={styles.photoupload}
										name="featurePhoto3"
										type="file"
										onChange={(e) => handle_uploadChange(e, id)}
										autoComplete="off"
										title=""
									/>
								</label>
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
							value={business?.email}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() => validator.current.showMessageFor('email')}
						/>
						{validator.current.message(
							'email',
							business?.email,
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
							value={business?.website}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() =>
								validator.current.showMessageFor('website')
							}
						/>
						{validator.current.message(
							'website',
							business?.website,
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
							value={business?.twitter}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() =>
								validator.current.showMessageFor('twitter')
							}
						/>
						{validator.current.message('twitter', business?.twitter, 'url')}
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
							value={business?.facebook}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() =>
								validator.current.showMessageFor('facebook')
							}
						/>
						{validator.current.message(
							'facebook',
							business?.facebook,
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
							value={business?.instagram}
							onChange={(e) => handle_inputChange(e)}
							autoComplete="off"
							onBlur={() =>
								validator.current.showMessageFor('instagram')
							}
						/>
						{validator.current.message(
							'instagram',
							business?.instagram,
							'url'
						)}
					</div>

					<button type="submit" className={styles.button}>
						Save Changes
					</button>
				</form>
			</div>
		</>
	);
}

EditBusiness.PageLayout = IndexLayout;

export default EditBusiness;
