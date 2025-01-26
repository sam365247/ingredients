export const getStepValue = (unit) => {
  switch (unit) {
    case 'count':
      return 1;
    case 'pounds':
    case 'liters':
      return 0.1;
    default:
      return 1;
  }
}; 