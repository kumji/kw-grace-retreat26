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
  detail: string;
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
    detail: '우리의 정성과 감사로 강단을 아름답게 꾸며보는 따뜻한 시간입니다. 처음이어도 누구나 편안하게 참여하실 수 있어요.',
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
    detail: '창업에 대한 전문적인 코칭 프로그램입니다.',
    slots: [
      { id: 'time1', label: '타임1', capacity: null, unitLabel: '명' },
      { id: 'time2', label: '타임2', capacity: null, unitLabel: '명' },
    ],
  },
  {
    id: 'meet-myself-drawing',
    name: '그림으로 만나는 나',
    location: '미정',
    detail: '간단하고 재미있는 그림 활동을 통해 나의 마음과 내 안의 힘을 발견하고, 따뜻하게 보듬어 주는 시간입니다. 그림을 잘 그리지 않아도 괜찮습니다.',
    slots: [
      {
        id: 'time1',
        label: '타임1',
        capacity: 5,
        unitLabel: '부부',
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
    detail: '손끝으로 전하는 따뜻한 마음, 나만의 파우치를 만들어 보세요. 초보자도 쉽게 완성할 수 있어요.',
    slots: [
      { id: 'time1', label: '타임1', capacity: 10, unitLabel: '명' },
      { id: 'time2', label: '타임2', capacity: 10, unitLabel: '명' },
    ],
  },
  {
    id: 'pingpong',
    name: '탁구로 하나되는 우리',
    location: '미정',
    detail: '운동을 사랑하는 모두가 함께 웃고, 함께 뛰고, 함께 친해지는 즐거운 친교의 시간입니다. 초보자도 부담 없이 참여할 수 있어요.',
    slots: [
      { id: 'time1', label: '타임1', capacity: 10, unitLabel: '명' },
      { id: 'time2', label: '타임2', capacity: 10, unitLabel: '명' },
    ],
  },
  {
    id: 'ai-parenting',
    name: 'AI시대의 자녀교육',
    location: '미정',
    detail: 'AI시대 대학의 변화와 대응을 통해 AI시대의 자녀교육에 대한 단상을 전하려고 합니다.',

    slots: [
      { id: 'time1', label: '타임1', capacity: 20, unitLabel: '명' },
      { id: 'time2', label: '타임2', capacity: 20, unitLabel: '명' },
    ],
  },
  {
    id: 'gospel-conversation',
    name: '복음적 대화훈련',
    location: '미정',
    detail: '상대를 바꾸거나 통제하는 대화 기술이 아니라, 하나님 앞에서 자신을 먼저 직면하고 "사랑 안에서 진실을 말하는 대화 구조" 를 체화하여 "화목하게 하는 직분"을 실제 관계 속에서 살아내도록 돕는 복음적 훈련입니다.',
    slots: [
      { id: 'time1', label: '타임1', capacity: 4, unitLabel: '명' },
      { id: 'time2', label: '타임2', capacity: 4, unitLabel: '명' },
    ],
  },
  {
    id: 'tax-life',
    name: '슬기로운 세금 생활',
    location: '미정',
    detail: '세무전반에 대해 자유롭게 대화할 예정이며 주제는 크게 다음과 같습니다. 1. 사업자 세금(부가가차세, 종합소득세) 2. 근로자 세금(연말정산) 3. 재산제세(양도 상속 증여세)',
    slots: [
      { id: 'time1', label: '타임1', capacity: 6, unitLabel: '명' },
      { id: 'time2', label: '타임2', capacity: 6, unitLabel: '명' },
    ],
  },
  {
    id: 'career-change',
    name: '취업과 이직에 대한 영적 대화',
    location: '미정',
    detail: '불4화(불만·불평·불신·불안)로 가득한 우리의 직장생활, 이대로 괜찮은 걸까요 주님…? 솔직담백 영적 수다의 시간으로 초대합니다.',
    slots: [
      { id: 'time1', label: '타임1', capacity: 8, unitLabel: '명' },
      { id: 'time2', label: '타임2', capacity: 8, unitLabel: '명' },
    ],
  },
  {
    id: 'book-club',
    name: '북클럽 - 좋아하는 책 소개',
    location: '미정',
    detail: '홀로 읽기 아까워 당신에게 건네는 책 이야기. 내가 읽은 책을 소개하는 시간입니다.(장르불문) 책은 가져오셔도 되고 안 가져오셔도 됩니다.',
    slots: [
      { id: 'time1', label: '타임1', capacity: 8, unitLabel: '명' },
      { id: 'time2', label: '타임2', capacity: 8, unitLabel: '명' },
    ],
  },
];
