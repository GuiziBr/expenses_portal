const formatDate = (date: Date): string => new Date(date).toLocaleDateString('pt-br', { timeZone: 'UTC' })

export default formatDate
