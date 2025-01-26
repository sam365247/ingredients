import React from 'react';
import { CollaborationProvider } from './context/CollaborationContext';
import { IngredientList } from './components/IngredientList/IngredientList';
import { RecipeEditor } from './components/RecipeEditor/RecipeEditor';
import './App.css';

function App() {
  return (
    <CollaborationProvider>
      <div className="App">
        <div className="ingredient-section">
          <IngredientList />
        </div>
        <div className="recipe-section">
          <RecipeEditor />
        </div>
      </div>
    </CollaborationProvider>
  );
}

export default App;
