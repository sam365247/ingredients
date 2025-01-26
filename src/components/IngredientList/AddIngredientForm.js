import { useState } from 'react';
import { useCollaboration } from '../../context/CollaborationContext';

export const AddIngredientForm = () => {
  const { isConnected, ingredientsArrayRef } = useCollaboration();
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: '',
    unit: 'count'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ingredientsArrayRef.current) return;

    ingredientsArrayRef.current.push([{
      id: Date.now(),
      ...newIngredient,
      quantity: Number(newIngredient.quantity)
    }]);

    setNewIngredient({
      name: '',
      quantity: '',
      unit: 'count'
    });
  };

  return (
    <form className="add-ingredient-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={newIngredient.name}
        onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
        placeholder="Ingredient name"
        disabled={!isConnected}
        required
      />
      <input
        type="number"
        value={newIngredient.quantity}
        onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
        placeholder="Quantity"
        min="0"
        step="1"
        disabled={!isConnected}
        required
      />
      <select
        value={newIngredient.unit}
        onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
        disabled={!isConnected}
      >
        <option value="count">Count</option>
        <option value="pounds">Pounds</option>
        <option value="liters">Liters</option>
      </select>
      <button type="submit" disabled={!isConnected}>Add</button>
    </form>
  );
}; 