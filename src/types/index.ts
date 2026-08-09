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
}
