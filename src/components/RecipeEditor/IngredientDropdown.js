import { useEffect, useRef, useState } from 'react';
import { useCollaboration } from '../../context/CollaborationContext';
import { useIngredientTracking } from '../../hooks/useIngredientTracking';
import { getStepValue } from '../../utils/helpers';

export const IngredientDropdown = ({ onSelect, onClose, usedIngredients = [] }) => {
  const { ingredients, recipeSteps, isConnected } = useCollaboration();
  const dropdownRef = useRef(null);
  const { availableQuantities, wouldExceedMaximum } = useIngredientTracking(ingredients, recipeSteps);
  const [selectedQuantities, setSelectedQuantities] = useState({});

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleQuantityChange = (ingredient, quantity) => {
    const parsedQuantity = parseFloat(quantity);
    const availableQuantity = Number(availableQuantities[ingredient.id]) || 0;
    
    if (parsedQuantity > availableQuantity) {
      alert(`Only ${availableQuantity.toFixed(1)} ${ingredient.unit} of ${ingredient.name} available`);
      return;
    }
    
    setSelectedQuantities({
      ...selectedQuantities,
      [ingredient.id]: parsedQuantity
    });
  };

  const handleAddClick = (ingredient) => {
    const quantity = selectedQuantities[ingredient.id] || Math.min(ingredient.quantity, availableQuantities[ingredient.id] || 0);
    const availableQuantity = Number(availableQuantities[ingredient.id]) || 0;
    
    if (quantity > availableQuantity) {
      alert(`Only ${availableQuantity.toFixed(1)} ${ingredient.unit} of ${ingredient.name} available`);
      return;
    }

    if (quantity <= 0) {
      alert('Please enter a valid quantity greater than 0');
      return;
    }
    
    onSelect(ingredient, quantity);
  };

  return (
    <div className="ingredient-list" ref={dropdownRef}>
      {ingredients.map((ingredient) => {
        const available = Number(availableQuantities[ingredient.id]) || 0;
        if (available <= 0) return null;

        const defaultQuantity = Math.min(Number(ingredient.quantity), available);
        const currentQuantity = selectedQuantities[ingredient.id] || defaultQuantity;
        const step = getStepValue(ingredient.unit);

        return (
          <div key={ingredient.id} className="ingredient-item">
            <span className="ingredient-name">
              {ingredient.name} ({ingredient.unit}) - Available: {available.toFixed(1)}
            </span>
            <div className="ingredient-controls">
              <input
                type="number"
                value={currentQuantity}
                onChange={(e) => handleQuantityChange(ingredient, e.target.value)}
                min={step}
                max={available}
                step={step}
                disabled={!isConnected}
              />
              <button 
                onClick={() => handleAddClick(ingredient)}
                disabled={!isConnected || available <= 0}
                className="ingredient-add-button"
                title="Add Ingredient"
              >
                +
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}; 