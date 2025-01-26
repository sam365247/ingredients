import { useState, useEffect } from 'react';
import { CollaborationContext } from './context/CollaborationContext';
import { useYjsConnection } from './hooks/useYjsConnection';
import { ConnectionStatus } from './components/common/ConnectionStatus';
import { IngredientList } from './components/IngredientList/IngredientList';
import { RecipeEditor } from './components/RecipeEditor/RecipeEditor';
import './App.css';

function App() {
  const { isConnected, ingredientsArrayRef, recipeArrayRef } = useYjsConnection();
  const [ingredients, setIngredients] = useState([]);
  const [recipeSteps, setRecipeSteps] = useState([]);

  useEffect(() => {
    if (ingredientsArrayRef.current) {
      setIngredients(ingredientsArrayRef.current.toArray());
      ingredientsArrayRef.current.observe(() => {
        setIngredients(ingredientsArrayRef.current.toArray());
      });
    }
  }, [ingredientsArrayRef.current]);

  useEffect(() => {
    if (recipeArrayRef.current) {
      setRecipeSteps(recipeArrayRef.current.toArray());
      recipeArrayRef.current.observe(() => {
        setRecipeSteps(recipeArrayRef.current.toArray());
      });
    }
  }, [recipeArrayRef.current]);

  const contextValue = {
    ingredients,
    recipeSteps,
    isConnected,
    ingredientsArrayRef,
    recipeArrayRef,
  };

  return (
    <CollaborationContext.Provider value={contextValue}>
      <div className="App">
        <ConnectionStatus />
        <IngredientList />
        <RecipeEditor />
      </div>
    </CollaborationContext.Provider>
  );
}

export default App;
