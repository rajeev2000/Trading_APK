export function formatMoney(amountMinor: number, currency = 'INR') {
  const amount = amountMinor / 100;
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function amountToMinorUnits(input: string) {
  const raw = input.trim();
  const validFormat = /^(?:(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{0,2})?|\.\d{1,2})$/.test(raw);
  if (!validFormat) throw new Error('Enter a valid amount with up to two decimal places.');
  const normalized = raw.replace(/,/g, '');
  const major = Number(normalized);
  if (!Number.isFinite(major) || major <= 0 || major > 1_000_000_000) {
    throw new Error('Enter a positive amount within the supported limit.');
  }
  return Math.round(major * 100);
}
