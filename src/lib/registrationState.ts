import type { Registration, Settings } from '@/types';

export type RegistrationPhase = 'pending' | 'earlybird' | 'regular' | 'closed';

export interface RegistrationStatus {
  canRegister: boolean;
  phase: RegistrationPhase;
  message: string;
}

function localDateISO(date: Date): string {
  const tzOffsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 10);
}

function todayISO(): string {
  return localDateISO(new Date());
}

function isWithin(date: string, start: string, end: string): boolean {
  return Boolean(start) && Boolean(end) && date >= start && date <= end;
}

export function isEarlyBirdActive(settings: Pick<Settings, 'earlyBirdStart' | 'earlyBirdEnd'>): boolean {
  return isWithin(todayISO(), settings.earlyBirdStart, settings.earlyBirdEnd);
}

// 얼리버드 혜택 대상 = 얼리버드 종료일 이전에 등록했고, 입금완료 처리도 종료일 이전에 이뤄진 건.
// 임원 등 일부는 공식 얼리버드 시작일 이전에 미리 등록했는데, 그런 경우도 얼리버드로 인정하기 위해
// 등록일은 시작일이 아니라 종료일만 기준으로 삼는다(종료일 이후 등록만 일반).
//
// 이 함수는 입금완료로 "처리되는 바로 그 순간"에 한 번만 호출해서 결과를
// registration.earlyBirdEligible에 고정 저장한다(services/registrations.ts의
// createRegistration·setPaymentStatus 참고). 화면에서 매번 다시 계산하지 않으므로,
// 마감을 넘겨서 입금 확인을 누르면(오늘 날짜가 종료일보다 뒤) 그 결과는 항상 얼리버드가 아니게 되고,
// 이후 입금 상태가 바뀌어도 그 판정이 다시 바뀌지 않는다.
export function isEarlyBirdEligible(
  registration: Pick<Registration, 'createdAt'>,
  settings: Pick<Settings, 'earlyBirdEnd'>,
): boolean {
  if (!settings.earlyBirdEnd) return false;
  if (localDateISO(new Date(registration.createdAt)) > settings.earlyBirdEnd) return false;
  return todayISO() <= settings.earlyBirdEnd;
}

function nowLocalMinuteISO(): string {
  const now = new Date();
  const tzOffsetMs = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tzOffsetMs).toISOString().slice(0, 16);
}

// 선택 프로그램 신청은 별도의 선착순 접수 시각(관리자 설정)으로 열리고 닫힌다.
export function isProgramSignupActive(
  settings: Pick<Settings, 'programSignupStart' | 'programSignupEnd'>,
): boolean {
  if (!settings.programSignupStart || !settings.programSignupEnd) return false;
  const now = nowLocalMinuteISO();
  return now >= settings.programSignupStart && now <= settings.programSignupEnd;
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
    return { canRegister: false, phase: 'closed', message: '등록이 마감되었습니다.' };
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

  return { canRegister: false, phase: 'closed', message: '등록이 마감되었습니다.' };
}
