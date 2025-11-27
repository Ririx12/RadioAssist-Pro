// RadioAssist Pro - Footer Component
import React from 'react';
import { Check, ClipboardCheck } from 'lucide-react';

/**
 * Fixed footer with global copy button
 * @param {Object} props
 * @param {Function} props.onCopy - Handler for copy button click
 * @param {boolean} props.copySuccess - Whether copy was successful (shows success state)
 */
const Footer = ({ onCopy, copySuccess }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg z-50">
    <div className="max-w-6xl mx-auto flex flex-col items-center">
      <button
        onClick={onCopy}
        className={`w-full md:w-1/2 py-3 rounded-xl text-lg font-bold flex items-center justify-center gap-3 shadow-lg transition-colors ${
          copySuccess ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
        }`}
        aria-label="Copier l'indication et le protocole"
      >
        {copySuccess ? (
          <>
            <Check size={24} /> Copié !
          </>
        ) : (
          <>
            <ClipboardCheck size={24} /> TOUT COPIER
          </>
        )}
      </button>
    </div>
  </div>
);

export default Footer;
