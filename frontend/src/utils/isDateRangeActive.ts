export const isDateRangeActive = (validFrom?: string, validUntil?: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fromDate = validFrom ? new Date(validFrom) : null;
  const untilDate = validUntil ? new Date(validUntil) : null;

  return (!fromDate || fromDate <= today) && (!untilDate || untilDate >= today);
};
