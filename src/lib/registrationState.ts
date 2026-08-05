import type { Settings } from '@/types';

export type RegistrationPhase = 'pending' | 'earlybird' | 'regular' | 'closed';

export interface RegistrationStatus {
  canRegister: boolean;
  phase: RegistrationPhase;
  message: string;
}

function todayISO(): string {
  const now = new Date();
  const tzOffsetMs = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tzOffsetMs).toISOString().slice(0, 10);
}

function isWithin(date: string, start: string, end: string): boolean {
  return Boolean(start) && Boolean(end) && date >= start && date <= end;
}

export function isEarlyBirdActive(settings: Pick<Settings, 'earlyBirdStart' | 'earlyBirdEnd'>): boolean {
  return isWithin(todayISO(), settings.earlyBirdStart, settings.earlyBirdEnd);
}

export function formatMonthDay(dateISO: string): string {
  if (!dateISO) return '';
  const [, month, day] = dateISO.split('-').map(Number);
  return `${month}월 ${day}일`;
}

export function formatDateRangeKorean(startISO: string, endISO: string): string {
  if (!startISO || !endISO) return '';
  return `${formatMonthDay(startISO)} ~ ${formatMonthDay(endISO)}`;
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
}

export function getCountdownParts(deadlineISO: string, now: Date = new Date()): CountdownParts {
  const deadline = new Date(`${deadlineISO}T23:59:59`);
  const diffMs = Math.max(0, deadline.getTime() - now.getTime());
  const totalMinutes = Math.floor(diffMs / 60_000);
  return {
    days: Math.floor(totalMinutes / (60 * 24)),
    hours: Math.floor((totalMinutes % (60 * 24)) / 60),
    minutes: totalMinutes % 60,
  };
}

export function getRegistrationStatus(settings: Settings): RegistrationStatus {
  if (settings.registrationState === '등록예정') {
    return { canRegister: false, phase: 'pending', message: '등록 예정입니다.' };
  }
  if (settings.registrationState === '등록마감') {
    return { canRegister: false, phase: 'closed', message: '등록가 마감되었습니다.' };
  }

  const date = todayISO();

  if (isWithin(date, settings.earlyBirdStart, settings.earlyBirdEnd)) {
    return { canRegister: true, phase: 'earlybird', message: '얼리버드 등록 중입니다.' };
  }
  if (isWithin(date, settings.regularStart, settings.regularEnd)) {
    return { canRegister: true, phase: 'regular', message: '일반 등록 중입니다.' };
  }

  const beforeStart =
    (settings.earlyBirdStart && date < settings.earlyBirdStart) ||
    (!settings.earlyBirdStart && settings.regularStart && date < settings.regularStart);

  if (beforeStart) {
    return { canRegister: false, phase: 'pending', message: '등록 예정입니다.' };
  }

  return { canRegister: false, phase: 'closed', message: '등록가 마감되었습니다.' };
}
