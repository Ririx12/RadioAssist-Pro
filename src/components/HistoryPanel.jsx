// RadioAssist Pro - History Panel Component
import React from 'react';
import { Clock, RotateCcw, Trash2, X } from 'lucide-react';
import { formatHistoryTimestamp } from '../services/history';

/**
 * History panel showing past reformulations
 * @param {Object} props
 * @param {Array} props.history - Array of history items
 * @param {Function} props.onRestore - Handler to restore a history item
 * @param {Function} props.onDelete - Handler to delete a history item
 * @param {Function} props.onClear - Handler to clear all history
 * @param {Function} props.onClose - Handler to close the panel
 */
const HistoryPanel = ({ history, onRestore, onDelete, onClear, onClose }) => {
  if (!history || history.length === 0) {
    return (
      <div className="max-w-6xl mx-auto mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-slate-600" />
            <h2 className="text-2xl font-bold text-slate-800" style={{ lineHeight: 1.2 }}>
              Historique
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
            aria-label="Fermer l'historique"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-slate-500 text-center py-8 italic">
          Aucun historique disponible. Les reformulations seront enregistrées automatiquement.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-slate-600" />
          <h2 className="text-2xl font-bold text-slate-800" style={{ lineHeight: 1.2 }}>
            Historique
          </h2>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {history.length} {history.length === 1 ? 'élément' : 'éléments'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              aria-label="Tout effacer"
            >
              Tout effacer
            </button>
          )}
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
            aria-label="Fermer l'historique"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {history.map((item) => (
          <div
            key={item.id}
            className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-500">{formatHistoryTimestamp(item.timestamp)}</span>
                  {item.protocol && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                      Auto-protocole
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Entrée</p>
                    <p className="text-sm text-slate-700 line-clamp-2">{item.input}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Reformulation</p>
                    <p className="text-sm text-slate-800 font-medium line-clamp-3 whitespace-pre-wrap">
                      {item.output}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onRestore(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Restaurer cette reformulation"
                  title="Restaurer"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Supprimer cet élément"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
