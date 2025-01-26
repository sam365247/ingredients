export const DeleteButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="delete-button"
      title="Delete"
    >
      🗑️
    </button>
  );
}; 