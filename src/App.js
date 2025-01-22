import { useEffect, useState, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import './App.css';

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: '',
    unit: 'count'
  });

  // Refs for CRDT
  const ydocRef = useRef(null);
  const providerRef = useRef(null);
  const yarrayRef = useRef(null);

  useEffect(() => {
    // Initialize CRDT
    ydocRef.current = new Y.Doc();
    providerRef.current = new WebsocketProvider(
      'ws://localhost:1234',
      'ingredients-list',
      ydocRef.current
    );
    yarrayRef.current = ydocRef.current.getArray('ingredients');

    // Update local state when CRDT changes
    yarrayRef.current.observe(() => {
      setIngredients(yarrayRef.current.toArray());
    });

    // Connection status handling
    providerRef.current.on('status', ({ status }) => {
      setIsConnected(status === 'connected');
    });

    // Cleanup
    return () => {
      providerRef.current.disconnect();
      ydocRef.current.destroy();
    };
  }, []);

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (!yarrayRef.current || !newIngredient.name || !newIngredient.quantity) return;

    yarrayRef.current.push([{
      id: Date.now(),
      ...newIngredient
    }]);
    
    setNewIngredient({ name: '', quantity: '', unit: 'count' });
  };

  const handleUpdateIngredient = (index, field, value) => {
    if (!yarrayRef.current) return;
    const updatedIngredient = { ...ingredients[index], [field]: value };
    yarrayRef.current.delete(index, 1);
    yarrayRef.current.insert(index, [updatedIngredient]);
  };

  const getStepValue = (unit) => {
    return unit === 'count' ? '1' : '0.1';
  };

  return (
    <div className="App">
      <h1>Collaborative Ingredient List</h1>
      
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      <form className="ingredient-form" onSubmit={handleAddIngredient}>
        <input
          type="text"
          placeholder="Ingredient name"
          value={newIngredient.name}
          onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newIngredient.quantity}
          onChange={(e) => setNewIngredient({...newIngredient, quantity: e.target.value})}
          min="0"
          step={getStepValue(newIngredient.unit)}
          required
        />
        <select
          value={newIngredient.unit}
          onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value})}
        >
          <option value="count">Count</option>
          <option value="pounds">Pounds</option>
          <option value="liters">Liters</option>
        </select>
        <button 
          type="submit"
          disabled={!isConnected}
        >
          Add Ingredient
        </button>
      </form>

      <table className="ingredients-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Ingredient</th>
            <th>Quantity</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient, index) => (
            <tr key={ingredient.id}>
              <td className="row-number">{index + 1}</td>
              <td>
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => handleUpdateIngredient(index, 'name', e.target.value)}
                  disabled={!isConnected}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={ingredient.quantity}
                  onChange={(e) => handleUpdateIngredient(index, 'quantity', e.target.value)}
                  min="0"
                  step={getStepValue(ingredient.unit)}
                  disabled={!isConnected}
                />
              </td>
              <td>
                <select
                  value={ingredient.unit}
                  onChange={(e) => handleUpdateIngredient(index, 'unit', e.target.value)}
                  disabled={!isConnected}
                >
                  <option value="count">Count</option>
                  <option value="pounds">Pounds</option>
                  <option value="liters">Liters</option>
                </select>
              </td>
            </tr>
          ))}
          {ingredients.length === 0 && (
            <tr>
              <td colSpan="4" className="empty-message">
                No ingredients added yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
