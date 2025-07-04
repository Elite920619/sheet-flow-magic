
interface DisplayProps {
  value: string;
}

const Display = ({ value }: DisplayProps) => {
  return (
    <div className="bg-black rounded-2xl p-6 mb-4 border border-gray-800">
      <div className="text-right">
        <div className="text-4xl font-light text-white min-h-[3rem] flex items-center justify-end">
          {value}
        </div>
      </div>
    </div>
  );
};

export default Display;
