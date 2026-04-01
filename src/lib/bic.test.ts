import assert from 'node:assert/strict';
import { validateBIC } from './bic.js';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    console.log(`  ✗ ${name}`);
    console.log(`    ${(e as Error).message}`);
  }
}

console.log('\nBIC Validation Tests (ISO 9362)\n');

// === Valid BICs ===
console.log('Valid BICs:');

test('8-char BIC', () => {
  const r = validateBIC('UBSWCHZH');
  assert.equal(r.valid, true);
  assert.equal(r.bic8, 'UBSWCHZH');
  assert.equal(r.bic11, 'UBSWCHZHXXX');
  assert.equal(r.branch_code, 'XXX');
});

test('11-char BIC with branch', () => {
  const r = validateBIC('UBSWCHZH80A');
  assert.equal(r.valid, true);
  assert.equal(r.bic8, 'UBSWCHZH');
  assert.equal(r.bic11, 'UBSWCHZH80A');
  assert.equal(r.branch_code, '80A');
});

test('Credit Suisse', () => {
  const r = validateBIC('CRESCHZZ');
  assert.equal(r.valid, true);
  assert.equal(r.country_code, 'CH');
});

test('BNP Paribas France', () => {
  const r = validateBIC('BNPAFRPP');
  assert.equal(r.valid, true);
  assert.equal(r.country_code, 'FR');
  assert.equal(r.institution_code, 'BNPA');
});

test('Deutsche Bank', () => {
  const r = validateBIC('DEUTDEDB');
  assert.equal(r.valid, true);
  assert.equal(r.country_code, 'DE');
});

test('DEUTDEDBXXX (explicit XXX branch)', () => {
  const r = validateBIC('DEUTDEDBXXX');
  assert.equal(r.valid, true);
  assert.equal(r.bic8, 'DEUTDEDB');
  assert.equal(r.branch_code, 'XXX');
});

test('lowercase accepted', () => {
  const r = validateBIC('ubswchzh');
  assert.equal(r.valid, true);
  assert.equal(r.bic8, 'UBSWCHZH');
});

test('spaces stripped', () => {
  const r = validateBIC('UBSW CH ZH');
  assert.equal(r.valid, true);
  assert.equal(r.bic8, 'UBSWCHZH');
});

// === Parsing ===
console.log('\nParsing:');

test('institution_code parsed', () => {
  assert.equal(validateBIC('UBSWCHZH80A').institution_code, 'UBSW');
});

test('country_code parsed', () => {
  assert.equal(validateBIC('UBSWCHZH80A').country_code, 'CH');
});

test('location_code parsed', () => {
  assert.equal(validateBIC('UBSWCHZH80A').location_code, 'ZH');
});

test('branch_code parsed', () => {
  assert.equal(validateBIC('UBSWCHZH80A').branch_code, '80A');
});

test('8→11 normalization', () => {
  assert.equal(validateBIC('UBSWCHZH').bic11, 'UBSWCHZHXXX');
});

// === Invalid BICs ===
console.log('\nInvalid BICs:');

test('too short (4 chars)', () => {
  assert.equal(validateBIC('UBSW').valid, false);
  assert.equal(validateBIC('UBSW').error, 'too_short');
});

test('institution starts with digit', () => {
  assert.equal(validateBIC('1BSWCHZH').valid, false);
  assert.equal(validateBIC('1BSWCHZH').error, 'invalid_format');
});

test('too long (14 chars)', () => {
  assert.equal(validateBIC('UBSWCHZH80AXXX').valid, false);
});

test('9 chars (invalid length)', () => {
  assert.equal(validateBIC('UBSWCHZH8').valid, false);
});

test('10 chars (invalid length)', () => {
  assert.equal(validateBIC('UBSWCHZH80').valid, false);
});

test('empty string', () => {
  assert.equal(validateBIC('').valid, false);
});

// === Test BIC ===
console.log('\nTest BIC detection:');

test('location[1]=0 is test BIC', () => {
  const r = validateBIC('UBSWCH20');
  assert.equal(r.valid, true);
  assert.equal(r.is_test_bic, true);
});

test('normal BIC is not test', () => {
  assert.equal(validateBIC('UBSWCHZH').is_test_bic, false);
});

// === Summary ===
console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
