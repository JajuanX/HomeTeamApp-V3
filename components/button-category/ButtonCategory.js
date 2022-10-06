import React, { useEffect, useState } from "react";
import styles from './button-category.module.scss';
import BusinessIcon from '../Business-Icon';

function BusinessCategory({category, getSelectedCategory, selectedCat}) {
	const [selected, setSelected] = useState(false)

	useEffect(() => {
		console.log(selectedCat, category);
		if(selectedCat !== category){
			setSelected(false)
		}
	}, [selectedCat])

	const handleCategorySelected = (selectedCategory) => {
		setSelected(value => !value);
		getSelectedCategory(selectedCategory)
	}
	
	return (
		<div className={styles.buttonContainer}>
			<button 
				key={category}
				className={`${selected ? `${styles.selected}`: ''}`}  
				type="button" 
				value={category} 
				onClick={() => handleCategorySelected(category)}
			>
				<div className={styles.buttonInfoContainer}>
					<div className={styles.overlay}>
						<BusinessIcon
							icon={category.toLocaleLowerCase()}
							size="20px" />
					</div>
					<span>{category}</span>
				</div>
			</button>
		</div>
	)
}

export default BusinessCategory;