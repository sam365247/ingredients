import { useCollaboration } from '../../context/CollaborationContext';
import { DeleteButton } from '../common/DeleteButton';
import { getStepValue } from '../../utils/helpers';

export const IngredientRow = ({ ingredient, index }) => {
  const { isConnected, ingredientsArrayRef } = useCollaboration();

  const handleIngredientChange = (field, value) => {
    if (!ingredientsArrayRef.current) return;
    const updatedIngredient = { ...ingredient, [field]: value };
    ingredientsArrayRef.current.delete(index, 1);
    ingredientsArrayRef.current.insert(index, [updatedIngredient]);
  };

  const handleDelete = () => {
    if (!ingredientsArrayRef.current) return;
    ingredientsArrayRef.current.delete(index, 1);
  };

  return (
    <tr>
      <td className="row-number">{index + 1}</td>
      <td>
        <input
          type="text"
          value={ingredient.name}
          onChange={(e) => handleIngredientChange('name', e.target.value)}
          disabled={!isConnected}
        />
      </td>
      <td>
        <input
          type="number"
          value={ingredient.quantity}
          onChange={(e) => handleIngredientChange('quantity', e.target.value)}
          min="0"
          step={getStepValue(ingredient.unit)}
          disabled={!isConnected}
        />
      </td>
      <td className="unit-cell">
        <select
          value={ingredient.unit}
          onChange={(e) => handleIngredientChange('unit', e.target.value)}
          disabled={!isConnected}
        >
          <option value="count">Count</option>
          <option value="pounds">Pounds</option>
          <option value="liters">Liters</option>
        </select>
        <DeleteButton onClick={handleDelete} disabled={!isConnected} />
      </td>
    </tr>
  );
}; 