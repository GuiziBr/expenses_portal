const formatAmount = (valueInCents: number): string => Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
}).format(valueInCents / 100)

export default formatAmount
