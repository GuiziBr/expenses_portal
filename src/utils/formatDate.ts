const formatDate = (date: Date): string => new Date(date).toLocaleDateString(
  'en-US', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' },
)

export default formatDate
