import Image from "next/image";

function ButtonPictureWithText({text, image, width, height, click}) {
	return (
		<button type='button' className="py-2 px-6 border rounded-full shadow-sm flex justify-items-center items-center mx-10 uppercase text-sm"
			onClick={click} >
			<div className="flex shrink-0 mx-2">
				<Image width={width}
					height={height} 
					src={image} 
					alt="google" />
			</div>
			<span className="text-xs whitespace-nowrap"><strong>{text}</strong></span>
		</button>
	)
}

export default ButtonPictureWithText;