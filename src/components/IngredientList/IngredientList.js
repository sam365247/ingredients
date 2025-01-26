import { useState } from 'react';
import { useCollaboration } from '../../context/CollaborationContext';
import { checkIngredientUsage } from '../../utils/ingredientUtils';
import { IngredientRow } from './IngredientRow';
import { AddIngredientForm } from './AddIngredientForm';

export const IngredientList = () => {
  const { ingredients, recipeSteps, isConnected, ingredientsArrayRef } = useCollaboration();

  const handleDeleteIngredient = (index) => {
    if (!ingredientsArrayRef.current) return;
    
    const ingredient = ingredients[index];
    const usage = checkIngredientUsage(ingredient, recipeSteps);

    if (usage.isUsed) {
      const stepsMessage = usage.usedInSteps
        .map(step => `Step ${step.stepIndex} (${step.quantity} ${ingredient.unit})`)
        .join(', ');
        
      alert(
        `Cannot delete ${ingredient.name} because it is being used in:\n` +
        `${stepsMessage}\n\n` +
        `Please remove the ingredient from these steps first.`
      );
      return;
    }

    ingredientsArrayRef.current.delete(index, 1);
  };

  const handleUpdateIngredient = (index, field, value) => {
    if (!ingredientsArrayRef.current) return;
    
    const ingredient = ingredients[index];
    const updatedIngredient = { ...ingredient, [field]: value };

    // If updating quantity, check usage
    if (field === 'quantity') {
      const newQuantity = parseFloat(value);
      const usage = checkIngredientUsage(ingredient, recipeSteps);

      if (newQuantity < usage.totalUsed) {
        const stepsMessage = usage.usedInSteps
          .map(step => `Step ${step.stepIndex} (${step.quantity} ${ingredient.unit})`)
          .join(', ');
          
        alert(
          `Cannot reduce ${ingredient.name} quantity to ${newQuantity} ${ingredient.unit} ` +
          `because ${usage.totalUsed} ${ingredient.unit} is being used in:\n` +
          `${stepsMessage}\n\n` +
          `Please reduce the quantities in these steps first.`
        );
        return;
      }
    }

    ingredientsArrayRef.current.delete(index, 1);
    ingredientsArrayRef.current.insert(index, [updatedIngredient]);
  };

  return (
    <div className="ingredient-list">
      <h1>Collaborative Ingredient List</h1>
      <AddIngredientForm />
      <table className="ingredient-table">
        <thead>
          <tr>
            <th>Number</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient, index) => (
            <IngredientRow
              key={ingredient.id}
              ingredient={ingredient}
              index={index}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}; 