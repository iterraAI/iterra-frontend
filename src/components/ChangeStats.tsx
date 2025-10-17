import { FileCode, FilePlus, FileMinus, TrendingUp } from 'lucide-react';

interface ChangeStatsProps {
  stats: {
    filesChanged: number;
    linesAdded: number;
    linesRemoved: number;
    totalChanges: number;
    percentageChanged: number;
    newFiles?: number;
    deletedFiles?: number;
  };
}

export default function ChangeStats({ stats }: ChangeStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <FileCode className="text-blue-600" size={20} />
          <span className="text-2xl font-bold text-blue-700">{stats.filesChanged}</span>
        </div>
        <p className="text-sm text-blue-600 font-medium">Files Changed</p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <FilePlus className="text-green-600" size={20} />
          <span className="text-2xl font-bold text-green-700">+{stats.linesAdded}</span>
        </div>
        <p className="text-sm text-green-600 font-medium">Lines Added</p>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
        <div className="flex items-center justify-between mb-2">
          <FileMinus className="text-red-600" size={20} />
          <span className="text-2xl font-bold text-red-700">-{stats.linesRemoved}</span>
        </div>
        <p className="text-sm text-red-600 font-medium">Lines Removed</p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between mb-2">
          <TrendingUp className="text-purple-600" size={20} />
          <span className="text-2xl font-bold text-purple-700">{stats.percentageChanged}%</span>
        </div>
        <p className="text-sm text-purple-600 font-medium">Changed</p>
      </div>

      {(stats.newFiles || 0) > 0 && (
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg border border-cyan-200">
          <div className="flex items-center justify-between mb-2">
            <FilePlus className="text-cyan-600" size={20} />
            <span className="text-2xl font-bold text-cyan-700">{stats.newFiles}</span>
          </div>
          <p className="text-sm text-cyan-600 font-medium">New Files</p>
        </div>
      )}

      {(stats.deletedFiles || 0) > 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <FileMinus className="text-gray-600" size={20} />
            <span className="text-2xl font-bold text-gray-700">{stats.deletedFiles}</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Deleted Files</p>
        </div>
      )}
    </div>
  );
}

