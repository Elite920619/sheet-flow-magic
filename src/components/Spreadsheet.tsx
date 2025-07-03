
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Cell } from './Cell';
import { FormulaBar } from './FormulaBar';
import { Toolbar } from './Toolbar';
import { ContextMenu } from './ContextMenu';

interface CellData {
  value: string;
  formula?: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    color?: string;
    backgroundColor?: string;
  };
}

interface SpreadsheetData {
  [key: string]: CellData;
}

const ROWS = 100;
const COLS = 26;

export const Spreadsheet = () => {
  const [data, setData] = useState<SpreadsheetData>({});
  const [selectedCell, setSelectedCell] = useState<string>('A1');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; cell: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const spreadsheetRef = useRef<HTMLDivElement>(null);

  const getColumnName = (index: number): string => {
    return String.fromCharCode(65 + index);
  };

  const getCellId = (row: number, col: number): string => {
    return `${getColumnName(col)}${row + 1}`;
  };

  const parseCellId = (cellId: string): { row: number; col: number } => {
    const col = cellId.charCodeAt(0) - 65;
    const row = parseInt(cellId.slice(1)) - 1;
    return { row, col };
  };

  const updateCell = useCallback((cellId: string, value: string, formula?: string) => {
    setData(prev => ({
      ...prev,
      [cellId]: {
        ...prev[cellId],
        value,
        formula: formula || undefined
      }
    }));
  }, []);

  const handleCellClick = useCallback((cellId: string) => {
    setSelectedCell(cellId);
    setIsEditing(false);
  }, []);

  const handleCellDoubleClick = useCallback((cellId: string) => {
    setSelectedCell(cellId);
    setIsEditing(true);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isEditing) return;

    const { row, col } = parseCellId(selectedCell);
    let newRow = row;
    let newCol = col;

    switch (e.key) {
      case 'ArrowUp':
        newRow = Math.max(0, row - 1);
        break;
      case 'ArrowDown':
        newRow = Math.min(ROWS - 1, row + 1);
        break;
      case 'ArrowLeft':
        newCol = Math.max(0, col - 1);
        break;
      case 'ArrowRight':
        newCol = Math.min(COLS - 1, col + 1);
        break;
      case 'Enter':
        setIsEditing(true);
        return;
      case 'Delete':
        updateCell(selectedCell, '');
        return;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          setIsEditing(true);
        }
        return;
    }

    e.preventDefault();
    setSelectedCell(getCellId(newRow, newCol));
  }, [selectedCell, isEditing, updateCell]);

  const handleContextMenu = useCallback((e: React.MouseEvent, cellId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, cell: cellId });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const renderHeaders = () => {
    const headers = [];
    for (let col = 0; col < COLS; col++) {
      headers.push(
        <div
          key={col}
          className="w-20 h-8 border-r border-gray-300 bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700"
        >
          {getColumnName(col)}
        </div>
      );
    }
    return headers;
  };

  const renderRows = () => {
    const rows = [];
    for (let row = 0; row < ROWS; row++) {
      const cells = [];
      
      // Row header
      cells.push(
        <div
          key={`row-${row}`}
          className="w-12 h-8 border-r border-b border-gray-300 bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700"
        >
          {row + 1}
        </div>
      );

      // Row cells
      for (let col = 0; col < COLS; col++) {
        const cellId = getCellId(row, col);
        const cellData = data[cellId] || { value: '' };
        
        cells.push(
          <Cell
            key={cellId}
            id={cellId}
            value={cellData.value}
            formula={cellData.formula}
            isSelected={selectedCell === cellId}
            isEditing={isEditing && selectedCell === cellId}
            onClick={() => handleCellClick(cellId)}
            onDoubleClick={() => handleCellDoubleClick(cellId)}
            onContextMenu={(e) => handleContextMenu(e, cellId)}
            onUpdate={(value, formula) => updateCell(cellId, value, formula)}
            onStopEditing={() => setIsEditing(false)}
            style={cellData.style}
          />
        );
      }

      rows.push(
        <div key={row} className="flex">
          {cells}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <Toolbar 
        selectedCell={selectedCell}
        cellData={data[selectedCell]}
        onUpdateCell={updateCell}
      />
      
      <FormulaBar
        selectedCell={selectedCell}
        value={data[selectedCell]?.formula || data[selectedCell]?.value || ''}
        onUpdate={(value) => {
          if (value.startsWith('=')) {
            updateCell(selectedCell, value, value);
          } else {
            updateCell(selectedCell, value);
          }
        }}
      />

      <div 
        ref={spreadsheetRef}
        className="flex-1 overflow-auto focus:outline-none"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Column headers */}
        <div className="sticky top-0 z-10 flex bg-white">
          <div className="w-12 h-8 border-r border-gray-300 bg-gray-100"></div>
          {renderHeaders()}
        </div>

        {/* Rows */}
        <div className="relative">
          {renderRows()}
        </div>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          cellId={contextMenu.cell}
          onClose={closeContextMenu}
          onAction={(action) => {
            console.log(`Action: ${action} on cell ${contextMenu.cell}`);
            closeContextMenu();
          }}
        />
      )}
    </div>
  );
};
