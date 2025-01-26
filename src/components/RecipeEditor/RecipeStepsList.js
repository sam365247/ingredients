import { useCollaboration } from '../../context/CollaborationContext';
import { DeleteButton } from '../common/DeleteButton';
import { StepIngredients } from './StepIngredients';
import { useIngredientTracking } from '../../hooks/useIngredientTracking';

export const RecipeStepsList = () => {
  const { recipeSteps, ingredients, isConnected, recipeArrayRef } = useCollaboration();
  const { wouldExceedMaximum } = useIngredientTracking(ingredients, recipeSteps);

  const handleUpdateStep = (index, content) => {
    if (!recipeArrayRef.current) return;
    const updatedStep = { 
      ...recipeSteps[index], 
      content 
    };
    recipeArrayRef.current.delete(index, 1);
    recipeArrayRef.current.insert(index, [updatedStep]);
  };

  const handleUpdateStepIngredient = (stepIndex, ingredientIndex, newQuantity) => {
    if (!recipeArrayRef.current) return;
    
    const step = recipeSteps[stepIndex];
    const ingredient = step.ingredients[ingredientIndex];
    
    if (wouldExceedMaximum(ingredient.id, newQuantity, ingredient.quantity)) {
      alert(`Cannot update quantity: would exceed available amount of ${ingredient.name}`);
      return;
    }

    const updatedIngredients = [...step.ingredients];
    updatedIngredients[ingredientIndex] = {
      ...updatedIngredients[ingredientIndex],
      quantity: newQuantity
    };

    const updatedStep = {
      ...step,
      ingredients: updatedIngredients
    };

    recipeArrayRef.current.delete(stepIndex, 1);
    recipeArrayRef.current.insert(stepIndex, [updatedStep]);
  };

  const handleDeleteStepIngredient = (stepIndex, ingredientIndex) => {
    if (!recipeArrayRef.current) return;
    
    const step = recipeSteps[stepIndex];
    const updatedIngredients = step.ingredients.filter((_, index) => index !== ingredientIndex);

    const updatedStep = {
      ...step,
      ingredients: updatedIngredients
    };

    recipeArrayRef.current.delete(stepIndex, 1);
    recipeArrayRef.current.insert(stepIndex, [updatedStep]);
  };

  const handleDeleteStep = (index) => {
    if (!recipeArrayRef.current) return;
    recipeArrayRef.current.delete(index, 1);
  };

  return (
    <table className="recipe-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Step</th>
          <th>Ingredients Used</th>
        </tr>
      </thead>
      <tbody>
        {recipeSteps.map((step, index) => (
          <tr key={step.id}>
            <td className="row-number">{index + 1}</td>
            <td className="step-cell">
              <textarea
                value={step.content}
                onChange={(e) => handleUpdateStep(index, e.target.value)}
                disabled={!isConnected}
                className="recipe-step"
              />
              <DeleteButton onClick={() => handleDeleteStep(index)} disabled={!isConnected} />
            </td>
            <td className="step-ingredients-cell">
              <StepIngredients 
                ingredients={step.ingredients || []}
                stepIndex={index}
                onUpdateIngredient={(ingredientIndex, newQuantity) => 
                  handleUpdateStepIngredient(index, ingredientIndex, newQuantity)
                }
                onDeleteIngredient={(ingredientIndex) => 
                  handleDeleteStepIngredient(index, ingredientIndex)
                }
              />
            </td>
          </tr>
        ))}
        {recipeSteps.length === 0 && (
          <tr>
            <td colSpan="3" className="empty-message">
              No recipe steps added yet
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}; 