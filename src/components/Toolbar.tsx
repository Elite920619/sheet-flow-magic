
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Save,
  FileText,
  Folder,
  Printer,
  Undo,
  Redo
} from 'lucide-react';

interface ToolbarProps {
  selectedCell: string;
  cellData?: any;
  onUpdateCell: (cellId: string, value: string, formula?: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedCell,
  cellData,
  onUpdateCell,
}) => {
  const handleFormatClick = (format: string) => {
    console.log(`Format ${format} applied to ${selectedCell}`);
  };

  return (
    <div className="flex items-center gap-2 p-2 border-b border-gray-300 bg-gray-50">
      {/* File operations */}
      <div className="flex items-center gap-1">
        <Button size="sm" variant="ghost" className="h-8">
          <FileText className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" className="h-8">
          <Folder className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" className="h-8">
          <Save className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" className="h-8">
          <Printer className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Button size="sm" variant="ghost" className="h-8">
          <Undo className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" className="h-8">
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Text formatting */}
      <div className="flex items-center gap-1">
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8"
          onClick={() => handleFormatClick('bold')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8"
          onClick={() => handleFormatClick('italic')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8"
          onClick={() => handleFormatClick('underline')}
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8"
          onClick={() => handleFormatClick('align-left')}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8"
          onClick={() => handleFormatClick('align-center')}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8"
          onClick={() => handleFormatClick('align-right')}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1" />

      {/* Selected cell indicator */}
      <div className="text-sm text-gray-600">
        Cell: <span className="font-medium">{selectedCell}</span>
      </div>
    </div>
  );
};
