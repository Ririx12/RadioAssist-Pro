// RadioAssist Pro - Medical Disclaimer Component
import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';

/**
 * Medical disclaimer banner warning about AI-generated content
 * @param {Object} props
 * @param {Function} props.onClose - Handler for close button click
 */
const MedicalDisclaimer = ({ onClose }) => (
  <div className="max-w-6xl mx-auto mb-8 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-amber-900 text-base mb-1">Avertissement Médical</h3>
          <p className="text-sm text-amber-800" style={{ lineHeight: 1.6 }}>
            Cet outil utilise l'intelligence artificielle pour assister la reformulation et la suggestion de protocoles.
            <strong className="font-semibold">
              {' '}Le contenu généré doit être systématiquement vérifié et validé par un radiologue qualifié.
            </strong>
            {' '}L'IA ne remplace pas le jugement médical professionnel et ne constitue pas un avis médical.
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-amber-600 hover:text-amber-800 transition-colors flex-shrink-0"
        aria-label="Fermer l'avertissement"
      >
        <Check size={20} />
      </button>
    </div>
  </div>
);

export default MedicalDisclaimer;
