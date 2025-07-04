
import { useState } from "react";
import CalculatorButton from "./CalculatorButton";
import { evaluate } from "@/utils/calculator";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<string>("");
  const [operation, setOperation] = useState<string>("");
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue("");
    setOperation("");
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === "") {
      setPreviousValue(display);
    } else if (operation) {
      const currentValue = parseFloat(previousValue);
      const newValue = evaluate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== "" && operation) {
      const currentValue = parseFloat(previousValue);
      const newValue = evaluate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue("");
      setOperation("");
      setWaitingForOperand(true);
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/10">
      {/* Display */}
      <div className="bg-black/30 rounded-2xl p-6 mb-6 border border-white/5">
        <div className="text-right">
          <div className="text-white/60 text-sm h-6">
            {previousValue && operation ? `${previousValue} ${operation}` : ""}
          </div>
          <div className="text-white text-4xl font-light overflow-hidden">
            {display}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-3">
        <CalculatorButton
          onClick={clear}
          className="bg-red-500/80 hover:bg-red-500 text-white col-span-2"
        >
          Clear
        </CalculatorButton>
        <CalculatorButton
          onClick={() => performOperation("/")}
          className="bg-orange-500/80 hover:bg-orange-500 text-white"
        >
          ÷
        </CalculatorButton>
        <CalculatorButton
          onClick={() => performOperation("*")}
          className="bg-orange-500/80 hover:bg-orange-500 text-white"
        >
          ×
        </CalculatorButton>

        <CalculatorButton onClick={() => inputNumber("7")}>7</CalculatorButton>
        <CalculatorButton onClick={() => inputNumber("8")}>8</CalculatorButton>
        <CalculatorButton onClick={() => inputNumber("9")}>9</CalculatorButton>
        <CalculatorButton
          onClick={() => performOperation("-")}
          className="bg-orange-500/80 hover:bg-orange-500 text-white"
        >
          −
        </CalculatorButton>

        <CalculatorButton onClick={() => inputNumber("4")}>4</CalculatorButton>
        <CalculatorButton onClick={() => inputNumber("5")}>5</CalculatorButton>
        <CalculatorButton onClick={() => inputNumber("6")}>6</CalculatorButton>
        <CalculatorButton
          onClick={() => performOperation("+")}
          className="bg-orange-500/80 hover:bg-orange-500 text-white"
        >
          +
        </CalculatorButton>

        <CalculatorButton onClick={() => inputNumber("1")}>1</CalculatorButton>
        <CalculatorButton onClick={() => inputNumber("2")}>2</CalculatorButton>
        <CalculatorButton onClick={() => inputNumber("3")}>3</CalculatorButton>
        <CalculatorButton
          onClick={calculate}
          className="bg-green-500/80 hover:bg-green-500 text-white row-span-2"
        >
          =
        </CalculatorButton>

        <CalculatorButton
          onClick={() => inputNumber("0")}
          className="col-span-2"
        >
          0
        </CalculatorButton>
        <CalculatorButton onClick={inputDecimal}>.</CalculatorButton>
      </div>
    </div>
  );
};

export default Calculator;
