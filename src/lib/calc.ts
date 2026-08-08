import type { FamilyAdult, FamilyChild, Settings } from '@/types';

export function calcTotalCount(adults: FamilyAdult[], children: FamilyChild[]): number {
  return 1 + adults.length + children.length;
}

export function calcAmountDue(
  adults: FamilyAdult[],
  children: FamilyChild[],
  settings: Pick<Settings, 'adultFee' | 'schoolAgeChildFee' | 'preschoolChildFee'>,
): number {
  const childrenFee = children.reduce(
    (sum, child) =>
      sum + (child.schoolStatus === '취학' ? settings.schoolAgeChildFee : settings.preschoolChildFee),
    0,
  );
  return (1 + adults.length) * settings.adultFee + childrenFee;
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}
