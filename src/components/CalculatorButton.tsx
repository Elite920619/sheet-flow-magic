
import { cn } from "@/lib/utils";

interface CalculatorButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const CalculatorButton = ({ children, onClick, className }: CalculatorButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "bg-white/10 hover:bg-white/20 text-white rounded-xl p-4 text-xl font-medium transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 border border-white/5 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </button>
  );
};

export default CalculatorButton;
