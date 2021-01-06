export const formatAmount = (valueInCents: number): string => Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
}).format(valueInCents / 100)

export const unformatAmount = (formattedValue: string): number => Number(formattedValue.replace(/[.]/ig, '').replace(/,/, '.'))
