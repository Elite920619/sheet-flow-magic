
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CellProps {
  id: string;
  value: string;
  formula?: string;
  isSelected: boolean;
  isEditing: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onUpdate: (value: string, formula?: string) => void;
  onStopEditing: () => void;
  style?: {
    bold?: boolean;
    italic?: boolean;
    color?: string;
    backgroundColor?: string;
  };
}

export const Cell: React.FC<CellProps> = ({
  id,
  value,
  formula,
  isSelected,
  isEditing,
  onClick,
  onDoubleClick,
  onContextMenu,
  onUpdate,
  onStopEditing,
  style = {}
}) => {
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(formula || value);
  }, [value, formula, isEditing]);

  const handleSubmit = () => {
    onUpdate(editValue, editValue.startsWith('=') ? editValue : undefined);
    onStopEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditValue(formula || value);
      onStopEditing();
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const cellStyle = {
    fontWeight: style.bold ? 'bold' : 'normal',
    fontStyle: style.italic ? 'italic' : 'normal',
    color: style.color || 'inherit',
    backgroundColor: style.backgroundColor || 'transparent',
  };

  return (
    <div
      className={cn(
        "w-20 h-8 border-r border-b border-gray-300 relative group cursor-cell",
        isSelected && "ring-2 ring-blue-500 ring-inset z-10"
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      style={cellStyle}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full h-full px-2 text-sm border-none outline-none bg-white"
          style={cellStyle}
        />
      ) : (
        <div 
          className="w-full h-full px-2 text-sm flex items-center overflow-hidden"
          style={cellStyle}
        >
          {value}
        </div>
      )}
      
      {isSelected && !isEditing && (
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 cursor-se-resize"></div>
      )}
    </div>
  );
};
