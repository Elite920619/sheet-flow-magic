
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';

interface FormulaBarProps {
  selectedCell: string;
  value: string;
  onUpdate: (value: string) => void;
}

export const FormulaBar: React.FC<FormulaBarProps> = ({
  selectedCell,
  value,
  onUpdate,
}) => {
  const [editValue, setEditValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSubmit = () => {
    onUpdate(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 border-b border-gray-300 bg-gray-50">
      <div className="flex items-center gap-1 text-sm font-medium text-gray-700 min-w-16">
        {selectedCell}
      </div>
      
      {isEditing && (
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleCancel}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleSubmit}
            className="h-6 w-6 p-0"
          >
            <Check className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <Input
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onFocus={() => setIsEditing(true)}
        onBlur={() => setIsEditing(false)}
        onKeyDown={handleKeyDown}
        className="flex-1 h-8 text-sm border-gray-300"
        placeholder="Enter a value or formula..."
      />
    </div>
  );
};
