import { format, eachHourOfInterval, addDays, parseISO, parse } from 'date-fns'

export const currentDate = () => {
  return format(new Date(), 'yyyy-MM-dd')
}

export const tomorrowDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return format(date, 'yyyy-MM-dd')
}

const generateHoursRange = (startDate, endDate) => {
  const hours = eachHourOfInterval({ start: startDate, end: endDate })
  return hours.map((hour) => {
    return {
      value: format(hour, 'HH:mm'),
      text: format(hour, 'HH:mm - dd/MM/yyyy')
    }
  })
}

export const getCheckinHours = (startDate) => {
  const start = new Date(addOneDayToDate(startDate)).setHours(15, 0, 0)
  const end = new Date(addOneDayToDate(startDate))
  end.setDate(end.getDate() + 1)
  end.setHours(6, 0, 0)
  return generateHoursRange(start, end)
}

export const getCheckoutHours = (endDate) => {
  const start = new Date(addOneDayToDate(endDate)).setHours(6, 0, 0)
  const end = new Date(addOneDayToDate(endDate)).setHours(11, 0, 0)
  return generateHoursRange(start, end)
}

export const addOneDayToDate = (dateString) => {
  if (!dateString) { return }
  const formattedDate = new Date(dateString)
  const newDate = addDays(formattedDate, 1)
  return newDate.toISOString().slice(0, 10)
}

export const today = new Date().setHours(0, 0, 0, 0)

export const validDate = new Date(1900, 0, 1)

export const getParsedDate = (dateToParse) => {
  return parse(dateToParse, 'dd/MM/yyyy', today)
}

export const formatToFrontend = (dateToFormat) => {
  return format(parseISO(dateToFormat), 'dd/MM/yyyy')
}

export const calculateDateDifference = (start, end) => {
  if (start && end) {
    const diffInDays = Math.floor((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24))
    return diffInDays
  }
}
