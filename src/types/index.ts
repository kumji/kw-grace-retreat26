export type Affiliation = '청장1부' | '청장2부' | '지교회';
export type BloodType = 'A' | 'B' | 'O' | 'AB';
export type LodgingOption = 'O' | 'X';
export type PaymentStatus = '입금전' | '입금완료';
export type RegistrationState = '접수예정' | '접수중' | '접수마감';

export interface FamilyAdult {
  name: string;
  birthMonth: number;
  bloodType: BloodType;
  lodging: LodgingOption;
}

export interface FamilyChild {
  name: string;
  age: number;
  lodging: LodgingOption;
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
  childFee: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  earlyBirdBenefit: string;
  notice: string;
  guideText: string;
  registrationState: RegistrationState;
}
