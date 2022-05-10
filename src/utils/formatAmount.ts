export const formatAmount = (valueInCents: number = 0): string => Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
}).format(valueInCents / 100)

export const unformatAmount = (formattedValue: string): number => Number(formattedValue.replace(/[,]/ig, ''))
