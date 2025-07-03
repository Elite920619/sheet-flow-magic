
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Copy, 
  Paste, 
  Scissors, 
  Trash2, 
  Edit3, 
  Palette,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  cellId: string;
  onClose: () => void;
  onAction: (action: string) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  cellId,
  onClose,
  onAction,
}) => {
  const menuItems = [
    { icon: Copy, label: 'Copy', action: 'copy' },
    { icon: Paste, label: 'Paste', action: 'paste' },
    { icon: Scissors, label: 'Cut', action: 'cut' },
    { type: 'separator' },
    { icon: Edit3, label: 'Edit Cell', action: 'edit' },
    { icon: Trash2, label: 'Clear Contents', action: 'clear' },
    { type: 'separator' },
    { icon: ArrowUp, label: 'Insert Row Above', action: 'insert-row-above' },
    { icon: ArrowDown, label: 'Insert Row Below', action: 'insert-row-below' },
    { icon: ArrowLeft, label: 'Insert Column Left', action: 'insert-col-left' },
    { icon: ArrowRight, label: 'Insert Column Right', action: 'insert-col-right' },
    { type: 'separator' },
    { icon: Palette, label: 'Format Cells', action: 'format' },
  ];

  const handleAction = (action: string) => {
    onAction(action);
    onClose();
  };

  return (
    <Card 
      className="fixed z-50 p-1 min-w-48 shadow-lg border bg-white"
      style={{ left: x, top: y }}
    >
      {menuItems.map((item, index) => {
        if (item.type === 'separator') {
          return <div key={index} className="h-px bg-gray-200 my-1" />;
        }

        const Icon = item.icon!;
        return (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 px-2 text-sm"
            onClick={() => handleAction(item.action!)}
          >
            <Icon className="h-4 w-4 mr-2" />
            {item.label}
          </Button>
        );
      })}
    </Card>
  );
};
