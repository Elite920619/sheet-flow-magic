
export const evaluate = (firstOperand: number, secondOperand: number, operation: string): number => {
  switch (operation) {
    case "+":
      return firstOperand + secondOperand;
    case "-":
      return firstOperand - secondOperand;
    case "*":
      return firstOperand * secondOperand;
    case "/":
      if (secondOperand === 0) {
        throw new Error("Division by zero");
      }
      return firstOperand / secondOperand;
    default:
      return secondOperand;
  }
};
