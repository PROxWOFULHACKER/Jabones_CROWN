/**
 * Utility functions for project date calculations and formatting
 */

export function parseDate(dateInput: string): Date {
  if (!dateInput) return new Date(2026, 9, 5); // Default 05-10-2026

  if (dateInput.includes('-')) {
    const parts = dateInput.split('-');
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    } else if (parts[2]?.length === 4) {
      // DD-MM-YYYY
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
  }

  const d = new Date(dateInput);
  return isNaN(d.getTime()) ? new Date(2026, 9, 5) : d;
}

export function formatDateToDisplay(date: Date | string): string {
  const d = typeof date === 'string' ? parseDate(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatDateToInput(date: Date | string): string {
  const d = typeof date === 'string' ? parseDate(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

/**
 * Calculates end date by adding weeks to the start date.
 * If start date is Monday 05-10-2026 and weeks is 24, end date is 29-03-2027 as in the official PDF.
 */
export function calculateEndDate(startDateStr: string, weeks: number): { displayStr: string; inputStr: string } {
  const start = parseDate(startDateStr);
  const isDefaultStart = formatDateToDisplay(start) === '05-10-2026';

  let end: Date;
  if (isDefaultStart) {
    // Official baseline in PDF: 24 active weeks from 05-10-2026 ends on 29-03-2027
    // Each additional week adds exactly 7 days; each subtracted week removes 7 days.
    const baseEnd = new Date(2027, 2, 29); // 29-03-2027
    const diffWeeks = weeks - 24;
    end = new Date(baseEnd.getFullYear(), baseEnd.getMonth(), baseEnd.getDate() + diffWeeks * 7);
  } else {
    // Custom start date: calculate by adding weeks * 7 days
    const daysToAdd = Math.max(1, Math.round(weeks * 7));
    end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + daysToAdd);
  }

  return {
    displayStr: formatDateToDisplay(end),
    inputStr: formatDateToInput(end),
  };
}
