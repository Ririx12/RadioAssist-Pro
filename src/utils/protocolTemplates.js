// RadioAssist Pro - Protocol Templates

/**
 * Get predefined protocol templates for common CT scan scenarios
 * @param {string} contrast - The contrast agent name (e.g., "Xenetix 350")
 * @returns {Object} Object containing all protocol templates
 */
export const getProtocolTemplates = (contrast) => ({
  // ENCÉPHALE (Brain)
  crane_natif:
    "Acquisition volumique spiralée de l'encéphale en collimation submillimétrique. Reconstructions en coupes jointives de 3 mm selon les plans cantho-méatal et coronal.",
  crane_injecte: `Acquisition volumique spiralée de l'encéphale en collimation submillimétrique, avec injection IV bien tolérée de ${contrast}. Reconstructions en coupes jointives de 3 mm selon les plans cantho-méatal et coronal.`,
  crane_natif_injecte: `Acquisition volumique spiralée de l'encéphale en collimation submillimétrique, sans et avec injection IV bien tolérée de ${contrast}. Reconstructions en coupes jointives de 3 mm selon les plans cantho-méatal et coronal.`,

  // ANGIO TSA / WILLIS
  angioTSA_injecte: `Acquisition volumique spiralée de l'encéphale et des axes carotido-vertébraux en collimation submillimétrique, sans et avec injection IV bien tolérée de ${contrast}. Reconstructions en coupes jointives de 3 mm de l'encéphale selon les plans cantho-méatal et frontal. Reconstructions axiales de 5 mm des axes carotido-vertébraux. Reconstructions 2D (MIP et MPR) de l'angioscanner cervical et du cercle de Willis.`,
  crane_angioTSA_injecte: `Acquisition volumique spiralée de l'encéphale et des axes carotido-vertébraux en collimation submillimétrique, sans et avec injection IV bien tolérée de ${contrast}. Reconstructions en coupes jointives de 3 mm de l'encéphale selon les plans cantho-méatal et frontal. Reconstructions axiales de 5 mm des axes carotido-vertébraux. Reconstructions 2D (MIP et MPR) de l'angioscanner cervical et du cercle de Willis.`,

  // MASSIF FACIAL / SINUS / ORBITES / ROCHERS
  sinus_natif:
    "Acquisition volumique spiralée des sinus en collimation submillimétrique. Reconstructions en coupes jointives de 1.5 mm dans le plan axial. Reconstructions 2D (MPR) dans les plans coronal et sagittal.",
  massifFacial_natif:
    "Acquisition volumique spiralée du massif facial en collimation submillimétrique. Reconstructions en coupes jointives de 1.5 mm dans le plan axial. Reconstructions 2D (MPR) dans les plans coronal et sagittal.",
  massifFacial_injecte: `Acquisition volumique spiralée du massif facial en collimation submillimétrique avec injection IV bien tolérée de ${contrast}. Reconstructions en coupes jointives de 1.5 mm dans le plan axial. Reconstructions 2D (MPR) dans les plans coronal et sagittal.`,
  orbites_natif_injecte: `Acquisition volumique spiralée des orbites en collimation submillimétrique sans et avec injection IV bien tolérée de ${contrast}. Reconstructions en coupes jointives de 1.5 mm dans le plan axial. Reconstructions 2D (MPR) dans les plans coronal et sagittal.`,
  orbites_injecte: `Acquisition volumique spiralée des orbites en collimation submillimétrique avec injection IV bien tolérée de ${contrast}. Reconstructions en coupes jointives de 1.5 mm dans le plan axial. Reconstructions 2D (MPR) dans les plans coronal et sagittal.`,
  rochers_natif:
    'Acquisition volumique spiralée des rochers en collimation submillimétrique. Reconstructions en coupes jointives millimétriques dans le plan axial. Reconstructions 2D (MPR) panoramiques et para-axiales.',

  // THORAX
  thorax_natif:
    "Acquisition volumique spiralée en collimation submillimétrique du thorax. Reconstructions en coupes jointives millimétriques dans les plans axial et frontal. Reconstructions 2D (MIP/MinIP) dans le plan axial et reconstructions 2D dans les plans coronal et sagittal de la colonne.",
  thorax_natif_injecte: `Acquisition volumique spiralée en collimation millimétrique du thorax sans et avec injection IV bien tolérée de ${contrast}. Reconstructions en coupes jointives axiales de 5 mm. Reconstructions 2D (MPR) dans les plans coronal et sagittal de la colonne.`,
  thorax_mixte: `Acquisition volumique spiralée en collimation millimétrique du thorax avec injection IV bien tolérée de ${contrast}, phase mixte (3 min). Reconstructions en coupes jointives axiales de 5 mm. Reconstructions 2D (MPR) dans les plans coronal et sagittal de la colonne.`,

  // ABDOMEN PELVIS (AP)
  ap_natif:
    "Acquisition volumique spiralée en collimation millimétrique de l'abdomen et du pelvis sans injection de produit de contraste IV. Reconstructions en coupes jointives axiales de 5 mm. Reconstructions 2D (MPR) dans les plans coronal et sagittal de la colonne.",
  ap_injecte: `Acquisition volumique spiralée en collimation millimétrique de l'abdomen et du pelvis avec injection IV bien tolérée de ${contrast}. Reconstructions en coupes jointives axiales de 5 mm. Reconstructions 2D (MPR) dans les plans coronal et sagittal de la colonne.`,
  ap_natif_injecte: `Acquisition volumique spiralée en collimation millimétrique de l'abdomen et du pelvis sans et avec injection IV bien tolérée de ${contrast}. Reconstructions en coupes jointives axiales de 5 mm. Reconstructions 2D (MPR) dans les plans coronal et sagittal de la colonne.`,

  // TAP
  tap_injecte: `Acquisition volumique spiralée en collimation millimétrique du thorax, de l'abdomen et du pelvis avec injection IV bien tolérée de ${contrast}. Reconstructions en coupes jointives de 5 mm dans le plan axial. Reconstructions 2D (MPR) dans les plans coronal et sagittal de la colonne.`,

  // AORTE / MEMBRES INF
  aorte_ap_mi_injecte: `Acquisition volumique spiralée en collimation millimétrique du thorax, de l'abdomen, du pelvis et des membres inférieurs après injection IV bien tolérée de ${contrast}. Reconstructions en coupes jointives axiales de 5 mm. Reconstructions 2D (MPR, MIP) multiplanaires et reconstruction 3D (VRT).`,
});
