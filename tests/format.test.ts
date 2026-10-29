import assert from 'node:assert/strict';
import { test } from 'node:test';
import { amountToMinorUnits } from '../src/lib/format';

test('converts major currency units to integer minor units', () => {
  assert.equal(amountToMinorUnits('100000'), 10_000_000);
  assert.equal(amountToMinorUnits('1,250.75'), 125_075);
  assert.equal(amountToMinorUnits('.50'), 50);
});

test('rejects zero, negative, malformed and over-precision values', () => {
  for (const value of ['0', '-1', 'abc', '1.234', '', '1,2,3']) {
    assert.throws(() => amountToMinorUnits(value), { name: 'Error' }, `should reject ${value}`);
  }
});

test('rejects amounts outside the configured upper bound', () => {
  assert.throws(() => amountToMinorUnits('1000000001'));
});
