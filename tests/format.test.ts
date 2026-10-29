import { test } from 'node:test';
import assert from 'node:assert/strict';
import { amountToMinorUnits, formatMoney } from '../src/lib/format';

test('converts positive decimal currency to minor units', () => {
  assert.equal(amountToMinorUnits('125.50'), 12550);
  assert.equal(amountToMinorUnits('1,000'), 100000);
});
test('rejects invalid or non-positive amounts', () => {
  assert.throws(() => amountToMinorUnits('0'));
  assert.throws(() => amountToMinorUnits('12.345'));
  assert.throws(() => amountToMinorUnits('abc'));
});
test('formats currency', () => {
  assert.match(formatMoney(12345, 'INR'), /123/);
});
