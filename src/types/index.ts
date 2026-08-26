export type Affiliation = '청장1부' | '청장2부' | '지성전';
export type BloodType = 'A' | 'B' | 'O' | 'AB';
export type LodgingOption = '침대방' | '온돌방' | '숙박안함';
export type PaymentStatus = '입금전' | '입금완료';
export type RegistrationState = '등록예정' | '등록중' | '등록마감';
export type SchoolStatus = '취학' | '미취학';

export interface FamilyAdult {
  name: string;
  birthMonth: number;
  bloodType: BloodType;
}

export interface FamilyChild {
  name: string;
  age: number;
  schoolStatus: SchoolStatus;
}

export interface Registration {
  id: string;
  name: string;
  affiliation: Affiliation;
  phone: string;
  birthMonth: number;
  bloodType: BloodType;
  lodging: LodgingOption;
  adults: FamilyAdult[];
  children: FamilyChild[];
  note: string;
  totalCount: number;
  amountDue: number;
  paymentStatus: PaymentStatus;
  // 얼리버드 혜택 대상 여부는 등록 시점에 한 번 확정되면 이후 입금 상태가 바뀌어도 다시 계산하지 않는다.
  // (마감을 넘겨서 입금하는 사람이 나중에 자동으로 얼리버드가 되는 것을 막기 위함)
  earlyBirdEligible: boolean;
  checkedIn: boolean;
  checkedInAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export type RegistrationInput = Omit<
  Registration,
  | 'id'
  | 'totalCount'
  | 'amountDue'
  | 'paymentStatus'
  | 'earlyBirdEligible'
  | 'checkedIn'
  | 'checkedInAt'
  | 'createdAt'
  | 'updatedAt'
>;

export interface Settings {
  earlyBirdStart: string;
  earlyBirdEnd: string;
  regularStart: string;
  regularEnd: string;
  adultFee: number;
  schoolAgeChildFee: number;
  preschoolChildFee: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  earlyBirdBenefit: string;
  notice: string;
  guideText: string;
  registrationState: RegistrationState;
  programSignupStart: string;
  programSignupEnd: string;
}

export interface ProgramSignup {
  id: string;
  programId: string;
  slotId: string;
  name: string;
  affiliation: Affiliation;
  createdAt: number;
}

export type ProgramSignupInput = Pick<ProgramSignup, 'programId' | 'slotId' | 'name' | 'affiliation'>;
