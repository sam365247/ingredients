import { useState } from 'react';
import { useCollaboration } from '../../context/CollaborationContext';
import { IngredientDropdown } from './IngredientDropdown';
import { StepIngredients } from './StepIngredients';
import { useIngredientTracking } from '../../hooks/useIngredientTracking';

export const AddStepForm = () => {
  const { isConnected, recipeArrayRef, ingredients, recipeSteps } = useCollaboration();
  const { wouldExceedMaximum } = useIngredientTracking(ingredients, recipeSteps);
  const [newStep, setNewStep] = useState('');
  const [stepIngredients, setStepIngredients] = useState([]);
  const [showIngredientList, setShowIngredientList] = useState(false);

  const handleAddStep = () => {
    if (!recipeArrayRef.current || !newStep.trim()) return;

    // Check if any ingredient would exceed maximum quantity
    const wouldExceed = stepIngredients.some(ingredient => 
      wouldExceedMaximum(ingredient.id, ingredient.quantity)
    );

    if (wouldExceed) {
      alert('Cannot add step: one or more ingredients would exceed available quantities');
      return;
    }

    recipeArrayRef.current.push([{
      id: Date.now(),
      content: newStep.trim(),
      ingredients: stepIngredients
    }]);
    
    setNewStep('');
    setStepIngredients([]);
  };

  const handleCloseDropdown = () => {
    setShowIngredientList(false);
  };

  const handleAddIngredient = (ingredient, quantity) => {
    setStepIngredients([
      ...stepIngredients,
      {
        id: ingredient.id,
        name: ingredient.name,
        quantity: parseFloat(quantity),
        unit: ingredient.unit
      }
    ]);
    handleCloseDropdown();
  };

  const handleUpdateStepIngredient = (ingredientIndex, newQuantity) => {
    const ingredient = stepIngredients[ingredientIndex];
    
    if (wouldExceedMaximum(ingredient.id, newQuantity, ingredient.quantity)) {
      alert(`Cannot update quantity: would exceed available amount of ${ingredient.name}`);
      return;
    }

    const updatedIngredients = [...stepIngredients];
    updatedIngredients[ingredientIndex] = {
      ...updatedIngredients[ingredientIndex],
      quantity: newQuantity
    };
    setStepIngredients(updatedIngredients);
  };

  const handleDeleteStepIngredient = (ingredientIndex) => {
    setStepIngredients(stepIngredients.filter((_, index) => index !== ingredientIndex));
  };

  return (
    <div className="add-step-container">
      <div className="step-content">
        <div className="step-input-container">
          <textarea
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            placeholder="Enter recipe step..."
            className="step-input"
          />
        </div>
        
        <div className="step-ingredients-cell">
          <StepIngredients 
            ingredients={stepIngredients}
            onUpdateIngredient={handleUpdateStepIngredient}
            onDeleteIngredient={handleDeleteStepIngredient}
          />
        </div>
      </div>
      
      <div className="step-buttons">
        <div className="ingredient-dropdown">
          <button 
            onClick={() => setShowIngredientList(!showIngredientList)}
            disabled={!isConnected}
            className="add-ingredient-button"
          >
            Add Ingredient
          </button>
          
          {showIngredientList && (
            <IngredientDropdown
              onSelect={handleAddIngredient}
              onClose={handleCloseDropdown}
              usedIngredients={stepIngredients}
            />
          )}
        </div>
        
        <button 
          onClick={handleAddStep}
          disabled={!isConnected || !newStep.trim()}
          className="add-step-button"
          title="Add Step"
        >
          +
        </button>
      </div>
    </div>
  );
}; 