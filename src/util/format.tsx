export const { format: formatPrice } = new Intl.NumberFormat('usd-en', {
  style: 'currency',
  currency: 'USD',
});
