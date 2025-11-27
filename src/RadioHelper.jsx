// RadioAssist Pro - Main Application Component
import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, Activity, Zap, Wand2, ScanEye, MessageCircleHeart, Clock } from 'lucide-react';

// Components
import Header from './components/Header';
import MedicalDisclaimer from './components/MedicalDisclaimer';
import SettingsPanel from './components/SettingsPanel';
import HistoryPanel from './components/HistoryPanel';
import CheckBox from './components/CheckBox';
import Footer from './components/Footer';

// Services
import { reformulateIndication } from './services/openai';
import { callGemini } from './services/gemini';
import { copyToClipboard } from './services/clipboard';
import { getHistory, saveToHistory, deleteHistoryItem, clearHistory } from './services/history';
import { loadSettings, saveSettings } from './services/settings';

// Utils
import { getProtocolTemplates } from './utils/protocolTemplates';
import {
  CONTRAST_AGENTS,
  NOTIFICATION_DURATION_MS,
  AUTO_PROTOCOL_NOTIFICATION_DURATION_MS,
  GEMINI_PROMPTS,
} from './utils/constants';
import { validateCodeJaune, getCodeJauneErrorMessage } from './utils/codeJauneValidator';

export default function RadioHelper() {
  // Configuration
  const DEFAULT_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
  const DEFAULT_GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';

  // UI state
  const [apiKey, setApiKey] = useState('');
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  // Reformulation
  const [indicationInput, setIndicationInput] = useState('');
  const [indicationOutput, setIndicationOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [autoProtocolApplied, setAutoProtocolApplied] = useState(false);

  // Gemini
  const [geminiAnalysis, setGeminiAnalysis] = useState('');
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [patientExplanation, setPatientExplanation] = useState('');
  const [isPatientLoading, setIsPatientLoading] = useState(false);

  // Protocol
  const [contrastAgent, setContrastAgent] = useState(CONTRAST_AGENTS.XENETIX);
  const [globalCopySuccess, setGlobalCopySuccess] = useState(false);
  const [protocolOutput, setProtocolOutput] = useState('');

  // Régions Principales
  const [mainRegions, setMainRegions] = useState({
    totalBody: false,
    ctap: false,
    tap: false,
    ap: false,
    pelvis: false,
    thorax: false,
    aorte: false,
    articulations: false,
  });

  // Tête et Cou
  const [headRegions, setHeadRegions] = useState({
    crane: false,
    massifFacial: false,
    sinus: false,
    rochers: false,
    orbites: false,
    angioTSA: false,
  });

  // Sous-options Aorte
  const [aorteSub, setAorteSub] = useState({
    thoracique: false,
    tap: false,
    ap: false,
    ap_mi: false,
  });

  // Sous-options Articulations
  const [jointType, setJointType] = useState({
    main: false,
    coude: false,
    epaule: false,
    pied: false,
    genou: false,
    hanche: false,
  });

  const [jointSide, setJointSide] = useState({
    droite: false,
    gauche: false,
  });

  // Phases d'injection
  const [phases, setPhases] = useState({
    natif: false,
    arteriel: false,
    portal: false,
    mixte: false,
    tardif: false,
  });

  const [tardifDelay, setTardifDelay] = useState('');

  // Load settings & history on mount
  useEffect(() => {
    setHistory(getHistory());
    const saved = loadSettings();
    setApiKey(saved.apiKey || DEFAULT_API_KEY);
    setGoogleApiKey(saved.googleApiKey || DEFAULT_GOOGLE_API_KEY);
  }, []);

  // Persist keys when they change (opt-in, empty values are ignored)
  useEffect(() => {
    const payload = {};
    if (apiKey) payload.apiKey = apiKey;
    if (googleApiKey) payload.googleApiKey = googleApiKey;
    saveSettings(payload);
  }, [apiKey, googleApiKey]);

  // Protocol generation
  useEffect(() => {
    generateProtocol();
  }, [mainRegions, headRegions, aorteSub, jointType, jointSide, phases, tardifDelay, contrastAgent]);

  const generateProtocol = () => {
    const templates = getProtocolTemplates(contrastAgent);
    let key = '';

    // Signature detection for template matching
    const isNatif = phases.natif;
    const isInjecte = phases.arteriel || phases.portal;
    const isMixte = phases.mixte;
    const isNatifEtInjecte = isNatif && isInjecte;

    const suffix = isNatifEtInjecte
      ? '_natif_injecte'
      : isInjecte
      ? '_injecte'
      : isMixte
      ? '_mixte'
      : isNatif
      ? '_natif'
      : '';

    // Head regions
    if (headRegions.crane && headRegions.angioTSA) key = 'crane_angioTSA_injecte';
    else if (headRegions.crane) key = 'crane' + suffix;
    else if (headRegions.sinus) key = 'sinus' + suffix;
    else if (headRegions.massifFacial) key = 'massifFacial' + suffix;
    else if (headRegions.orbites) key = 'orbites' + suffix;
    else if (headRegions.rochers) key = 'rochers' + suffix;
    // Body regions
    else if (mainRegions.tap) key = 'tap' + suffix;
    else if (mainRegions.ap) key = 'ap' + suffix;
    else if (mainRegions.thorax) key = 'thorax' + suffix;
    else if (mainRegions.aorte && aorteSub.ap_mi) key = 'aorte_ap_mi' + suffix;

    // Check if template exists
    if (key && templates[key]) {
      let output = templates[key];
      if (phases.tardif) {
        const delayText = tardifDelay ? `${tardifDelay} min` : 'délai tardif à préciser';
        output = `${output} Phase tardive prévue (${delayText}).`;
      }
      setProtocolOutput(output);
      return;
    }

    // --- Dynamic Fallback ---
    const parts = [];
    if (mainRegions.totalBody) parts.push('corps entier');
    if (mainRegions.ctap) parts.push('cervico-thoraco-abdomino-pelvienne');
    if (mainRegions.tap) parts.push('thoraco-abdomino-pelvienne');
    if (mainRegions.ap) parts.push('abdomino-pelvienne');
    if (mainRegions.pelvis) parts.push('pelvienne');
    if (mainRegions.thorax) parts.push('thoracique');

    if (headRegions.crane) parts.push('encéphalique');
    if (headRegions.massifFacial) parts.push('du massif facial');
    if (headRegions.sinus) parts.push('des sinus');
    if (headRegions.rochers) parts.push('des rochers');
    if (headRegions.orbites) parts.push('des orbites');
    if (headRegions.angioTSA) parts.push('des axes carotido-vertébraux');

    // Aorte
    if (mainRegions.aorte) {
      let aorteText = "de l'aorte";
      if (aorteSub.thoracique) aorteText += ' thoracique';
      else if (aorteSub.tap) aorteText += ' thoraco-abdomino-pelvienne';
      else if (aorteSub.ap) aorteText += ' abdomino-pelvienne';
      else if (aorteSub.ap_mi) aorteText += ' abdomino-pelvienne et des membres inférieurs';
      parts.push(aorteText);
    }

    // Articulations
    if (mainRegions.articulations) {
      const activeJoints = Object.keys(jointType).filter((k) => jointType[k]);
      let sideText = '';
      if (jointSide.droite && jointSide.gauche) sideText = 'bilatéral';
      else if (jointSide.droite) sideText = 'droit';
      else if (jointSide.gauche) sideText = 'gauche';

      activeJoints.forEach((joint) => {
        let text = '';
        switch (joint) {
          case 'main':
            text = 'de la main';
            break;
          case 'coude':
            text = 'du coude';
            break;
          case 'epaule':
            text = "de l'épaule";
            break;
          case 'pied':
            text = 'du pied';
            break;
          case 'genou':
            text = 'du genou';
            break;
          case 'hanche':
            text = 'de la hanche';
            break;
          default:
            text = '';
        }
        if (sideText === 'bilatéral') {
          if (joint === 'epaule') text = "des épaules bilatérales";
          else if (joint === 'main') text = 'des mains bilatérales';
          else if (joint === 'hanche') text = 'des hanches bilatérales';
          else text = text.replace('du ', 'des ') + 's bilatéraux';
          if (joint === 'genou') text = 'des genoux bilatéraux';
        } else if (sideText) {
          let adj = sideText;
          if (sideText === 'droit' && (joint === 'main' || joint === 'epaule' || joint === 'hanche')) adj = 'droite';
          if (sideText === 'gauche' && (joint === 'main' || joint === 'epaule' || joint === 'hanche')) adj = 'gauche';
          text += ` ${adj}`;
        }
        parts.push(text);
      });
    }

    if (parts.length === 0 && !Object.values(phases).some((v) => v)) {
      setProtocolOutput('');
      return;
    }

    let sentence = 'Acquisition tomodensitométrique';
    if (parts.length > 0) {
      const regionString = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} et ${parts.slice(-1)}` : parts[0];
      sentence += ` ${regionString}`;
    }

    const selectedPhases = [];
    if (phases.natif) selectedPhases.push('sans injection');
    if (phases.arteriel || phases.portal) selectedPhases.push(`avec injection de ${contrastAgent}`);
    if (phases.mixte) selectedPhases.push(`injection biphasique de ${contrastAgent}`);
    if (phases.tardif)
      selectedPhases.push(`phase tardive ${tardifDelay ? `(${tardifDelay} min)` : '(délai à préciser)'}`);

    if (selectedPhases.length > 0) {
      const phasesText = selectedPhases.join(' et ');
      sentence += ` ${phasesText}`;
    }

    sentence += '.';
    setProtocolOutput(sentence);
  };

  // Handlers
  const handleReformulate = async () => {
    if (!apiKey) {
      setErrorMsg('Veuillez configurer la clé API dans les paramètres.');
      return;
    }
    if (!indicationInput.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    setIndicationOutput('');
    setGeminiAnalysis('');
    setAutoProtocolApplied(false);

    try {
      const result = await reformulateIndication(apiKey, indicationInput);
      setIndicationOutput(result.reformulation);

      if (result.protocol) {
        applySuggestedProtocol(result.protocol);
      }

      saveToHistory(indicationInput, result.reformulation, result.protocol);
      setHistory(getHistory());
    } catch (err) {
      console.error(err);
      setErrorMsg('Erreur: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreHistory = (item) => {
    setIndicationInput(item.input);
    setIndicationOutput(item.output);

    if (item.protocol) {
      applySuggestedProtocol(item.protocol);
    }

    setShowHistory(false);
  };

  const handleDeleteHistory = (id) => {
    deleteHistoryItem(id);
    setHistory(getHistory());
  };

  const handleClearHistory = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer tout l’historique ?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const applySuggestedProtocol = (suggestion) => {
    const newRegions = {
      totalBody: suggestion.regions?.totalBody || false,
      ctap: suggestion.regions?.ctap || false,
      tap: suggestion.regions?.tap || false,
      ap: suggestion.regions?.ap || false,
      pelvis: suggestion.regions?.pelvis || false,
      thorax: suggestion.regions?.thorax || false,
      aorte: false,
      articulations: suggestion.regions?.articulations || false,
    };

    const newHead = {
      crane: suggestion.regions?.crane || false,
      massifFacial: suggestion.regions?.massifFacial || false,
      sinus: suggestion.regions?.sinus || false,
      rochers: suggestion.regions?.rochers || false,
      orbites: suggestion.regions?.orbites || false,
      angioTSA: suggestion.regions?.angioTSA || false,
    };

    setMainRegions((prev) => ({ ...prev, ...newRegions }));
    setHeadRegions((prev) => ({ ...prev, ...newHead }));

    const newPhases = {
      natif: suggestion.phases?.natif || false,
      arteriel: suggestion.phases?.arteriel || false,
      portal: suggestion.phases?.portal || false,
      mixte: suggestion.phases?.mixte || false,
      tardif: suggestion.phases?.tardif || false,
    };
    setPhases((prev) => ({ ...prev, ...newPhases }));
    if (suggestion.phases?.tardif && suggestion.phases?.tardifDelay) {
      setTardifDelay(suggestion.phases.tardifDelay);
    }

    setAutoProtocolApplied(true);
    setTimeout(() => setAutoProtocolApplied(false), AUTO_PROTOCOL_NOTIFICATION_DURATION_MS);
  };

  const handleGeminiClinicalAnalysis = async () => {
    if (!indicationOutput) return;
    if (!googleApiKey) {
      setGeminiAnalysis('⚠️ Clé API Google Gemini manquante. Configurez-la dans les paramètres.');
      return;
    }

    setIsGeminiLoading(true);
    try {
      const prompt = GEMINI_PROMPTS.CLINICAL_ANALYSIS(indicationOutput);
      const result = await callGemini(googleApiKey, prompt);
      setGeminiAnalysis(result);
    } catch (err) {
      setGeminiAnalysis('Erreur: ' + err.message);
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const handlePatientExplanation = async () => {
    if (!protocolOutput && !indicationOutput) return;
    if (!googleApiKey) {
      setPatientExplanation('⚠️ Clé API Google Gemini manquante. Configurez-la dans les paramètres.');
      return;
    }

    setIsPatientLoading(true);
    try {
      const prompt = GEMINI_PROMPTS.PATIENT_EXPLANATION(protocolOutput, indicationOutput || indicationInput);
      const result = await callGemini(googleApiKey, prompt);
      setPatientExplanation(result);
    } catch (err) {
      setPatientExplanation('Erreur: ' + err.message);
    } finally {
      setIsPatientLoading(false);
    }
  };

  const handleGlobalCopy = () => {
    const validation = validateCodeJaune(indicationOutput);

    if (validation.isCodeJaune && !validation.isValid) {
      const warning = getCodeJauneErrorMessage(validation.missingFields);
      alert(warning);
      return;
    }

    const disclaimer = '⚠️ AVERTISSEMENT: Contenu généré par IA - Vérification médicale requise\n\n';
    const textToCopy = `${disclaimer}Indication:\n${indicationOutput || '(Indication manquante)'}\n\nTechnique:\n${
      protocolOutput || '(Protocole manquant)'
    }`;
    copyToClipboard(textToCopy);
    setGlobalCopySuccess(true);
    setTimeout(() => setGlobalCopySuccess(false), NOTIFICATION_DURATION_MS);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8 pb-24" style={{ lineHeight: 1.5 }}>
      <Header
        onSettingsClick={() => setShowSettings(!showSettings)}
        onHistoryClick={() => setShowHistory(!showHistory)}
        historyCount={history.length}
      />

      {showDisclaimer && <MedicalDisclaimer onClose={() => setShowDisclaimer(false)} />}

      {showHistory && (
        <HistoryPanel
          history={history}
          onRestore={handleRestoreHistory}
          onDelete={handleDeleteHistory}
          onClear={handleClearHistory}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showSettings && (
        <SettingsPanel
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          googleApiKey={googleApiKey}
          onGoogleApiKeyChange={setGoogleApiKey}
          onClose={() => setShowSettings(false)}
        />
      )}

      <main className="max-w-6xl mx-auto space-y-12 md:space-y-20">
        {/* REFORMULATION SECTION */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-blue-50/50 p-4 border-b border-blue-100 flex items-center gap-2">
            <Zap size={20} className="text-blue-600" />
            <h2 className="text-3xl font-bold text-blue-900" style={{ lineHeight: 1.2 }}>
              Reformulation + Auto-Protocole
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">Dictée brute</label>
              <textarea
                value={indicationInput}
                onChange={(e) => setIndicationInput(e.target.value)}
                placeholder="Ex: Suspicion appendicite..."
                className="flex-1 min-h-[150px] w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
              <button
                onClick={handleReformulate}
                disabled={isLoading || !indicationInput}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg disabled:opacity-50 font-medium flex justify-center items-center gap-2 transition-colors shadow-sm"
                aria-label="Reformuler l'indication médicale"
              >
                {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <Wand2 size={18} />} Reformuler
              </button>
              {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
            </div>
            <div className="flex flex-col gap-2 relative">
              <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">Résultat</label>
              <div className="flex-1 rounded-xl border border-green-200 bg-green-50/20 p-4 relative min-h-[150px]">
                {indicationOutput ? (
                  <p className="leading-relaxed whitespace-pre-line text-slate-800 font-medium">{indicationOutput}</p>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">En attente...</div>
                )}
                {autoProtocolApplied && (
                  <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <Wand2 size={12} /> Protocole appliqué !
                  </div>
                )}
              </div>
              {indicationOutput && (
                <div className="flex gap-2">
                  <button
                    onClick={handleGeminiClinicalAnalysis}
                    disabled={isGeminiLoading}
                    className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                    aria-label="Générer les points de vigilance clinique"
                  >
                    {isGeminiLoading ? <RefreshCw className="animate-spin" size={14} /> : <ScanEye size={16} />}{' '}
                    Points de vigilance
                  </button>
                </div>
              )}
              {geminiAnalysis && (
                <div className="mt-2 bg-indigo-600 text-white text-xs p-3 rounded-lg shadow-inner whitespace-pre-line">
                  {geminiAnalysis}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PROTOCOL SECTION */}
        <section
          className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-colors duration-300 ${
            autoProtocolApplied ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200'
          }`}
        >
          <div className="bg-indigo-50/50 p-4 border-b border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-indigo-600" />
              <h2 className="text-3xl font-bold text-indigo-900" style={{ lineHeight: 1.2 }}>
                Protocole
              </h2>
            </div>
            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-indigo-100">
              <button
                onClick={() => setContrastAgent(CONTRAST_AGENTS.XENETIX)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                  contrastAgent === CONTRAST_AGENTS.XENETIX
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-500 hover:bg-indigo-50'
                }`}
              >
                Xenetix 350
              </button>
              <button
                onClick={() => setContrastAgent(CONTRAST_AGENTS.IOMERON)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                  contrastAgent === CONTRAST_AGENTS.IOMERON
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-500 hover:bg-indigo-50'
                }`}
              >
                Iomeron 350
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              {/* Zones Corps */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Corps</h3>
                <CheckBox
                  label="Thorax"
                  checked={mainRegions.thorax}
                  onChange={() => setMainRegions({ ...mainRegions, thorax: !mainRegions.thorax })}
                />
                <CheckBox
                  label="AP"
                  checked={mainRegions.ap}
                  onChange={() => setMainRegions({ ...mainRegions, ap: !mainRegions.ap })}
                />
                <CheckBox
                  label="TAP"
                  checked={mainRegions.tap}
                  onChange={() => setMainRegions({ ...mainRegions, tap: !mainRegions.tap })}
                />
                <CheckBox
                  label="CTAP"
                  checked={mainRegions.ctap}
                  onChange={() => setMainRegions({ ...mainRegions, ctap: !mainRegions.ctap })}
                />
                <CheckBox
                  label="Total Body"
                  checked={mainRegions.totalBody}
                  onChange={() => setMainRegions({ ...mainRegions, totalBody: !mainRegions.totalBody })}
                />

                <div className="pt-1">
                  <CheckBox
                    label="Aorte / Vasc."
                    checked={mainRegions.aorte}
                    onChange={() => setMainRegions({ ...mainRegions, aorte: !mainRegions.aorte })}
                  />
                  {mainRegions.aorte && (
                    <div className="flex flex-col border-l-2 border-indigo-100 ml-2 my-1">
                      {['thoracique', 'tap', 'ap', 'ap_mi'].map((sub) => (
                        <CheckBox
                          key={sub}
                          sub
                          label={sub === 'ap_mi' ? 'AP + Mbs Inf.' : sub.toUpperCase()}
                          checked={aorteSub[sub]}
                          onChange={() => {
                            const ns = { thoracique: false, tap: false, ap: false, ap_mi: false };
                            ns[sub] = !aorteSub[sub];
                            setAorteSub(ns);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Zones Tête & Cou + Articulations */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tête & Cou</h3>
                <CheckBox
                  label="Crâne (Encéphale)"
                  checked={headRegions.crane}
                  onChange={() => setHeadRegions({ ...headRegions, crane: !headRegions.crane })}
                />
                <CheckBox
                  label="Angio TSA / Willis"
                  checked={headRegions.angioTSA}
                  onChange={() => setHeadRegions({ ...headRegions, angioTSA: !headRegions.angioTSA })}
                />
                <CheckBox
                  label="Massif Facial"
                  checked={headRegions.massifFacial}
                  onChange={() => setHeadRegions({ ...headRegions, massifFacial: !headRegions.massifFacial })}
                />
                <CheckBox
                  label="Sinus"
                  checked={headRegions.sinus}
                  onChange={() => setHeadRegions({ ...headRegions, sinus: !headRegions.sinus })}
                />
                <CheckBox
                  label="Rochers"
                  checked={headRegions.rochers}
                  onChange={() => setHeadRegions({ ...headRegions, rochers: !headRegions.rochers })}
                />
                <CheckBox
                  label="Orbites"
                  checked={headRegions.orbites}
                  onChange={() => setHeadRegions({ ...headRegions, orbites: !headRegions.orbites })}
                />

                <div className="pt-2 mt-2 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Os & Artic.</h3>
                  <CheckBox
                    label="Articulations"
                    checked={mainRegions.articulations}
                    onChange={() =>
                      setMainRegions({ ...mainRegions, articulations: !mainRegions.articulations })
                    }
                  />
                  {mainRegions.articulations && (
                    <div className="border-l-2 border-indigo-100 ml-2 my-1 pl-2 space-y-2">
                      <div className="grid grid-cols-2 gap-1">
                        {['main', 'coude', 'epaule', 'pied', 'genou', 'hanche'].map((joint) => (
                          <label
                            key={joint}
                            className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600"
                          >
                            <input
                              type="checkbox"
                              className="accent-indigo-600 rounded-sm w-3 h-3"
                              checked={jointType[joint]}
                              onChange={() => setJointType({ ...jointType, [joint]: !jointType[joint] })}
                            />
                            <span className="text-xs capitalize">{joint}</span>
                          </label>
                        ))}
                      </div>
                      <div className="flex gap-3 pt-1 border-t border-slate-100 mt-1">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            className="accent-indigo-600 w-3 h-3"
                            checked={jointSide.droite}
                            onChange={() => setJointSide({ ...jointSide, droite: !jointSide.droite })}
                          />
                          <span className="text-xs font-bold">D</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            className="accent-indigo-600 w-3 h-3"
                            checked={jointSide.gauche}
                            onChange={() => setJointSide({ ...jointSide, gauche: !jointSide.gauche })}
                          />
                          <span className="text-xs font-bold">G</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Temps */}
              <div className="space-y-1 col-span-2 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Injection</h3>
                <div className="flex flex-wrap gap-2">
                  {['natif', 'arteriel', 'portal'].map((phase) => (
                    <CheckBox
                      key={phase}
                      label={phase.charAt(0).toUpperCase() + phase.slice(1)}
                      checked={phases[phase]}
                      onChange={() => setPhases({ ...phases, [phase]: !phases[phase] })}
                    />
                  ))}
                  <CheckBox
                    label="Mixte (3min)"
                    checked={phases.mixte}
                    onChange={() => setPhases({ ...phases, mixte: !phases.mixte })}
                  />
                  <CheckBox
                    label="Tardif"
                    checked={phases.tardif}
                    onChange={() => {
                      const next = !phases.tardif;
                      setPhases({ ...phases, tardif: next });
                      if (!next) setTardifDelay('');
                    }}
                  />
                </div>
                {phases.tardif && (
                  <div className="flex items-center gap-3 pt-2">
                    <label className="text-xs text-slate-500 font-semibold">Délai (min)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={tardifDelay}
                      onChange={(e) => setTardifDelay(e.target.value)}
                      placeholder="Ex: 5"
                      className="w-24 p-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">Protocole Final</label>
              <div className="flex-1 flex flex-col rounded-xl border border-indigo-200 bg-indigo-50/20 overflow-hidden">
                <textarea
                  readOnly
                  value={protocolOutput}
                  className="w-full h-full bg-transparent border-none text-lg text-slate-800 font-medium focus:ring-0 resize-none min-h-[150px] p-4"
                  placeholder="Sélectionnez des zones..."
                />
                {(protocolOutput || indicationOutput) && (
                  <div className="bg-white border-t border-indigo-100 p-2">
                    <button
                      onClick={handlePatientExplanation}
                      disabled={isPatientLoading}
                      className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                      aria-label="Générer une explication pour le patient"
                    >
                      {isPatientLoading ? <RefreshCw className="animate-spin" size={14} /> : <MessageCircleHeart size={16} />}{' '}
                      Explication Patient
                    </button>
                    {patientExplanation && (
                      <div className="mt-2 bg-blue-600 text-white text-xs p-3 rounded-lg shadow-inner italic">
                        "{patientExplanation}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onCopy={handleGlobalCopy} copySuccess={globalCopySuccess} />
    </div>
  );
}
