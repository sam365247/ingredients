import React from 'react';
import { useCollaboration } from '../../context/CollaborationContext';
import { DeleteButton } from '../common/DeleteButton';
import { StepIngredients } from './StepIngredients';

export const RecipeStepsList = () => {
  const { recipeSteps, isConnected, recipeArrayRef } = useCollaboration();

  const handleUpdateStep = (index, field, value) => {
    if (!recipeArrayRef.current) return;
    
    const step = recipeSteps[index];
    const updatedStep = { ...step, [field]: value };
    
    recipeArrayRef.current.delete(index, 1);
    recipeArrayRef.current.insert(index, [updatedStep]);
  };

  const handleUpdateStepIngredient = (stepIndex, ingredientIndex, newQuantity) => {
    if (!recipeArrayRef.current) return;
    
    const step = recipeSteps[stepIndex];
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
    <div className="recipe-steps-list">
      <h2>Recipe Steps</h2>
      <table className="recipe-steps-table">
        <thead>
          <tr>
            <th>Step</th>
            <th>Instructions</th>
            <th>Ingredients</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {recipeSteps.map((step, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <textarea
                  value={step.content}
                  onChange={(e) => handleUpdateStep(index, 'content', e.target.value)}
                  disabled={!isConnected}
                  className="step-input"
                  rows={2}
                />
              </td>
              <td>
                <StepIngredients
                  ingredients={step.ingredients}
                  stepIndex={index}
                  onUpdateIngredient={(ingredientIndex, newQuantity) => 
                    handleUpdateStepIngredient(index, ingredientIndex, newQuantity)
                  }
                  onDeleteIngredient={(ingredientIndex) => 
                    handleDeleteStepIngredient(index, ingredientIndex)
                  }
                />
              </td>
              <td className="delete-step-column">
                <button 
                  className="delete-step-button"
                  onClick={() => handleDeleteStep(index)}
                  disabled={!isConnected}
                  title="Delete Step"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
          {recipeSteps.length === 0 && (
            <tr>
              <td colSpan="4" className="empty-message">
                No recipe steps added yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}; 