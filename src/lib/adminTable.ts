import type { Affiliation, BloodType, LodgingOption, PaymentStatus, Registration } from '@/types';

export type RowCategory = '대표' | '성인' | '취학' | '미취학';
export type RegistrationPhaseLabel = '얼리버드' | '일반';

export interface DisplayRow {
  registrationId: string;
  category: RowCategory;
  registrantName: string;
  name: string;
  affiliation: Affiliation;
  phone: string;
  birthMonth: number | '';
  bloodType: BloodType | '';
  lodging: LodgingOption;
  paymentStatus: PaymentStatus;
  checkedIn: boolean;
  registrationPhase: RegistrationPhaseLabel;
  etc: string;
}

export function buildDisplayRows(registrations: Registration[]): DisplayRow[] {
  const rows: DisplayRow[] = [];

  for (const r of registrations) {
    const registrationPhase: RegistrationPhaseLabel = r.earlyBirdEligible ? '얼리버드' : '일반';

    rows.push({
      registrationId: r.id,
      category: '대표',
      registrantName: r.name,
      name: r.name,
      affiliation: r.affiliation,
      phone: r.phone,
      birthMonth: r.birthMonth,
      bloodType: r.bloodType,
      lodging: r.lodging,
      paymentStatus: r.paymentStatus,
      checkedIn: r.checkedIn,
      registrationPhase,
      etc: '',
    });

    for (const adult of r.adults) {
      rows.push({
        registrationId: r.id,
        category: '성인',
        registrantName: r.name,
        name: adult.name,
        affiliation: r.affiliation,
        phone: r.phone,
        birthMonth: adult.birthMonth,
        bloodType: adult.bloodType,
        lodging: r.lodging,
        paymentStatus: r.paymentStatus,
        checkedIn: r.checkedIn,
        registrationPhase,
        etc: '',
      });
    }

    for (const child of r.children) {
      rows.push({
        registrationId: r.id,
        category: child.schoolStatus,
        registrantName: r.name,
        name: child.name,
        affiliation: r.affiliation,
        phone: r.phone,
        birthMonth: '',
        bloodType: '',
        lodging: r.lodging,
        paymentStatus: r.paymentStatus,
        checkedIn: r.checkedIn,
        registrationPhase,
        etc: `나이 : 만 ${child.age}세`,
      });
    }
  }

  return rows;
}

export function countMembers(registrations: Registration[]): { adults: number; schoolAged_children: number; preschoolAged_children: number; total: number } {
  const adults = registrations.reduce((sum, r) => sum + 1 + r.adults.length, 0);
  const schoolAged_children = registrations.reduce((sum, r) => sum + r.children.filter((c) => c.schoolStatus === '취학').length, 0);
  const preschoolAged_children = registrations.reduce((sum, r) => sum + r.children.filter((c) => c.schoolStatus === '미취학').length, 0);

  return { adults, schoolAged_children,preschoolAged_children, total: adults + schoolAged_children + preschoolAged_children };
}
