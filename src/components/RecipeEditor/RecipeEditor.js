import { AddStepForm } from './AddStepForm';
import { RecipeStepsList } from './RecipeStepsList';

export const RecipeEditor = () => {
  return (
    <div className="recipe-editor">
      <h2>Collaborative Recipe Editor</h2>
      <AddStepForm />
      <RecipeStepsList />
      <table className="recipe-steps-table">
        {/* ... table contents */}
      </table>
    </div>
  );
}; 