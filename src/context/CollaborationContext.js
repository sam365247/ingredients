import React, { createContext, useContext } from 'react';
import { useYjsConnection } from '../hooks/useYjsConnection';

export const CollaborationContext = createContext();

export const CollaborationProvider = ({ children }) => {
  const { isConnected, ingredientsArrayRef, recipeArrayRef } = useYjsConnection();
  const [ingredients, setIngredients] = React.useState([]);
  const [recipeSteps, setRecipeSteps] = React.useState([]);

  React.useEffect(() => {
    if (!ingredientsArrayRef.current) return;

    // Observe changes to ingredients
    const observer = () => {
      setIngredients(ingredientsArrayRef.current.toArray());
    };
    ingredientsArrayRef.current.observe(observer);
    observer(); // Initial value

    return () => {
      if (ingredientsArrayRef.current) {
        ingredientsArrayRef.current.unobserve(observer);
      }
    };
  }, [ingredientsArrayRef]);

  React.useEffect(() => {
    if (!recipeArrayRef.current) return;

    // Observe changes to recipe steps
    const observer = () => {
      setRecipeSteps(recipeArrayRef.current.toArray());
    };
    recipeArrayRef.current.observe(observer);
    observer(); // Initial value

    return () => {
      if (recipeArrayRef.current) {
        recipeArrayRef.current.unobserve(observer);
      }
    };
  }, [recipeArrayRef]);

  return (
    <CollaborationContext.Provider 
      value={{ 
        isConnected, 
        ingredients, 
        recipeSteps, 
        ingredientsArrayRef, 
        recipeArrayRef 
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
}; 