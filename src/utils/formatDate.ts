const formatDate = (date: Date, isDesktop = true): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    ...isDesktop && { year: 'numeric' },
  }
  return new Date(date).toLocaleDateString('en-US', options)
}

export default formatDate
