import type { FamilyAdult, FamilyChild, Settings } from '@/types';

export function calcTotalCount(adults: FamilyAdult[], children: FamilyChild[]): number {
  return 1 + adults.length + children.length;
}

export function calcAmountDue(
  adults: FamilyAdult[],
  children: FamilyChild[],
  settings: Pick<Settings, 'adultFee' | 'childFee'>,
): number {
  return (1 + adults.length) * settings.adultFee + children.length * settings.childFee;
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}
