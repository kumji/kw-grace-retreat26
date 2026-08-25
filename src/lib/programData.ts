import type { Affiliation } from '@/types';

export interface ProgramSlot {
  id: string;
  label: string;
  capacity: number | null;
  unitLabel: string;
  allowedAffiliations?: Affiliation[];
  note?: string;
  /** 이 신청이 실제로 차지하는 시간대(타임) id 목록. 지정하지 않으면 본인 id 하나만 차지한다. */
  occupiesSlotIds?: string[];
}

export interface ProgramDef {
  id: string;
  name: string;
  location: string;
  slots: ProgramSlot[];
}

export function getOccupiedSlotIds(slot: Pick<ProgramSlot, 'id' | 'occupiesSlotIds'>): string[] {
  return slot.occupiesSlotIds ?? [slot.id];
}

export function findProgramSlot(programId: string, slotId: string): ProgramSlot | undefined {
  return PROGRAMS.find((p) => p.id === programId)?.slots.find((s) => s.id === slotId);
}

// 프로그램 구성은 매년 새로 정해지고 자주 바뀌지 않아 하드코딩으로 관리한다.
export const PROGRAMS: ProgramDef[] = [
  {
    id: 'flower',
    name: '강단 꽃꽂이',
    location: '미정',
    slots: [
      {
        id: 'time1',
        label: '타임1',
        capacity: 15,
        unitLabel: '명',
        note: '90분 소요 · 타임1·타임2를 모두 사용합니다',
        occupiesSlotIds: ['time1', 'time2'],
      },
    ],
  },
  {
    id: 'startup-coaching',
    name: '창업코칭',
    location: '미정',
    slots: [
      { id: 'time1', label: '타임1', capacity: null, unitLabel: '명' },
      { id: 'time2', label: '타임2', capacity: null, unitLabel: '명' },
    ],
  },
  {
    id: 'meet-myself-drawing',
    name: '그림으로 만나는 나',
    location: '미정',
    slots: [
      {
        id: 'time1',
        label: '타임1',
        capacity: 5,
        unitLabel: '쌍',
        allowedAffiliations: ['청장2부'],
        note: '부부 신청 · 청장2부만 신청 가능',
      },
      {
        id: 'time2',
        label: '타임2',
        capacity: 8,
        unitLabel: '명',
        allowedAffiliations: ['청장1부'],
        note: '개인 신청 · 청장1부만 신청 가능',
      },
    ],
  },
  {
    id: 'knitting',
    name: '셀리나와 함께하는 뜨개질',
    location: '미정',
    slots: [
      { id: 'time1', label: '타임1', capacity: 10, unitLabel: '명' },
      { id: 'time2', label: '타임2', capacity: 10, unitLabel: '명' },
    ],
  },
  {
    id: 'pingpong',
    name: '탁구',
    location: '미정',
    slots: [
      { id: 'time1', label: '타임1', capacity: 10, unitLabel: '명' },
      { id: 'time2', label: '타임2', capacity: 10, unitLabel: '명' },
    ],
  },
  {
    id: 'ai-parenting',
    name: 'AI시대의 자녀교육',
    location: '미정',
    slots: [
      { id: 'time1', label: '타임1', capacity: 20, unitLabel: '명' },
      { id: 'time2', label: '타임2', capacity: 20, unitLabel: '명' },
    ],
  },
  {
    id: 'gospel-conversation',
    name: '복음적 대화훈련',
    location: '미정',
    slots: [
      { id: 'time1', label: '타임1', capacity: 4, unitLabel: '명' },
      { id: 'time2', label: '타임2', capacity: 4, unitLabel: '명' },
    ],
  },
  {
    id: 'tax-life',
    name: '슬기로운 세금 생활',
    location: '미정',
    slots: [
      { id: 'time1', label: '타임1', capacity: 6, unitLabel: '명' },
      { id: 'time2', label: '타임2', capacity: 6, unitLabel: '명' },
    ],
  },
  {
    id: 'career-change',
    name: '취업과 이직에 관한 대화',
    location: '미정',
    slots: [
      { id: 'time1', label: '타임1', capacity: 8, unitLabel: '명' },
      { id: 'time2', label: '타임2', capacity: 8, unitLabel: '명' },
    ],
  },
  {
    id: 'book-club',
    name: '북클럽 - 좋아하는 책 소개',
    location: '미정',
    slots: [
      { id: 'time1', label: '타임1', capacity: 8, unitLabel: '명' },
      { id: 'time2', label: '타임2', capacity: 8, unitLabel: '명' },
    ],
  },
];
