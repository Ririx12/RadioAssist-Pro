// RadioAssist Pro - Protocol Templates Tests
import { describe, it, expect } from 'vitest';
import { getProtocolTemplates } from './protocolTemplates';

describe('Protocol Templates', () => {
  const XENETIX = 'Xenetix 350';

  it('returns templates with contrast agent injected in strings', () => {
    const templates = getProtocolTemplates(XENETIX);
    expect(templates.crane_injecte).toContain(XENETIX);
    expect(templates.ap_injecte).toContain(XENETIX);
  });

  it('provides all expected keys', () => {
    const templates = getProtocolTemplates(XENETIX);
    const expectedKeys = [
      'crane_natif',
      'crane_injecte',
      'crane_natif_injecte',
      'angioTSA_injecte',
      'crane_angioTSA_injecte',
      'sinus_natif',
      'massifFacial_natif',
      'massifFacial_injecte',
      'orbites_natif_injecte',
      'orbites_injecte',
      'rochers_natif',
      'thorax_natif',
      'thorax_natif_injecte',
      'thorax_mixte',
      'ap_natif',
      'ap_injecte',
      'ap_natif_injecte',
      'tap_injecte',
      'aorte_ap_mi_injecte',
    ];
    expectedKeys.forEach((key) => expect(templates[key]).toBeTruthy());
  });
});
