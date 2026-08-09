export interface ScheduleItem {
  time: string;
  title: string;
  subtitle?: string[];
}

export interface ScheduleDay {
  day: string;
  items: ScheduleItem[];
}

// 행사 시간표는 매년 내용이 크게 바뀌지 않고 관리자 화면에서 자주 손댈 항목이 아니라 하드코딩으로 관리한다.
export const EVENT_SCHEDULE: ScheduleDay[] = [
  {
    day: '8/29(토)',
    items: [
      { time: '10:00 ~ 11:00', title: '수련회 등록 및 방배정' },
      {
        time: '11:00 ~ 12:00',
        title: '개회 예배(집회1)',
        subtitle: ['순종(삼상 15:22)', '송양근 목사'],
      },
      { time: '12:00 ~ 13:00', title: '점심식사' },
      { time: '13:00 ~ 15:00', title: '청장 올림픽' },
      { time: '15:30 ~ 16:20', title: '선택 프로그램 1' },
      { time: '16:30 ~ 17:20', title: '선택 프로그램 2' },
      { time: '17:30 ~ 18:30', title: '저녁식사' },
      {
        time: '19:00 ~ 21:00',
        title: '저녁 집회(집회2)',
        subtitle: ['부르심 : 나를 위해 예비하신 은혜(딤후 1:9)', '황지수 목사', '#축복안수기도'],
      },
      { time: '21:30 ~ 22:30', title: '야식 및 속별 교제시간' },
    ],
  },
  {
    day: '8/30(일)',
    items: [
      { time: '06:00 ~ 07:00', title: '새벽기도회', subtitle: ['황지수 목사'] },
      { time: '08:00 ~ 09:00', title: '아침식사' },
      { time: '09:00 ~ 10:00', title: '숙소정리' },
      {
        time: '10:00 ~ 12:00',
        title: '주일 예배(집회3)',
        subtitle: ['택하심: 어떻게 쓰임 받을 것인가?(롬 9:17-18)', '황지수 목사', '#성찬식 #축복안수기도'],
      },
      { time: '12:00 ~ 13:00', title: '점심식사 및 달란트 잔치' },
      { time: '13:00 ~', title: '복귀' },
    ],
  },
];
