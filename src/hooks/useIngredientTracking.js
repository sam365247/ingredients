import { useState, useEffect } from 'react';

export const useIngredientTracking = (ingredients, recipeSteps) => {
  const [availableQuantities, setAvailableQuantities] = useState({});
  const [maxQuantities, setMaxQuantities] = useState({});

  useEffect(() => {
    // Store maximum quantities
    const maxQuants = {};
    ingredients.forEach(ingredient => {
      maxQuants[ingredient.id] = ingredient.quantity;
    });
    setMaxQuantities(maxQuants);

    // Calculate available quantities by subtracting used amounts
    const availableQuants = { ...maxQuants };
    recipeSteps.forEach(step => {
      if (step.ingredients) {
        step.ingredients.forEach(usedIngredient => {
          availableQuants[usedIngredient.id] -= usedIngredient.quantity;
        });
      }
    });

    setAvailableQuantities(availableQuants);
  }, [ingredients, recipeSteps]);

  return {
    availableQuantities,
    maxQuantities,
    // Helper function to check if adding a quantity would exceed max
    wouldExceedMaximum: (ingredientId, quantity, currentStepQuantity = 0) => {
      const available = availableQuantities[ingredientId] || 0;
      const requestedAmount = quantity - currentStepQuantity;
      return requestedAmount > available;
    }
  };
}; 