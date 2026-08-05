import type { Affiliation, BloodType, LodgingOption, PaymentStatus, Registration } from '@/types';

export type RowCategory = '대표' | '성인' | '자녀';

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
  etc: string;
}

export function buildDisplayRows(registrations: Registration[]): DisplayRow[] {
  const rows: DisplayRow[] = [];

  for (const r of registrations) {
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
        etc: '',
      });
    }

    for (const child of r.children) {
      rows.push({
        registrationId: r.id,
        category: '자녀',
        registrantName: r.name,
        name: child.name,
        affiliation: r.affiliation,
        phone: r.phone,
        birthMonth: '',
        bloodType: '',
        lodging: child.lodging,
        paymentStatus: r.paymentStatus,
        checkedIn: r.checkedIn,
        etc: `나이 : 만 ${child.age}세`,
      });
    }
  }

  return rows;
}

export function countMembers(registrations: Registration[]): { adults: number; children: number; total: number } {
  const adults = registrations.reduce((sum, r) => sum + 1 + r.adults.length, 0);
  const children = registrations.reduce((sum, r) => sum + r.children.length, 0);
  return { adults, children, total: adults + children };
}
