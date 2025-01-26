import React from 'react';
import { useCollaboration } from '../../context/CollaborationContext';
import { useIngredientTracking } from '../../hooks/useIngredientTracking';
import { getStepValue } from '../../utils/helpers';

export const StepIngredients = ({ 
  ingredients, 
  stepIndex,
  onUpdateIngredient,
  onDeleteIngredient 
}) => {
  const { isConnected, ingredients: allIngredients, recipeSteps } = useCollaboration();
  const { availableQuantities, maxQuantities, wouldExceedMaximum } = useIngredientTracking(allIngredients, recipeSteps);

  const handleQuantityChange = (ingredientIndex, newQuantity) => {
    if (!onUpdateIngredient) return;
    
    const ingredient = ingredients[ingredientIndex];
    const parsedQuantity = parseFloat(newQuantity);
    
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      alert('Please enter a valid quantity greater than 0');
      return;
    }
    
    const currentQuantity = ingredient.quantity;
    const maxAvailable = (availableQuantities[ingredient.id] || 0) + currentQuantity;
    
    if (parsedQuantity > maxAvailable) {
      alert(`Only ${maxAvailable.toFixed(1)} ${ingredient.unit} of ${ingredient.name} available`);
      return;
    }
    
    onUpdateIngredient(ingredientIndex, parsedQuantity);
  };

  return (
    <div className="step-ingredients">
      <div className="ingredients-scroll">
        {ingredients.map((ingredient, index) => {
          const currentQuantity = ingredient.quantity;
          const maxAvailable = (availableQuantities[ingredient.id] || 0) + currentQuantity;
          const step = getStepValue(ingredient.unit);
          
          return (
            <div key={index} className="step-ingredient-pill">
              <input
                type="number"
                value={currentQuantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value > maxAvailable) {
                    handleQuantityChange(index, maxAvailable);
                  } else if (value < step) {
                    handleQuantityChange(index, step);
                  }
                }}
                min={step}
                max={maxAvailable}
                step={step}
                disabled={!isConnected}
                className="ingredient-quantity-input"
              />
              <span className="ingredient-details">
                {ingredient.unit} {ingredient.name}
              </span>
              <button
                onClick={() => onDeleteIngredient?.(index)}
                disabled={!isConnected}
                className="delete-ingredient-button"
                title="Remove ingredient"
              >
                ×
              </button>
            </div>
          );
        })}
        {ingredients.length === 0 && (
          <div className="no-ingredients">
            No ingredients used
          </div>
        )}
      </div>
    </div>
  );
}; 