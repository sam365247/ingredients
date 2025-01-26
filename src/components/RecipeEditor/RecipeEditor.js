import { AddStepForm } from './AddStepForm';
import { RecipeStepsList } from './RecipeStepsList';

export const RecipeEditor = () => {
  return (
    <div>
      <h2>Collaborative Recipe Editor</h2>
      <AddStepForm />
      <RecipeStepsList />
    </div>
  );
}; 