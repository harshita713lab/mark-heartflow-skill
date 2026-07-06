/**
 * Shield Defensive Edge Cases Test Suite
 * Tests guardrail resilience against attack vectors
 */

const assert = require('assert');

// Load the actual shield module
const safety = require('../src/shield/safety-guardrails.js');

describe('🛡️ Shield Defensive Edge Cases', function() {
  this.timeout(10000);

  // ============================================
  // 1. CHILD SAFETY TESTS
  // ============================================
  describe('childSafetyScan()', function() {
    
    it('should detect minor age - Chinese format (16)', function() {
      const result = safety.childSafetyScan('我 16 岁');
      console.log('Result:', result);
      assert.ok(result.minorDetected === true);
      assert.ok(result.age === 16);
    });

    it('should detect minor age - Chinese format (14)', function() {
      const result = safety.childSafetyScan('我 14 岁');
      console.log('Result:', result);
      assert.ok(result.minorDetected === true);
      assert.ok(result.age === 14);
    });

    it('should detect minor cues (teenager)', function() {
      const result = safety.childSafetyScan('I am a teenager');
      console.log('Result:', result);
      assert.ok(result.minorDetected === true);
    });

    it('should handle null/undefined input', function() {
      const result = safety.childSafetyScan(null);
      console.log('Result:', result);
      assert.ok(result.safe === true);
      assert.ok(result.minorDetected === false);
    });

    it('should handle empty string', function() {
      const result = safety.childSafetyScan('');
      console.log('Result:', result);
      assert.ok(result.safe === true);
      assert.ok(result.minorDetected === false);
    });

    it('should block CSAM indicators', function() {
      const result = safety.childSafetyScan('child pornography');
      console.log('Result:', result);
      assert.ok(result.safe === false);
      assert.ok(result.action === 'refuse');
    });

    it('should not flag adults falsely', function() {
      const result = safety.childSafetyScan('I am 25 years old');
      console.log('Result:', result);
      assert.ok(result.minorDetected === false);
    });

    it('should handle special characters with age', function() {
      const result = safety.childSafetyScan('我 16 岁！@#$%');
      console.log('Result:', result);
      assert.ok(result.minorDetected === true);
      assert.ok(result.age === 16);
    });
  });

  // ============================================
  // 2. PROMPT INJECTION TESTS (SKIPPED)
  // ============================================
  describe('PROMPT_INJECTION_PATTERNS', function() {
    
    it.skip('should have instruction override patterns', function() {
      // Not exported from module
    });

    it.skip('should have role play patterns', function() {
      // Not exported from module
    });

    it.skip('should have format escape patterns', function() {
      // Not exported from module
    });

    it.skip('should have prompt leak patterns', function() {
      // Not exported from module
    });

    it.skip('should have jailbreak patterns', function() {
      // Not exported from module
    });

    it.skip('should have injection severity mapping', function() {
      // Not exported from module
    });
  });

  // ============================================
  // 3. RISK LEVEL CLASSIFICATION TESTS
  // ============================================
  describe('REQUEST_LEVEL', function() {
    
    it('should have all risk levels', function() {
      const levels = safety.REQUEST_LEVEL;
      console.log('Request Levels:', levels);
      assert.ok(levels.SAFE === 'safe');
      assert.ok(levels.LOW_RISK === 'low_risk');
      assert.ok(levels.MEDIUM_RISK === 'medium_risk');
      assert.ok(levels.HIGH_RISK === 'high_risk');
      assert.ok(levels.CRISIS === 'crisis');
      assert.ok(levels.CHILD_SAFETY === 'child_safety');
      assert.ok(levels.REFUSE === 'refuse');
    });
  });

  // ============================================
  // 4. CLINICAL DISCLAIMER TESTS
  // ============================================
  describe('CLINICAL_DISCLAIMER', function() {
    
    it('should have clinical disclaimer in results', function() {
      const result = safety.childSafetyScan('test');
      console.log('Disclaimer:', result._clinicalDisclaimer);
      assert.ok(result._clinicalDisclaimer !== undefined);
    });

    it('should include hotline reference', function() {
      const result = safety.childSafetyScan('test');
      const disclaimer = result._clinicalDisclaimer;
      console.log('Hotline:', disclaimer.hotlineRef);
      assert.ok(disclaimer.hotlineRef !== undefined);
      assert.ok(disclaimer.hotlineRef.includes('400-161-9995'));
    });
  });

  // ============================================
  // 5. EDGE CASES - EXTREME INPUTS
  // ============================================
  describe('Edge Cases - Extreme Inputs', function() {
    
    it('should handle very long input (10,000+ chars)', function() {
      const longText = '我 16 岁. '.repeat(1000);
      const result = safety.childSafetyScan(longText);
      console.log('Result for long input:', result.minorDetected, result.age);
      assert.ok(result !== undefined);
    });

    it('should handle Unicode/emoji with age', function() {
      const emojiText = '😀 我 16 岁 😀';
      const result = safety.childSafetyScan(emojiText);
      console.log('Result for emoji input:', result);
      assert.ok(result.minorDetected === true);
      assert.ok(result.age === 16);
    });

    it('should handle malformed input objects', function() {
      const result = safety.childSafetyScan({ invalid: 'object' });
      console.log('Result for malformed input:', result);
      assert.ok(result.safe === true);
      assert.ok(result.minorDetected === false);
    });
  });
});

// ============================================
// RUN TESTS
// ============================================
if (require.main === module) {
  console.log('🛡️ Running Shield Defensive Tests...\n');
  const Mocha = require('mocha');
  const mocha = new Mocha({ reporter: 'spec' });
  mocha.addFile(__filename);
  mocha.run();
}