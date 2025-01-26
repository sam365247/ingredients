export const checkIngredientUsage = (ingredient, recipeSteps) => {
  let totalUsed = 0;
  const usedInSteps = [];

  recipeSteps.forEach((step, stepIndex) => {
    const stepIngredient = step.ingredients?.find(i => i.id === ingredient.id);
    if (stepIngredient) {
      totalUsed += stepIngredient.quantity;
      usedInSteps.push({ stepIndex: stepIndex + 1, quantity: stepIngredient.quantity });
    }
  });

  return {
    isUsed: usedInSteps.length > 0,
    totalUsed,
    usedInSteps,
    canDelete: totalUsed === 0,
    canReduceTo: (newQuantity) => newQuantity >= totalUsed
  };
}; 