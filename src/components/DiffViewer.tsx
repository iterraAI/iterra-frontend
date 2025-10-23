import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import * as Diff from 'diff';

interface DiffViewerProps {
  filename: string;
  oldContent: string;
  newContent: string;
  action: 'create' | 'modify' | 'delete';
}

interface DiffLine {
  lineNumber: number | null;
  content: string;
  type: 'added' | 'removed' | 'unchanged';
}

export default function DiffViewer({ filename, oldContent, newContent, action }: DiffViewerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate proper diff using the diff library
  const calculateDiff = () => {
    if (action === 'create') {
      const lines = (newContent || '').split('\n');
      return {
        oldLines: [] as DiffLine[],
        newLines: lines.map((content, index) => ({
          lineNumber: index + 1,
          content,
          type: 'added' as const
        }))
      };
    }

    if (action === 'delete') {
      const lines = (oldContent || '').split('\n');
      return {
        oldLines: lines.map((content, index) => ({
          lineNumber: index + 1,
          content,
          type: 'removed' as const
        })),
        newLines: [] as DiffLine[]
      };
    }

    // For modify action, calculate line-level diff
    const changes = Diff.diffLines(oldContent || '', newContent || '');
    const oldLines: DiffLine[] = [];
    const newLines: DiffLine[] = [];
    let oldLineNum = 1;
    let newLineNum = 1;

    changes.forEach(change => {
      const lines = change.value.split('\n');
      // Remove last empty line if it exists (from split)
      if (lines[lines.length - 1] === '') {
        lines.pop();
      }

      if (change.added) {
        // Added lines - only show in NEW side
        lines.forEach(content => {
          newLines.push({
            lineNumber: newLineNum++,
            content,
            type: 'added'
          });
        });
      } else if (change.removed) {
        // Removed lines - only show in OLD side
        lines.forEach(content => {
          oldLines.push({
            lineNumber: oldLineNum++,
            content,
            type: 'removed'
          });
        });
      } else {
        // Unchanged lines - show in both sides
        lines.forEach(content => {
          oldLines.push({
            lineNumber: oldLineNum++,
            content,
            type: 'unchanged'
          });
          newLines.push({
            lineNumber: newLineNum++,
            content,
            type: 'unchanged'
          });
        });
      }
    });

    return { oldLines, newLines };
  };

  const { oldLines, newLines } = calculateDiff();

  // Calculate statistics
  const stats = {
    added: newLines.filter(l => l.type === 'added').length,
    removed: oldLines.filter(l => l.type === 'removed').length,
    unchanged: oldLines.filter(l => l.type === 'unchanged').length
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div 
        className="bg-gray-100 px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <span className="font-mono text-sm font-semibold text-gray-900">{filename}</span>
          <span className="text-xs text-gray-600">
            {stats.added > 0 && <span className="text-green-700">+{stats.added} </span>}
            {stats.removed > 0 && <span className="text-red-700">-{stats.removed} </span>}
          </span>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded font-semibold ${
            action === 'create'
              ? 'bg-green-100 text-green-700'
              : action === 'delete'
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {action}
        </span>
      </div>

      {/* Diff Content */}
      {isExpanded && (
        <div className="grid grid-cols-2 divide-x divide-gray-300">
          {/* OLD (Left Side - Deletions) */}
          <div className="bg-red-50">
            <div className="bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 border-b border-red-200">
              {action === 'create' ? 'No previous content' : 'Original'}
            </div>
            <div className="max-h-96 overflow-auto">
              {action === 'create' ? (
                <div className="p-4 text-center text-gray-500 italic">
                  New file - no previous content
                </div>
              ) : (
                <table className="w-full font-mono text-xs">
                  <tbody>
                    {oldLines.map((line, index) => (
                      <tr
                        key={`old-${index}`}
                        className={line.type === 'removed' ? 'bg-red-100' : 'bg-white'}
                      >
                        <td className="w-10 px-2 py-0.5 text-right text-gray-500 select-none border-r border-red-200">
                          {line.lineNumber}
                        </td>
                        <td className="px-2 py-0.5">
                          {line.type === 'removed' && <span className="text-red-700 font-bold">- </span>}
                          <span className={line.type === 'removed' ? 'bg-red-200 text-gray-900 font-medium' : 'text-gray-800'}>
                            {line.content}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* NEW (Right Side - Additions) */}
          <div className="bg-green-50">
            <div className="bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 border-b border-green-200">
              {action === 'delete' ? 'File will be deleted' : 'Modified'}
            </div>
            <div className="max-h-96 overflow-auto">
              {action === 'delete' ? (
                <div className="p-4 text-center text-gray-500 italic">
                  File will be deleted
                </div>
              ) : (
                <table className="w-full font-mono text-xs">
                  <tbody>
                    {newLines.map((line, index) => (
                      <tr
                        key={`new-${index}`}
                        className={line.type === 'added' ? 'bg-green-100' : 'bg-white'}
                      >
                        <td className="w-10 px-2 py-0.5 text-right text-gray-500 select-none border-r border-green-200">
                          {line.lineNumber}
                        </td>
                        <td className="px-2 py-0.5">
                          {line.type === 'added' && <span className="text-green-700 font-bold">+ </span>}
                          <span className={line.type === 'added' ? 'bg-green-200 text-gray-900 font-medium' : 'text-gray-800'}>
                            {line.content}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
