import { LivePark } from "../types/Park";
import { ScheduleInfo } from "../types/Schedule";
import formatTime from "./time";

export function getScheduleInfo(park: LivePark): ScheduleInfo {
  const parkSchedule = park.schedule;
  if (!parkSchedule) return { regular: null, additional: [] };

  // Get schedule items for today
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const scheduleToday = parkSchedule.schedule.filter(s => s.date === dateStr);
  if (!scheduleToday || scheduleToday.length === 0) return { regular: null, additional: [] };

  const regularHours = scheduleToday.find(s => s.type === 'OPERATING');
  return {
    regular: regularHours ? {
      open: formatTime(regularHours.openingTime, park.timezone),
      close: formatTime(regularHours.closingTime, park.timezone)
    } : null,
    additional: scheduleToday
      .filter(s => s.type !== 'OPERATING')
      .map(schedule => ({
        type: schedule.type,
        open: formatTime(schedule.openingTime, park.timezone),
        close: formatTime(schedule.closingTime, park.timezone)
      }))
  };
}

export function formatScheduleType(type: string | undefined): string {
  if (!type) return '';
  return type.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

export function getScheduleBadgeStyle(type: string | undefined): { bg: string, text: string } {
  switch (type) {
    case 'EXTRA_HOURS':
      return { bg: 'bg-blue-500/20', text: 'text-blue-300' };
    case 'EARLY_ENTRY':
      return { bg: 'bg-purple-500/20', text: 'text-purple-300' };
    case 'SPECIAL_EVENT':
      return { bg: 'bg-amber-500/20', text: 'text-amber-300' };
    case 'EXTENDED_HOURS':
      return { bg: 'bg-emerald-500/20', text: 'text-emerald-300' };
    default:
      return { bg: 'bg-gray-500/20', text: 'text-gray-300' };
  }
}